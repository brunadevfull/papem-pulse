import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSectionStats } from "@/hooks/useSectionStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const sectionsMeta = [
  {
    key: "environment" as const,
    title: "Ambiente de Trabalho",
  },
  {
    key: "relationship" as const,
    title: "Relacionamento",
  },
  {
    key: "motivation" as const,
    title: "Motivação",
  },
];

const ratingColumns = [
  "Concordo totalmente",
  "Concordo",
  "Discordo",
  "Discordo totalmente",
] as const;

type RatingColumn = (typeof ratingColumns)[number];

type TableRowData = {
  section: string;
  question: string;
  ratings: Record<RatingColumn, { count: number; percentage: number }>;
};

export function DetailedAnalysis() {
  const baseFilters = useMemo(() => ({}), []);
  const environment = useSectionStats("environment", baseFilters);
  const relationship = useSectionStats("relationship", baseFilters);
  const motivation = useSectionStats("motivation", baseFilters);

  const loading = environment.loading || relationship.loading || motivation.loading;
  const error = environment.error || relationship.error || motivation.error;

  type SortColumn = "section" | RatingColumn;

  const [sortColumn, setSortColumn] = useState<SortColumn>("section");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const rows = useMemo<TableRowData[]>(() => {
    return sectionsMeta.flatMap((section) => {
      const stats =
        section.key === "environment"
          ? environment.data
          : section.key === "relationship"
            ? relationship.data
            : motivation.data;

      if (!stats) {
        return [];
      }

      return stats.questions
        .filter((question) => question.type === "likert")
        .map((question) => {
          const totalResponses = question.totalResponses ?? 0;
          const ratings: TableRowData["ratings"] = {} as TableRowData["ratings"];

          ratingColumns.forEach((column) => {
            const match = question.ratings.find((rating) => rating.rating === column);
            const count = match?.count ?? 0;
            const percentage = totalResponses > 0 ? (count / totalResponses) * 100 : 0;

            ratings[column] = {
              count,
              percentage,
            };
          });

          return {
            section: section.title,
            question: question.label,
            ratings,
          };
        });
    });
  }, [environment.data, motivation.data, relationship.data]);

  const sortedRows = useMemo(() => {
    const getSortValue = (row: TableRowData) => {
      if (sortColumn === "section") {
        return `${row.section} ${row.question}`.toLowerCase();
      }

      const ratingData = row.ratings[sortColumn];

      return ratingData?.percentage ?? 0;
    };

    return [...rows].sort((a, b) => {
      const valueA = getSortValue(a);
      const valueB = getSortValue(b);

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    });
  }, [rows, sortColumn, sortDirection]);

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortColumn(column);
    setSortDirection(column === "section" ? "asc" : "desc");
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Calculando análise detalhada...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Distribuição das respostas por questão</CardTitle>
          <CardDescription>
            Quantidade de respostas e porcentagem por alternativa nas seções Ambiente de Trabalho, Relacionamento e Motivação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum dado suficiente para exibir a distribuição de respostas.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className={cn(
                      "w-[320px]",
                      sortColumn === "section" && "text-foreground bg-muted/40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => handleSort("section")}
                      className="flex items-center gap-2 font-medium text-left transition-colors hover:text-foreground"
                    >
                      Seção / Questão
                      {sortColumn === "section" && (
                        <span className="text-xs text-muted-foreground">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </TableHead>
                  {ratingColumns.map((column) => (
                    <TableHead
                      key={column}
                      className={cn(
                        "min-w-[160px]",
                        sortColumn === column && "text-foreground bg-muted/40"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column)}
                        className="flex items-center gap-2 font-medium text-left transition-colors hover:text-foreground"
                      >
                        {column}
                        {sortColumn === column && (
                          <span className="text-xs text-muted-foreground">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRows.map((row) => (
                  <TableRow key={`${row.section}-${row.question}`}>
                    <TableCell
                      className={cn(
                        "align-top",
                        sortColumn === "section" && "bg-muted/40"
                      )}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {row.section}
                      </div>
                      <div className="text-sm font-medium text-foreground">{row.question}</div>
                    </TableCell>
                    {ratingColumns.map((column) => {
                      const rating = row.ratings[column];

                      return (
                        <TableCell
                          key={column}
                          className={cn(
                            "text-sm",
                            sortColumn === column && "bg-muted/40"
                          )}
                        >
                          <div className="text-sm font-medium text-foreground">
                            {rating?.count ?? 0} ({(rating?.percentage ?? 0).toFixed(1)}%)
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
