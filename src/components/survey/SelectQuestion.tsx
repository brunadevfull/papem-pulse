import { Label } from "@/components/ui/label";
import { Building2, CheckCircle2 } from "lucide-react";

interface SelectQuestionProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  hasError?: boolean;
  questionNumber?: number;
}

export function SelectQuestion({
  question,
  name,
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção",
  required = true,
  hasError = false,
  questionNumber
}: SelectQuestionProps) {
  return (
    <div
      id={`question-${name}`}
      className={`question-card-enhanced px-4 py-3 mb-2 fade-in border ${
        hasError
          ? 'question-card-error border-destructive/40'
          : required
            ? 'border-primary/40 ring-1 ring-primary/10'
            : 'border-slate-200/70'
      }`}
    >
      {hasError ? (
        <div className="-mx-4 -mt-3 mb-3 px-4 py-2 rounded-t-xl bg-destructive text-white flex items-center gap-2 uppercase tracking-wide text-[11px] sm:text-xs font-semibold">
          <span className="text-white/80 text-base leading-none" aria-hidden="true">
            !
          </span>
          <span>Obrigatório</span>
        </div>
      ) : (
        required && (
          <div className="-mx-4 -mt-3 mb-3 px-4 py-2 rounded-t-xl bg-red-100 text-red-700 flex items-center gap-2 uppercase tracking-wide text-[11px] sm:text-xs font-semibold border-b border-red-200">
            <span className="text-red-500 text-base leading-none" aria-hidden="true">
              !
            </span>
            <span>Pergunta obrigatória</span>
          </div>
        )
      )}

      {hasError && (
        <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Esta pergunta é obrigatória
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Linha da pergunta */}
        <div className="flex items-start gap-4">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
            hasError
              ? 'bg-destructive text-white'
              : 'bg-gradient-primary text-white'
          }`}>
            {questionNumber ? (
              <span className="font-bold text-sm">{questionNumber}</span>
            ) : (
              <Building2 className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1">
            <Label
              className={`text-xs sm:text-sm font-semibold leading-relaxed block ${
                hasError
                  ? 'text-destructive'
                  : required
                    ? 'text-slate-900'
                    : 'text-slate-800'
              }`}
            >
              {question}
            </Label>

            {!value && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 italic">
                {placeholder}
              </p>
            )}
          </div>
        </div>

        {/* Linha das opções - inline e justificadas */}
        <div className="flex flex-nowrap justify-between gap-2 pl-10">
          {options.map((option, index) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(option.value);
                  }
                }}
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`${option.label} ${isSelected ? '(selecionado)' : ''}`}
                className={`option-button-enhanced text-center px-3 py-2 min-h-[40px] flex items-center justify-center flex-1 whitespace-nowrap ${
                  isSelected ? 'option-button-selected-enhanced pulse-success' : 'option-button-unselected-enhanced'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  minWidth: '100px'
                }}
              >
                <div className="flex items-center justify-center gap-1">
                  {isSelected && <CheckCircle2 className="w-3 h-3 flex-shrink-0" />}
                  <span className="font-semibold leading-tight text-[10px] sm:text-xs">
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}