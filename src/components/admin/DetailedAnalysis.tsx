import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ChevronDown, Loader2, FileSpreadsheet, FileText } from "lucide-react";
import { useSectionStats } from "@/hooks/useSectionStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  alojamentoOptions,
  escalaOptions,
  ranchoOptions,
  sectorOptions,
} from "./filterOptions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const ratingIcons: Record<RatingColumn, string> = {
  "Concordo totalmente": "✅",
  "Concordo": "✅",
  "Discordo": "⚠️",
  "Discordo totalmente": "❌",
};

const ratingColorDescriptions: Record<RatingColumn, string> = {
  "Concordo totalmente": "Tons suaves de azul destacam o grau máximo de concordância",
  Concordo: "Azuis claros sinalizam concordância moderada sem perder o tom neutro",
  Discordo: "Cinzas claros representam discordância moderada de forma neutra",
  "Discordo totalmente": "Cinzas mais marcantes evidenciam a discordância total mantendo a paleta sóbria",
};

type TableRowData = {
  section: string;
  question: string;
  ratings: Record<RatingColumn, { count: number; percentage: number }>;
};

export function DetailedAnalysis() {
  const [selectedSector, setSelectedSector] = useState("all");
  const [alojamentoFilter, setAlojamentoFilter] = useState("all");
  const [ranchoFilter, setRanchoFilter] = useState("all");
  const [escalaFilter, setEscalaFilter] = useState("all");

  const filters = useMemo(
    () => ({
      ...(selectedSector !== "all" ? { setor: selectedSector } : {}),
      ...(alojamentoFilter !== "all" ? { alojamento: alojamentoFilter } : {}),
      ...(ranchoFilter !== "all" ? { rancho: ranchoFilter } : {}),
      ...(escalaFilter !== "all" ? { escala: escalaFilter } : {}),
    }),
    [selectedSector, alojamentoFilter, ranchoFilter, escalaFilter]
  );

  const environment = useSectionStats("environment", filters);
  const relationship = useSectionStats("relationship", filters);
  const motivation = useSectionStats("motivation", filters);

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

  const getActiveFiltersText = () => {
    const activeFilters = [];
    if (selectedSector !== "all") {
      const sectorLabel = sectorOptions.find(s => s.value === selectedSector)?.label;
      activeFilters.push(`Setor: ${sectorLabel}`);
    }
    if (alojamentoFilter !== "all") {
      const alojamentoLabel = alojamentoOptions.find(a => a.value === alojamentoFilter)?.label;
      activeFilters.push(`Alojamento: ${alojamentoLabel}`);
    }
    if (ranchoFilter !== "all") {
      const ranchoLabel = ranchoOptions.find(r => r.value === ranchoFilter)?.label;
      activeFilters.push(`Rancho: ${ranchoLabel}`);
    }
    if (escalaFilter !== "all") {
      const escalaLabel = escalaOptions.find(e => e.value === escalaFilter)?.label;
      activeFilters.push(`Escala: ${escalaLabel}`);
    }
    return activeFilters.length > 0 ? activeFilters.join(" | ") : "Todos os dados";
  };

  const exportToExcel = () => {
    // Preparar dados para exportação
    const exportData = sortedRows.map((row) => {
      const rowData: any = {
        "Seção": row.section,
        "Questão": row.question,
      };

      ratingColumns.forEach((column) => {
        const rating = row.ratings[column];
        rowData[`${column} (Qtd)`] = rating?.count ?? 0;
        rowData[`${column} (%)`] = (rating?.percentage ?? 0).toFixed(1) + "%";
      });

      return rowData;
    });

    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Ajustar largura das colunas
    const colWidths = [
      { wch: 20 }, // Seção
      { wch: 50 }, // Questão
      { wch: 15 }, // Concordo totalmente (Qtd)
      { wch: 15 }, // Concordo totalmente (%)
      { wch: 15 }, // Concordo (Qtd)
      { wch: 15 }, // Concordo (%)
      { wch: 15 }, // Discordo (Qtd)
      { wch: 15 }, // Discordo (%)
      { wch: 15 }, // Discordo totalmente (Qtd)
      { wch: 15 }, // Discordo totalmente (%)
    ];
    ws["!cols"] = colWidths;

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, "Análise Detalhada");

    // Gerar nome do arquivo com filtros ativos
    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `analise-detalhada-${timestamp}.xlsx`;

    // Fazer download
    XLSX.writeFile(wb, fileName);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Título
    doc.setFontSize(16);
    doc.text("Análise Detalhada - Distribuição das Respostas", 14, 15);

    // Filtros ativos
    doc.setFontSize(10);
    doc.text(`Filtros: ${getActiveFiltersText()}`, 14, 22);

    // Preparar dados para a tabela
    const tableData = sortedRows.map((row) => {
      return [
        `${row.section}\n${row.question}`,
        `${row.ratings["Concordo totalmente"]?.count ?? 0}\n${(row.ratings["Concordo totalmente"]?.percentage ?? 0).toFixed(1)}%`,
        `${row.ratings["Concordo"]?.count ?? 0}\n${(row.ratings["Concordo"]?.percentage ?? 0).toFixed(1)}%`,
        `${row.ratings["Discordo"]?.count ?? 0}\n${(row.ratings["Discordo"]?.percentage ?? 0).toFixed(1)}%`,
        `${row.ratings["Discordo totalmente"]?.count ?? 0}\n${(row.ratings["Discordo totalmente"]?.percentage ?? 0).toFixed(1)}%`,
      ];
    });

    // Gerar tabela
    autoTable(doc, {
      head: [
        [
          "Seção / Questão",
          "✅ Concordo totalmente",
          "✅ Concordo",
          "⚠️ Discordo",
          "❌ Discordo totalmente",
        ],
      ],
      body: tableData,
      startY: 28,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 35, halign: "center" },
        2: { cellWidth: 35, halign: "center" },
        3: { cellWidth: 35, halign: "center" },
        4: { cellWidth: 35, halign: "center" },
      },
      alternateRowStyles: {
        fillColor: [245, 249, 255],
      },
    });

    // Gerar nome do arquivo
    const timestamp = new Date().toISOString().split("T")[0];
    const fileName = `analise-detalhada-${timestamp}.pdf`;

    // Fazer download
    doc.save(fileName);
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
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle>Distribuição das respostas por questão</CardTitle>
              <CardDescription>
                Quantidade de respostas e porcentagem por alternativa nas seções Ambiente de Trabalho, Relacionamento e Motivação.
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={exportToExcel}
                disabled={sortedRows.length === 0 || loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Exportar Excel
              </Button>
              <Button
                onClick={exportToPDF}
                disabled={sortedRows.length === 0 || loading}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 pb-6 md:grid-cols-2 lg:grid-cols-4">
            <Select value={selectedSector} onValueChange={setSelectedSector}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por setor" />
              </SelectTrigger>
              <SelectContent className="border-border bg-background">
                {sectorOptions.map((sector) => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={alojamentoFilter} onValueChange={setAlojamentoFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por alojamento" />
              </SelectTrigger>
              <SelectContent className="border-border bg-background">
                {alojamentoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={ranchoFilter} onValueChange={setRanchoFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por rancho" />
              </SelectTrigger>
              <SelectContent className="border-border bg-background">
                {ranchoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={escalaFilter} onValueChange={setEscalaFilter}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Filtrar por escala" />
              </SelectTrigger>
              <SelectContent className="border-border bg-background">
                {escalaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {sortedRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum dado suficiente para exibir a distribuição de respostas.
            </p>
          ) : (
            <TooltipProvider delayDuration={150}>
              <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <Table
                  className="min-w-full text-sm [&_thead_th]:px-6 [&_thead_th]:py-4 [&_tbody_td]:px-6 [&_tbody_td]:py-6 [&_tbody_tr]:border-b [&_tbody_tr]:border-border/50 [&_tbody_tr:last-child]:border-b-0"
                >
                  <TableHeader className="bg-[#0f172a] text-white">
                    <TableRow className="border-none">
                      <TableHead
                        className={cn(
                          "w-[320px] bg-[#0f172a] text-white uppercase tracking-[0.18em]",
                          "text-xs font-semibold",
                          "sticky top-0 z-10",
                          sortColumn === "section" && "text-slate-100"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => handleSort("section")}
                          className="flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:text-slate-200"
                        >
                          Seção / Questão
                          <ChevronDown
                        aria-hidden
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          sortColumn === "section"
                            ? sortDirection === "asc"
                              ? "rotate-180"
                              : "rotate-0"
                            : "rotate-180 text-slate-300"
                        )}
                      />
                    </button>
                  </TableHead>
                      {ratingColumns.map((column) => (
                        <TableHead
                          key={column}
                          className={cn(
                            "sticky top-0 z-10 min-w-[160px] bg-[#0f172a] text-white",
                            "text-center text-xs font-semibold uppercase tracking-[0.18em]",
                            sortColumn === column && "text-slate-100"
                          )}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={() => handleSort(column)}
                                aria-label={`Ordenar por ${column}. ${ratingColorDescriptions[column]}.`}
                                className="flex items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-[0.18em] transition-colors hover:text-slate-200"
                              >
                                <span aria-hidden>{ratingIcons[column]}</span>
                                {column}
                                <ChevronDown
                                  aria-hidden
                                  className={cn(
                                    "h-3.5 w-3.5 transition-transform",
                                    sortColumn === column
                                      ? sortDirection === "asc"
                                        ? "rotate-180"
                                        : "rotate-0"
                                      : "rotate-0 text-slate-300"
                                  )}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{ratingColorDescriptions[column]}</TooltipContent>
                          </Tooltip>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white/90">
                    {sortedRows.map((row) => (
                      <TableRow
                        key={`${row.section}-${row.question}`}
                        className="transition-colors odd:bg-white even:bg-[#f5f9ff] hover:bg-[#eaf2ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/40"
                        tabIndex={0}
                      >
                        <TableCell className="align-top">
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
                              aria-label={`${column}: ${rating?.count ?? 0} respostas (${(rating?.percentage ?? 0).toFixed(1)}%)`}
                              className="text-center align-middle"
                            >
                              <div className="mx-auto flex w-max min-w-[96px] flex-col items-center justify-center gap-1 rounded-xl bg-background/80 px-3 py-3 text-sm font-semibold text-foreground shadow-[0_1px_2px_rgba(15,23,42,0.08)]">
                                <span>{rating?.count ?? 0}</span>
                                <span className="text-xs font-medium text-muted-foreground">
                                  {(rating?.percentage ?? 0).toFixed(1)}%
                                </span>
                              </div>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
