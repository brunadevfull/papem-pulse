import { Label } from "@/components/ui/label";
import { Building2, CheckCircle2 } from "lucide-react";

interface QuestionProps {
  question: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  hasError?: boolean;
  questionNumber?: number;
}

export function Question({ question, name, value, onChange, options, required = true, hasError = false, questionNumber }: QuestionProps) {
  return (
    <div
      id={`question-${name}`}
      className={`question-card-enhanced px-6 py-5 mb-3 fade-in ${
        hasError ? 'question-card-error border-destructive/40' : ''
      }`}
    >
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
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
            hasError
              ? 'bg-destructive text-white'
              : 'bg-gradient-primary text-white'
          }`}>
            {questionNumber ? (
              <span className="font-bold text-base">{questionNumber}</span>
            ) : (
              <Building2 className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <Label className={`text-base sm:text-lg font-semibold leading-relaxed ${
              hasError ? 'text-destructive' : 'text-slate-800'
            }`}>
              {question}
              {!required && (
                <span className="text-sm text-muted-foreground ml-2 font-normal">(Opcional)</span>
              )}
            </Label>
          </div>
        </div>

        {/* Linha das opções - inline e justificadas */}
        <div className="flex flex-wrap justify-between gap-3 pl-14">
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
                className={`
                  option-button-enhanced text-center px-6 py-3 min-h-[52px] flex items-center justify-center flex-1
                  ${isSelected ? 'option-button-selected-enhanced pulse-success' : 'option-button-unselected-enhanced'}
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  minWidth: '160px'
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  {isSelected && <CheckCircle2 className="w-4 h-4 flex-shrink-0" />}
                  <span className="font-semibold leading-tight text-sm sm:text-base whitespace-nowrap">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}