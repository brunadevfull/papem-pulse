import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, BarChart3, Shield } from "lucide-react";

export function AppHeader() {
  return (
    <header style={{ backgroundColor: "#001945" }} className="sticky top-0 z-50 shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-3 gap-3 md:gap-4">
        <div className="flex items-center gap-2 md:gap-3">
          <img
            src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png"
            alt="Brasão PAPEM"
            className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform hover:scale-110 drop-shadow-lg"
          />
          <div>
            <h1 className="text-lg md:text-2xl font-bold text-white font-cinzel tracking-wide drop-shadow-md">
              PAPEM - Pagadoria de Pessoal da Marinha
            </h1>
            <span className="flex items-center gap-2 text-sm md:text-lg text-white font-semibold font-cinzel tracking-wider drop-shadow-sm">
              <Shield className="w-3 h-3 md:w-4 md:h-4" />
              "ORDEM, PRONTIDÃO E REGULARIDADE"
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="gap-2 hover:scale-105 transition-transform bg-white hover:bg-white/90 text-primary border-2 border-naval-gold shadow-md"
          >
            <NavLink to="/survey">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Pesquisa</span>
            </NavLink>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 hover:scale-105 transition-transform text-white hover:bg-white/20 border border-white/30"
          >
            <NavLink to="/admin">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Dashboard</span>
            </NavLink>
          </Button>
        </div>
      </div>
    </header>
  );
}