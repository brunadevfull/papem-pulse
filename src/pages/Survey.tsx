import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ArrowLeft, Anchor, Shield, Star, BarChart3, Save, Info, TrendingUp, Clock, Sparkles } from "lucide-react";
import { SurveySection1 } from "@/components/survey/SurveySection1";
import { SurveySection2 } from "@/components/survey/SurveySection2";
import { SurveySection3 } from "@/components/survey/SurveySection3";
import { SurveySection4 } from "@/components/survey/SurveySection4";
import { SuccessMessage } from "@/components/survey/SuccessMessage";

type SurveyData = {
  // Section 1 - Condições do ambiente / conforto
  setor_localizacao: string;
  setor_computadores: string;
  setor_mobiliario: string;
  setor_limpeza: string;
  setor_temperatura: string;
  setor_iluminacao: string;
  alojamento_localizacao: string;
  alojamento_limpeza: string;
  alojamento_temperatura: string;
  alojamento_iluminacao: string;
  alojamento_armarios_condicao: string;
  alojamento_armario_preservado: string;
  banheiro_localizacao: string;
  banheiro_vasos_suficientes: string;
  banheiro_vasos_preservados: string;
  banheiro_torneiras_funcionam: string;
  banheiro_chuveiros_suficientes: string;
  banheiro_chuveiros_funcionam: string;
  banheiro_limpeza: string;
  banheiro_iluminacao: string;
  recreio_localizacao: string;
  recreio_mobiliario_quantidade: string;
  recreio_mobiliario_condicao: string;
  recreio_limpeza: string;
  recreio_temperatura: string;
  recreio_iluminacao: string;
  rancho_localizacao: string;
  rancho_qualidade_comida: string;
  rancho_mobiliario_condicao: string;
  rancho_limpeza: string;
  rancho_temperatura: string;
  rancho_iluminacao: string;
  escala_servico_tipo: string;
  escala_equipamentos_condicao: string;
  escala_pernoite_adequada: string;
  tfm_participa_regularmente: string;
  tfm_incentivo_pratica: string;
  tfm_instalacoes_adequadas: string;
  // Section 2 - Relacionamento
  encarregado_ouve_melhorias: string;
  encarregado_fornece_meios: string;
  disposicao_contribuir_setor: string;
  encarregado_delega: string;
  pares_auxiliam_setor: string;
  relacionamento_intersetorial: string;
  entrosamento_tripulacao: string;
  convivencia_regras: string;
  confianca_respeito_relacoes: string;
  integracao_familia_papem: string;
  // Section 3 - Motivação / Desenvolvimento
  feedback_desempenho_regular: string;
  conceito_compativel_desempenho: string;
  importancia_funcao_papem: string;
  trabalho_reconhecido_valorizado: string;
  crescimento_profissional_estimulado: string;
  cursos_suficientes_atividade: string;
  programa_adestramento_regular: string;
  orgulho_trabalhar_papem: string;
  atuacao_area_especializacao: string;
  potencial_melhor_em_outra_funcao: string;
  carga_trabalho_justa: string;
  licenca_autorizada_sem_prejuizo: string;
  // Section 4
  aspecto_positivo: string;
  aspecto_negativo: string;
  proposta_processo: string;
  proposta_satisfacao: string;
};

