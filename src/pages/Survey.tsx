import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList, ArrowRight, ArrowLeft, Anchor, Shield, Star, Waves, BarChart3, Save, Info } from "lucide-react";
import { NavLink } from "react-router-dom";
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
    <div className="min-h-screen" style={{ backgroundColor: '#f1f5f9' }}>
      {/* Survey Header com título da seção */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="h-20 flex items-center px-8 gap-6">
          <div className="flex-1 flex items-center gap-4">
            <img 
              src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
              alt="Brasão PAPEM" 
              className="w-12 h-12 object-contain"
            />
            
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-primary">
                Pesquisa de Clima Organizacional
              </h1>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-success" />
                100% Anônimo
              </span>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="default"
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
              variant="ghost"
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

      <div className="container mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Card do Mascote */}
        <div className="w-full bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20 p-3 flex items-center gap-3 max-w-4xl mx-auto mb-6">
          <img 
            src="/lovable-uploads/a27f9473-5787-4cab-9c01-3f62a66a5e88.png" 
            alt="Mascote" 
            className="w-12 h-12 object-contain flex-shrink-0"
          />
          <div className="flex-1 text-left">
            <p className="text-xs font-bold text-primary mb-0.5">
              🔒 Pesquisa 100% Anônima e Confidencial 🛡️
            </p>
            <p className="text-xs text-muted-foreground">
              Sua participação é fundamental. Responda com objetividade.
            </p>
          </div>
        </div>

        {/* Enhanced Progress Section - Compacto */}
        <div className="survey-card-enhanced p-4 slide-up w-full max-w-[1400px] mx-auto">
          <div className="space-y-3">
            {/* Progress Info */}
            <div className="flex justify-between items-center text-xs text-foreground">
              <div className="flex items-center gap-2">
                <span className="font-medium">Seção {currentSection + 1} de {totalSections}</span>
                
                {/* Auto-save indicator */}
                {lastSaved && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600">
                    <Save className="w-3 h-3" />
                    <span>Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                
                {/* Contextual hint */}
                {showHint && currentSection === 0 && (
                  <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                       onClick={() => setShowHint(false)}>
                    <Info className="w-3 h-3" />
                    <span>Respostas salvas automaticamente</span>
                  </div>
                )}
              </div>
              
              <div className="text-right">
                <span className="font-semibold text-primary text-sm">{Math.round(progress)}% concluído</span>
                <div className="text-xs text-muted-foreground">
                  ⏱️ ~{Math.max(1, Math.ceil((4 - currentSection - 1) * 2))} min restantes
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar */}
            <div className="progress-bar-enhanced">
              <div 
                className="progress-fill-enhanced"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
              {/* Progress milestones */}
              <div className="absolute inset-0 flex justify-between items-center px-1">
                {[25, 50, 75].map((milestone) => (
                  <div 
                    key={milestone}
                    className={`w-1 h-4 rounded-full transition-all duration-300 ${
                      progress >= milestone ? 'bg-white shadow-sm' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Section Indicators - Mais compactos */}
            <div className="flex justify-between items-center gap-2">
              {sectionData.map((section, index) => {
                const isActive = index === currentSection;
                const isCompleted = index < currentSection;
                
                return (
                  <div key={index} className={`flex items-center gap-2 flex-1 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-primary/10 border border-primary/20' : ''
                  }`}>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all duration-300
                      ${isActive 
                        ? 'border-primary text-primary bg-primary/10' 
                        : isCompleted
                        ? 'border-success text-white bg-success'
                        : 'border-muted-foreground text-muted-foreground bg-transparent'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <p className={`text-xs font-medium transition-colors duration-300 ${
                      isActive 
                        ? 'text-primary' 
                        : isCompleted
                        ? 'text-success'
                        : 'text-muted-foreground'
                    }`}>
                      {section.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        
        {/* Survey Content */}
        <div className="space-y-3 slide-up max-w-[1400px] mx-auto">
          {renderCurrentSection()}
        </div>

        {/* Enhanced Navigation */}
        <div className="survey-card-enhanced p-4 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevSection}
              disabled={currentSection === 0}
              className="modern-button-outline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Seção Anterior
            </Button>

            {currentSection === totalSections - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="modern-button bg-success hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Enviar Pesquisa
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNextSection}
                className="modern-button"
              >
                Próxima Seção
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}