import { Menu } from "lucide-react";

export function AppHeader() {
  return (
    <header style={{ backgroundColor: '#001945' }} className="w-full">
      <div className="h-20 flex items-center px-8 gap-4">
        {/* Menu Hamburguer */}
        <button className="text-white hover:opacity-80 transition-opacity">
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Brasão PAPEM */}
        <img 
          src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
          alt="Brasão PAPEM" 
          className="w-14 h-14 object-contain"
        />
        
        {/* Texto do Header */}
        <div className="flex flex-col">
          <h1 className="text-white text-xl font-bold tracking-wide">
            PAGADORIA DE PESSOAL DA MARINHA
          </h1>
          <p className="text-white/80 text-xs tracking-wider">
            "ORDEM, PRONTIDÃO E REGULARIDADE"
          </p>
        </div>
      </div>
    </header>
  );
}