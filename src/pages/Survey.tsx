// SUBSTITUA o conteúdo do arquivo src/pages/Survey.tsx por este código
// Mantém TODA a lógica existente, apenas muda o visual para Timeline Horizontal

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight, ArrowLeft, Anchor, Shield, Star, Waves, BarChart3, Save, Info, TrendingUp, Clock } from "lucide-react";
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
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const pageTopRef = useRef<HTMLDivElement | null>(null);

  const totalSections = 4;
  const progress = ((currentSection + 1) / totalSections) * 100;

  const sectionData = [
    {
      id: 'ambiente',
      title: "Condições do Ambiente",
      icon: "🏢",
      shortTitle: "Ambiente"
    },
    {
      id: 'relacionamento',
      title: "Relacionamento",
      icon: "👥",
      shortTitle: "Relacionamento"
    },
    {
      id: 'motivacao',
      title: "Motivação & Desenvolvimento",
      icon: "📈",
      shortTitle: "Motivação"
    },
    {
      id: 'comentarios',
      title: "Comentários & Sugestões",
      icon: "💬",
      shortTitle: "Comentários"
    }
  ];

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('papem-survey-data');
    const savedSection = localStorage.getItem('papem-survey-section');
    const savedCompleted = localStorage.getItem('papem-survey-completed');
    
    if (savedData) {
      setSurveyData(JSON.parse(savedData));
    }
    if (savedSection) {
      setCurrentSection(parseInt(savedSection));
    }
    if (savedCompleted) {
      setCompletedSections(JSON.parse(savedCompleted));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(surveyData).length > 0) {
      localStorage.setItem('papem-survey-data', JSON.stringify(surveyData));
      localStorage.setItem('papem-survey-section', currentSection.toString());
      localStorage.setItem('papem-survey-completed', JSON.stringify(completedSections));
      setLastSaved(new Date());
    }
  }, [surveyData, currentSection, completedSections]);

  useEffect(() => {
    const scrollToSectionStart = () => {
      const header = document.querySelector('header');
      const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;

      const targetElement = pageTopRef.current;

      if (targetElement) {
        const elementTop = targetElement.getBoundingClientRect().top + window.scrollY;
        const targetTop = Math.max(elementTop - headerHeight - 8, 0);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const timeoutId = window.setTimeout(scrollToSectionStart, 50);

    return () => window.clearTimeout(timeoutId);
  }, [currentSection]);

  useEffect(() => {
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSubmitted]);

  const updateSurveyData = (data: Partial<SurveyData>) => {
    setSurveyData(prev => ({ ...prev, ...data }));
  };

  const handleNextSection = () => {
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setValidationErrors(missingFields);
      setTimeout(() => {
        const firstErrorElement = document.getElementById(`question-${missingFields[0]}`);
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorElement.classList.add('micro-bounce');
          setTimeout(() => firstErrorElement.classList.remove('micro-bounce'), 400);
        }
      }, 100);
      return;
    }
    
    setValidationErrors([]);
    
    // Marcar seção atual como completa
    if (!completedSections.includes(currentSection)) {
      setCompletedSections([...completedSections, currentSection]);
    }
    
    if (currentSection < totalSections - 1) {
      setTimeout(() => {
        setCurrentSection(prev => Math.min(prev + 1, totalSections - 1));
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
        
        localStorage.removeItem('papem-survey-data');
        localStorage.removeItem('papem-survey-section');
        localStorage.removeItem('papem-survey-completed');
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

  const handleRestart = () => {
    setSurveyData({});
    setCompletedSections([]);
    setCurrentSection(0);
    setIsSubmitted(false);
    setValidationErrors([]);
    setIsSubmitting(false);
    setLastSaved(null);

    localStorage.removeItem('papem-survey-data');
    localStorage.removeItem('papem-survey-section');
    localStorage.removeItem('papem-survey-completed');
  };

  const getMissingFields = () => {
    const requiredLocationFields = [
      'setor_localizacao',
      'alojamento_localizacao',
      'banheiro_localizacao',
      'recreio_localizacao',
      'rancho_localizacao',
      'escala_servico_tipo'
    ];

    if (currentSection === 0) {
      return requiredLocationFields.filter(field => !surveyData[field as keyof SurveyData]);
    }

    return [];
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
    return <SuccessMessage onRestart={handleRestart} />;
  }

  return (
    <div ref={pageTopRef} className="min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="container mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* ========== OPÇÃO 3: TIMELINE HORIZONTAL ========== */}
        
        {/* Header com Gradiente e Mascote */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-700 to-blue-900 text-white px-6 py-6 rounded-2xl overflow-hidden shadow-xl">
          {/* Efeito de brilho de fundo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent"></div>
          
          {/* Conteúdo do Header */}
          <div className="relative flex flex-col md:flex-row items-center md:items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Pesquisa de Clima Organizacional 2025
              </h1>
              <p className="text-blue-100 text-xs md:text-sm flex items-center justify-center md:justify-start gap-2">
                <Shield className="w-4 h-4" />
                Pesquisa 100% Anônima e Confidencial · {totalSections} seções ·
              </p>
            </div>

            {/* Mascote e badge de anonimato */}
            <div className="relative flex flex-col items-center md:items-end gap-3">
              <span className="px-3 py-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] bg-white/10 text-blue-50 rounded-full shadow-md backdrop-blur">
                Mascote da Pesquisa Anônima
              </span>
              <div className="relative">
                <div className="hidden md:flex items-center gap-2 absolute -left-6 top-1/2 -translate-y-1/2 bg-white/10 border border-white/20 text-white px-3 py-2 rounded-2xl shadow-lg backdrop-blur">
                  <span className="font-semibold text-[10px] uppercase tracking-wide">Pong avisa:</span>
                  <span className="text-xs text-blue-100">sua opinião chega de forma sigilosa</span>
                </div>
                <img
                  src="/uploads/pg.png"
                  alt="Mascote Pong lembrando sobre o sigilo da pesquisa"
                  className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="bg-white px-6 py-6 shadow-lg rounded-2xl">
          <div className="flex items-center justify-between gap-3 md:gap-4 relative">
            {sectionData.map((section, index) => {
              const isActive = index === currentSection;
              const isCompleted = completedSections.includes(index);
              
              return (
                <div key={section.id} className="flex flex-col items-center flex-1 relative">
                  {/* Linha conectora */}
                  {index < sectionData.length - 1 && (
                    <div
                      className={`absolute top-5 left-[60%] w-full h-[3px] transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : 'bg-gray-200'
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}

                  {/* Ícone */}
                  <div
                    className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110'
                        : isActive
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg ring-4 ring-blue-200 scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? '✓' : section.icon}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 text-[10px] md:text-xs font-semibold text-center transition-all duration-300 ${
                      isActive
                        ? 'text-blue-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <span className="hidden sm:inline">{section.title}</span>
                    <span className="sm:hidden">{section.shortTitle}</span>
                  </div>

                  {/* Indicador ativo */}
                  {isActive && (
                    <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Info adicional */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-600">
                📊 Seção {currentSection + 1} de {totalSections}
              </span>
              
              {lastSaved && (
                <span className="text-[10px] md:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                  <Save className="w-3 h-3" />
                  Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
            
            <span className="text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
              {Math.round((completedSections.length / totalSections) * 100)}% concluído
            </span>
          </div>
        </div>
        
        {/* ========== FIM DA TIMELINE ========== */}

        {/* Survey Content - Mantém tudo igual */}
        <div className="space-y-3 slide-up max-w-[1400px] mx-auto">
          {renderCurrentSection()}
        </div>

        {/* Navigation - Mantém tudo igual */}
        <div className="survey-card-enhanced p-5 max-w-[1400px] mx-auto shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-center gap-4">
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
  );
}