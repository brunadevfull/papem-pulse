import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, Sparkles, Star, Anchor, Home } from "lucide-react";

type SuccessMessageProps = {
  onRestart: () => void;
};

export function SuccessMessage({ onRestart }: SuccessMessageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 space-y-6 animate-slide-up">
      <Card className="w-full max-w-3xl bg-gradient-hero text-primary-foreground shadow-naval overflow-hidden relative border-0">
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 animate-gradient bg-[length:400%_400%]"></div>

        <CardHeader className="text-center relative z-10 py-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-gradient-glass rounded-full flex items-center justify-center backdrop-blur-sm shadow-neon animate-float border border-white/20">
              <CheckCircle2 className="w-10 h-10 animate-pulse-slow text-success" />
            </div>
            <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-sm animate-float">
              <Anchor className="w-8 h-8 animate-glow" />
            </div>
          </div>

          <CardTitle className="text-4xl font-bold mb-4 animate-scale-in">
            Pesquisa Enviada com Sucesso!
          </CardTitle>

          <CardDescription className="text-primary-foreground/90 text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Obrigado por sua participação! Suas respostas foram registradas de forma
            <span className="font-bold text-naval-gold animate-pulse-slow"> totalmente anônima</span>.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-md bg-gradient-glass backdrop-blur-sm shadow-custom-xl border-0">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center">
            <Button
              onClick={onRestart}
              className="flex items-center gap-2 px-6 py-3 text-base font-bold bg-gradient-primary hover:scale-105 shadow-glow transition-all duration-300 rounded-2xl"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}