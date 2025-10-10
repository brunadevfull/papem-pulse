import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ClipboardList, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/layout/AppHeader";

const navigationItems = [
  {
    title: "Pesquisa de Clima",
    url: createPageUrl("Survey"),
    icon: ClipboardList,
    pageName: "Survey"
  },
  {
    title: "Dashboard Administrativo", 
    url: createPageUrl("Admin"),
    icon: BarChart3,
    pageName: "Admin"
  }
];

interface LayoutProps {
  children: ReactNode;
  currentPageName: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <AppHeader />
      <nav className="border-b bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end gap-2 px-10 py-4">
          {navigationItems.map((item) => (
            <Button
              key={item.title}
              asChild
              variant={currentPageName === item.pageName ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              <Link to={item.url}>
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>
      
      <footer className="border-t bg-card p-4 text-center">
        <p className="text-sm text-muted-foreground">
          PAPEM - Pagadoria de Pessoal da Marinha
        </p>
      </footer>
    </div>
  );
}