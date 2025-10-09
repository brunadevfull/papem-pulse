import { Shield, BarChart3, ClipboardList } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const location = useLocation();
  
  return (
    <header className="bg-white border-b border-border">
      <div className="h-20 flex items-center px-8 gap-6">
        <div className="flex-1 flex items-center gap-4">
          {/* Brasão PAPEM */}
          <img 
            src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
            alt="Brasão PAPEM" 
            className="w-12 h-12 object-contain"
          />
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-primary">
              Pesquisa
            </h1>
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-success" />
              100% Anônimo
            </span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant={location.pathname === "/" || location.pathname === "/survey" ? "default" : "ghost"}
            size="sm"
            className="gap-2"
          >
            <NavLink to="/survey">
              <ClipboardList className="w-4 h-4" />
              Pesquisa
            </NavLink>
          </Button>
          
          <Button
            asChild
            variant={location.pathname === "/admin" ? "default" : "ghost"}
            size="sm" 
            className="gap-2"
          >
            <NavLink to="/admin">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </NavLink>
          </Button>
        </div>
      </div>
    </header>
  );
}