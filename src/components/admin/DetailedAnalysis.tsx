import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
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
        .map((question) => ({
          section: section.title,
          question: question.label,
          score: Math.round((question.average ?? 0) * 20),
        }));
    });

    return questions
      .sort((a, b) => a.score - b.score)
      .slice(0, 5);
  }, [environment.data, relationship.data, motivation.data]);

  const positiveHighlights = useMemo(() => {
    const questions = sectionsMeta.flatMap((section) => {
      const stats = section.key === "environment" ? environment.data
        : section.key === "relationship" ? relationship.data
        : motivation.data;

      if (!stats) {
        return [];
      }

      return stats.questions
        .filter((question) => question.type === "likert" && question.totalResponses > 0)
        .map((question) => {
          const concordantCount = question.ratings
            .filter((rating) => rating.rating === "Concordo" || rating.rating === "Concordo totalmente")
            .reduce((total, rating) => total + rating.count, 0);

          const concordanceRate = Math.round((concordantCount / question.totalResponses) * 100);

          return {
            section: section.title,
            question: question.label,
            concordantCount,
            concordanceRate,
          };
        });
    });

    return questions
      .filter((item) => item.concordantCount > 0)
      .sort((a, b) => b.concordantCount - a.concordantCount || b.concordanceRate - a.concordanceRate)
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
          <div className="space-y-4">
            {criticalPoints.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum dado suficiente para identificar pontos críticos.</p>
            )}
            {criticalPoints.map((point, index) => (
              <div key={`${point.question}-${index}`} className="flex items-center justify-between p-3 bg-warning-light rounded-lg border border-warning/20">
                <div className="flex-1">
                  <p className="text-sm font-medium">{point.question}</p>
                  <p className="text-xs text-muted-foreground">{point.section}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={point.score < 50 ? "text-destructive" : point.score < 70 ? "text-warning" : "text-success"}>
                    {point.score}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Maiores Destaques Positivos
          </CardTitle>
          <CardDescription>
            Indicadores calculados a partir da soma de respostas "Concordo" e "Concordo totalmente". Listamos as 5 questões com maior concordância entre os participantes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positiveHighlights.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum dado suficiente para identificar destaques positivos.</p>
            )}
            {positiveHighlights.map((highlight, index) => (
              <div
                key={`${highlight.question}-${index}`}
                className="flex items-center justify-between rounded-lg border border-success/20 bg-success/10 p-3"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-success-foreground">{highlight.question}</p>
                  <p className="text-xs text-muted-foreground">{highlight.section}</p>
                </div>
                <Badge variant="secondary" className="bg-success text-success-foreground hover:bg-success">
                  {highlight.concordanceRate}% ({highlight.concordantCount})
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