export default function Survey() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [surveyData, setSurveyData] = useState<Partial<SurveyData>>({});
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState(true);

  const totalSections = 4;
  const progress = ((currentSection + 1) / totalSections) * 100;
  const progressPercentage = Math.round(progress);
  const minutesRemaining = Math.max(1, Math.ceil((totalSections - currentSection - 1) * 2));

  const sectionData = [
    {
      title: "Condições do Ambiente",
      icon: Anchor,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20"
    },
    {
      title: "Relacionamento",
      icon: Shield,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    },
    {
      title: "Motivação & Desenvolvimento",
      icon: Star,
      color: "text-naval-gold",
      bgColor: "bg-warning/10",
      borderColor: "border-warning/20"
    },
    {
      title: "Comentários & Sugestões",
      icon: BarChart3,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20"
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    // Load saved data on mount
    const savedData = localStorage.getItem('papem-survey-data');
    const savedSection = localStorage.getItem('papem-survey-section');
    if (savedData) {
      setSurveyData(JSON.parse(savedData));
    }
    if (savedSection) {
      setCurrentSection(parseInt(savedSection));
    }
  }, []);

  // Auto-save data whenever it changes
  useEffect(() => {
    if (Object.keys(surveyData).length > 0) {
      localStorage.setItem('papem-survey-data', JSON.stringify(surveyData));
      localStorage.setItem('papem-survey-section', currentSection.toString());
      setLastSaved(new Date());
    }
  }, [surveyData, currentSection]);


  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const handleNextSection = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      // Scroll para a primeira pergunta com erro
      setTimeout(() => {
        const firstErrorElement = document.getElementById(`question-${missingFields[0]}`);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add micro-feedback for error
          firstErrorElement.classList.add('micro-bounce');
          setTimeout(() => firstErrorElement.classList.remove('micro-bounce'), 400);
        }
      }, 100);
      return;
    }
    
    setValidationErrors([]);
    if (currentSection < totalSections - 1) {
      // Celebrar conclusão da seção
      const currentElement = document.querySelector('.section-indicator-active');
      if (currentElement) {
        currentElement.classList.add('pulse-success');
        setTimeout(() => currentElement.classList.remove('pulse-success'), 600);
      }
      
      // Transição suave para próxima seção
      setTimeout(() => {
        setCurrentSection(currentSection + 1);
        // Auto-scroll para o topo da nova seção
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      // Scroll para a primeira pergunta com erro
      setTimeout(() => {
        const firstErrorElement = document.getElementById(`question-${missingFields[0]}`);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to backend API
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        console.log("Survey submitted successfully:", result);
        
        // Clear saved data after successful submission
        localStorage.removeItem('papem-survey-data');
        localStorage.removeItem('papem-survey-section');
        setLastSaved(null);
      } else {
        throw new Error(result.message || 'Erro ao enviar pesquisa');
      }
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error);
      alert('Erro ao enviar pesquisa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMissingFields = () => {
    // Apenas campos de localização são obrigatórios
    const requiredLocationFields = [
      'setor_localizacao',
      'alojamento_localizacao',
      'banheiro_localizacao',
      'recreio_localizacao',
      'rancho_localizacao',
      'escala_servico_tipo'
    ];

    // Verificar apenas na seção 1 (onde estão os campos de localização)
    if (currentSection === 0) {
      return requiredLocationFields.filter(field => !surveyData[field as keyof SurveyData]);
    }

    // Outras seções não têm campos obrigatórios
    return [];
  };

  const isCurrentSectionComplete = () => {
    // Usar a mesma lógica condicional do getMissingFields
    return getMissingFields().length === 0;
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return <SurveySection1 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 1:
        return <SurveySection2 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 2:
        return <SurveySection3 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      case 3:
        return <SurveySection4 data={surveyData} onUpdate={updateSurveyData} errors={validationErrors} />;
      default:
        return null;
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  const currentSectionData = sectionData[currentSection];
  const IconComponent = currentSectionData.icon;

  return (
    <div className="relative min-h-screen bg-slate-100">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-br from-primary via-primary to-primary/85" />
      <div className="relative z-10 pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 space-y-6">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-white bg-white/15 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Opção 1: Mascote Lateral Fixo
            </span>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/95 shadow-[0_20px_45px_rgba(15,23,42,0.25)] backdrop-blur-sm overflow-hidden">
            <div className="grid md:grid-cols-[260px,1fr]">
              <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-white p-6 md:p-8 flex flex-col items-center justify-center gap-4">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide bg-white/15 px-4 py-1.5 rounded-full shadow-sm">
                  Sua opinião importa!
                </span>
                <div className="relative">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl border border-white/40 bg-white/10 backdrop-blur-[2px] flex items-center justify-center shadow-inner">
                    <img
                      src="/lovable-uploads/a27f9473-5787-4cab-9c01-3f62a66a5e88.png"
                      alt="Mascote"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                    />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shadow-md backdrop-blur-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs md:text-sm text-white/85 text-center max-w-[200px] leading-relaxed">
                  Compartilhe suas percepções e ajude a construir um PAPEM ainda melhor.
                </p>
              </div>

              <div className="p-6 md:p-8 space-y-6 bg-white">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                    Clima Organizacional
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                    Pesquisa de Clima Organizacional 2024
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Pesquisa 100% Anônima e Confidencial
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 md:p-5 space-y-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary shadow-sm">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Seção {currentSection + 1} de {totalSections}
                      </span>
                      {lastSaved && (
                        <div className="flex items-center gap-1 text-[11px] text-success bg-success/10 px-2.5 py-1 rounded-full font-medium shadow-sm">
                          <Save className="w-3.5 h-3.5" />
                          <span>Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      {showHint && currentSection === 0 && (
                        <button
                          type="button"
                          className="flex items-center gap-1 text-[11px] text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/15 transition-all"
                          onClick={() => setShowHint(false)}
                        >
                          <Info className="w-3 h-3" />
                          <span>Respostas salvas automaticamente</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-sm font-semibold text-success shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        {progressPercentage}% concluído
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        ~{minutesRemaining} min restantes
                      </div>
                    </div>
                  </div>

                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-primary/90 to-success transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse pointer-events-none" />
                    <div className="absolute inset-0 flex justify-between items-center px-3">
                      {[25, 50, 75].map((milestone) => (
                        <div
                          key={milestone}
                          className={`h-3 w-1.5 rounded-full transition-all duration-300 ${
                            progress >= milestone ? 'bg-white shadow-md' : 'bg-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {sectionData.map((section, index) => {
                      const isActive = index === currentSection;
                      const isCompleted = index < currentSection;
                      const SectionIcon = section.icon;

                      return (
                        <div
                          key={section.title}
                          className={`section-indicator-enhanced rounded-2xl border transition-all duration-300 ${
                            isActive
                              ? 'section-indicator-active border-primary/40 bg-primary/10 shadow-sm'
                              : isCompleted
                              ? 'border-success/30 bg-success/10'
                              : 'border-transparent bg-slate-50/90'
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 bg-white text-xs font-semibold transition-all duration-300 ${
                              isActive
                                ? 'border-primary text-primary'
                                : isCompleted
                                ? 'border-success bg-success text-white'
                                : 'border-slate-200 text-slate-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <SectionIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[11px] md:text-xs font-semibold leading-tight ${
                                isActive ? 'text-primary' : isCompleted ? 'text-success-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {section.title}
                            </p>
                            <p
                              className={`text-[10px] leading-tight ${
                                isActive
                                  ? 'text-primary/70'
                                  : isCompleted
                                  ? 'text-success/70'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {isActive ? 'Em andamento' : isCompleted ? 'Concluída' : 'Aguardando'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary font-semibold">
                      <IconComponent className="w-3.5 h-3.5" />
                      {currentSectionData.title}
                    </span>
                    <span className="hidden sm:inline">em destaque nesta etapa.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 slide-up">
            {renderCurrentSection()}
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg backdrop-blur-sm p-5">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="modern-button-outline disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform font-semibold"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Seção Anterior</span>
                <span className="sm:hidden">Anterior</span>
              </Button>

              {currentSection === totalSections - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="modern-button bg-gradient-to-r from-success to-success/90 hover:from-success/90 hover:to-success disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform font-bold shadow-md"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <span className="hidden sm:inline">Enviar Pesquisa</span>
                      <span className="sm:hidden">Enviar</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNextSection}
                  className="modern-button hover:scale-105 transition-transform font-semibold shadow-md"
                  size="lg"
                >
                  <span className="hidden sm:inline">Próxima Seção</span>
                  <span className="sm:hidden">Próxima</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}