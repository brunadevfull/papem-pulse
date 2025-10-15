import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { useSectionStats } from "@/hooks/useSectionStats";

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

export function DetailedAnalysis() {
  const baseFilters = useMemo(() => ({}), []);
  const environment = useSectionStats("environment", baseFilters);
  const relationship = useSectionStats("relationship", baseFilters);
  const motivation = useSectionStats("motivation", baseFilters);

  const loading = environment.loading || relationship.loading || motivation.loading;
  const error = environment.error || relationship.error || motivation.error;

  const criticalPoints = useMemo(() => {
    const questions = sectionsMeta.flatMap((section) => {
      const stats = section.key === "environment" ? environment.data
        : section.key === "relationship" ? relationship.data
        : motivation.data;

      if (!stats) {
        return [];
      }

      return stats.questions
        .filter((question) => question.type === "likert" && question.average !== null)
        .map((question) => {
          const negativeCount = question.ratings.reduce((total, rating) => {
            if (rating.rating === "Discordo" || rating.rating === "Discordo totalmente") {
              return total + rating.count;
            }
            return total;
          }, 0);

          return {
            section: section.title,
            question: question.label,
            score: Math.round((question.average ?? 0) * 20),
            negativeCount,
          };
        });
    });

    return questions
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [environment.data, relationship.data, motivation.data]);

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
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Pontos que Precisam de Atenção
          </CardTitle>
          <CardDescription>
            Scores calculados pela média das respostas em escala Likert multiplicada por 20. Listamos as 5 questões com menores índices de satisfação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider delayDuration={150}>
            <div className="space-y-4">
              {criticalPoints.length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum dado suficiente para identificar pontos críticos.</p>
              )}
              {criticalPoints.map((point, index) => (
                <div
                  key={`${point.question}-${index}`}
                  className="flex items-center justify-between p-3 bg-warning-light rounded-lg border border-warning/20"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{point.question}</p>
                    <p className="text-xs text-muted-foreground">{point.section}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        point.score < 50
                          ? "text-destructive"
                          : point.score < 70
                            ? "text-warning"
                            : "text-success"
                      }
                    >
                      {point.score}%
                    </Badge>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="text-xs font-medium">
                          {point.negativeCount} discordâncias
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-[220px] text-xs">
                        Total de respostas "Discordo" ou "Discordo totalmente" para esta pergunta.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
