export function AppHeader() {
  return (
    <header className="w-full bg-[#001a48] text-white">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center gap-6 px-10">
        <div className="flex flex-col items-center gap-1">
          <span className="h-1 w-6 rounded-full bg-white" />
          <span className="h-1 w-6 rounded-full bg-white" />
          <span className="h-1 w-6 rounded-full bg-white" />
        </div>

        <img
          src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png"
          alt="Brasão PAPEM"
          className="h-16 w-16 object-contain"
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold uppercase tracking-[0.35em] text-white">
            PAGADORIA DE PESSOAL DA MARINHA
          </h1>
          <p className="text-xs font-light tracking-[0.45em] text-white/80">
            ORDEM, PRONTIDÃO E REGULARIDADE
          </p>
        </div>
      </div>
    </header>
  );
}