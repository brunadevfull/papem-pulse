import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, RefreshCw } from "lucide-react";
import { useStats } from "@/hooks/useStats";
import { Button } from "@/components/ui/button";

const SETOR_COLORS = {
  "PAPEM-10": "#22c55e",
  "PAPEM-20": "#eab308",
  "PAPEM-30": "#ef4444",
  "PAPEM-40": "#3b82f6",
  "PAPEM-51": "#a855f7",
  "PAPEM-52": "#f97316",
  "SECOM": "#06b6d4",
  "GABINETE": "#0ea5e9",
};

export function StatsOverview() {
  const { stats, loading, error, refetch } = useStats();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-1">
        <Card className="bg-gradient-card shadow-custom-md animate-pulse">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 mb-4">Erro ao carregar dados: {error}</div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center p-8">Nenhum dado disponível</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-1">
      <Card className="bg-gradient-card shadow-custom-md hover:shadow-custom-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Distribuição por Setor</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium">Setor</span>
              <span className="font-medium">Respondentes</span>
            </div>
            <div className="space-y-2">
              {stats.setorDistribution.map((setor, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: SETOR_COLORS[setor.setor] || "#64748b" }}
                    />
                    <span className="text-xs font-medium truncate">{setor.setor}</span>
                  </div>
                  <div className="text-xs font-bold text-primary">{setor.count}</div>
                </div>
              ))}
              {stats.setorDistribution.length === 0 && (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Nenhum dado disponível
                </div>
              )}
            </div>
            <div className="pt-2 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Total:</span>
                <span className="text-sm font-bold text-primary">{stats.totalResponses}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
