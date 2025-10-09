import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ClipboardList, ArrowRight, ArrowLeft, Anchor, Shield, Star, Waves, BarChart3, Save, Info, Lock, TrendingUp, Clock } from "lucide-react";
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

  // Reforço de confiança: ao focar no formulário, troca o título 1x
  useEffect(() => {
    let trocado = false;
    const titulo = document.getElementById('anon-title');
    const firstFocusable = document.querySelector('input, select, textarea, button');
    
    const handleFocus = () => {
      if (!trocado && titulo) {
        titulo.textContent = 'Aqui é anônimo de verdade. Pode confiar!';
        trocado = true;
      }
    };

    if (firstFocusable) {
      firstFocusable.addEventListener('focus', handleFocus, { once: true });
    }

    return () => {
      if (firstFocusable) {
        firstFocusable.removeEventListener('focus', handleFocus);
      }
    };
  }, []);

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
      {/* Survey Header com PAPEM e Mascote */}
      <header className="bg-gradient-to-r from-primary via-primary/95 to-naval-green border-b-4 border-naval-gold sticky top-0 z-50 shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-2 md:py-3 gap-3 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
              alt="Brasão PAPEM" 
              className="w-10 h-10 md:w-12 md:h-12 object-contain transition-transform hover:scale-110 drop-shadow-lg"
            />
            <div>
              <h1 className="text-base md:text-xl font-bold text-white font-montserrat tracking-wide drop-shadow-md">
                PAPEM - Pagadoria de Pessoal da Marinha
              </h1>
              <span className="flex items-center gap-2 text-xs md:text-sm text-naval-gold font-semibold font-merriweather tracking-wider drop-shadow-sm">
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                ORDEM, PRONTIDÃO E REGULARIDADE
              </span>
            </div>
          </div>
          
          {/* Mascote com animação - Cores do brasão */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl border-2 border-naval-gold px-4 py-3 shadow-lg hover:shadow-xl transition-all">
            <img 
              src="/lovable-uploads/a27f9473-5787-4cab-9c01-3f62a66a5e88.png" 
              alt="Mascote" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain animate-pulse drop-shadow-lg"
            />
            <div className="text-left">
              <p className="text-xs md:text-sm font-bold text-primary leading-tight flex items-center gap-2 font-montserrat">
                <Lock className="w-4 h-4 text-naval-green" />
                Pesquisa 100% Anônima e Confidencial
                <Shield className="w-4 h-4 text-naval-green" />
              </p>
              <p className="text-[10px] md:text-xs text-foreground/80 leading-tight mt-1 font-merriweather">
                Sua participação é fundamental. Responda com objetividade.
              </p>
            </div>
          </div>
          
          {/* Navigation Buttons - Cores do brasão */}
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

      <div className="container mx-auto max-w-7xl py-2 px-4 sm:px-6 lg:px-8 space-y-3">
        
        {/* Widget de Anonimato */}
        <section id="anon-hero" aria-labelledby="anon-title" className="mx-auto max-w-4xl">
          <style dangerouslySetInnerHTML={{__html: `
            #anon-hero {
              --bg: hsl(207, 100%, 22%);
              --fg: #e7ecf7;
              --muted: #a9b3c7;
              --brand: hsl(207, 100%, 50%);
              --ok: hsl(142, 76%, 36%);
              margin: 0 0 16px 0;
              padding: 16px;
              border-radius: 14px;
              background: linear-gradient(180deg, hsl(207, 100%, 22%), hsl(207, 100%, 18%));
              border: 1px solid rgba(255,255,255,.08);
              color: var(--fg);
              font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
              box-shadow: 0 8px 28px rgba(0,0,0,.22);
              display: grid;
              grid-template-columns: 84px 1fr;
              gap: 14px;
              align-items: center;
            }
            #anon-hero .pg-wrap {
              width: 84px;
              height: 84px;
              border-radius: 50%;
              background: radial-gradient(120% 120% at 30% 20%, #1a2752, #0f1833);
              border: 1px solid rgba(255,255,255,.08);
              display: grid;
              place-items: center;
              position: relative;
              overflow: hidden;
              animation: flutua 4s ease-in-out infinite;
            }
            #anon-hero .pg-wrap img {
              width: 64px;
              height: 64px;
              object-fit: contain;
              display: block;
            }
            #anon-hero .content h1 {
              margin: 0 0 4px 0;
              font-size: 18px;
              line-height: 1.2;
            }
            #anon-hero .content p {
              margin: 0;
              font-size: 14px;
              line-height: 1.45;
              color: var(--muted);
            }
            #anon-hero .badges {
              display: flex;
              gap: 8px;
              margin-top: 10px;
              flex-wrap: wrap;
            }
            #anon-hero .badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              padding: 6px 10px;
              border-radius: 999px;
              background: #0f213f;
              border: 1px solid rgba(255,255,255,.08);
              position: relative;
            }
            #anon-hero .badge.ok::before {
              content: "";
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: var(--ok);
              box-shadow: 0 0 8px rgba(51,209,122,.7);
              animation: pulsa 1.8s ease-in-out infinite;
            }
            #anon-hero .details {
              font-size: 12px;
              color: #93a1bd;
              margin-top: 8px;
            }
            #anon-hero .details a {
              color: var(--brand);
              text-decoration: none;
            }
            #anon-hero .details a:hover {
              text-decoration: underline;
            }
            @keyframes flutua {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes pulsa {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.35); }
            }
            @media (max-width: 540px) {
              #anon-hero {
                grid-template-columns: 64px 1fr;
              }
              #anon-hero .pg-wrap {
                width: 64px;
                height: 64px;
              }
              #anon-hero .pg-wrap img {
                width: 48px;
                height: 48px;
              }
            }
          `}} />

          <div className="pg-wrap" aria-hidden="true">
            <img src="/lovable-uploads/a27f9473-5787-4cab-9c01-3f62a66a5e88.png" alt="Mascote PAPEM" />
          </div>

          <div className="content">
            <h1 id="anon-title">Relaxa, eu não consigo ver nada 👀</h1>
            <p>Esta pesquisa é <strong>100% anônima</strong>. Nenhuma informação individual será identificada.</p>

            <div className="badges" role="list">
              <span className="badge ok" role="listitem" aria-label="Anonimato garantido">Anonimato garantido</span>
              <span className="badge" role="listitem">Sem IP • Sem matrícula • Sem usuário</span>
              <span className="badge" role="listitem">Leva menos de 10 minutos</span>
            </div>

            <div className="details">
              Em caso de dúvidas, consulte a <a href="#politica-privacidade" id="link-priv">política de privacidade da pesquisa</a>.
            </div>
          </div>
        </section>
        
        {/* Título da Pesquisa no Corpo */}
        <div className="bg-gradient-to-br from-white to-primary/5 rounded-lg border border-border fade-in transition-all">
          <div className="text-center space-y-1.5 py-2 px-3">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/e0a4659d-a903-4c7c-b8ab-10694346d6f8.png" 
                alt="Brasão PAPEM" 
                className="w-12 h-12 md:w-14 md:h-14 object-contain hover:scale-110 transition-transform"
              />
            </div>
            <h2 className="text-lg md:text-xl font-bold text-primary">
              Pesquisa de Clima Organizacional
            </h2>
          </div>
        </div>
        
        
        {/* Enhanced Progress Section - Compacto como cabeçalho */}
        <div className="bg-primary/5 backdrop-blur-sm rounded-xl border border-primary/10 p-3 slide-up w-full max-w-[1400px] mx-auto shadow-sm transition-all">
          <div className="space-y-2">
            {/* Progress Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-foreground">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  Seção {currentSection + 1} de {totalSections}
                </span>
                
                {/* Auto-save indicator */}
                {lastSaved && (
                  <div className="flex items-center gap-1 text-[10px] text-success bg-success/10 px-2 py-1 rounded-full font-medium">
                    <Save className="w-3 h-3" />
                    <span>Salvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                
                {/* Contextual hint */}
                {showHint && currentSection === 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-primary bg-primary/10 px-2 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-all"
                       onClick={() => setShowHint(false)}>
                    <Info className="w-3 h-3" />
                    <span>Respostas salvas automaticamente</span>
                  </div>
                )}
              </div>
              
              <div className="text-left sm:text-right">
                <span className="font-bold text-primary text-sm">{Math.round(progress)}% concluído</span>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  ~{Math.max(1, Math.ceil((4 - currentSection - 1) * 2))} min restantes
                </div>
              </div>
            </div>
            
            {/* Enhanced Progress Bar com gradiente - mais fino */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary via-primary/90 to-success transition-all duration-500 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
              </div>
              {/* Progress milestones */}
              <div className="absolute inset-0 flex justify-between items-center px-2">
                {[25, 50, 75].map((milestone) => (
                  <div 
                    key={milestone}
                    className={`w-1 h-4 rounded-full transition-all duration-300 ${
                      progress >= milestone ? 'bg-white shadow-md' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Section Indicators - Compactos */}
            <div className="grid grid-cols-2 md:flex md:justify-between items-center gap-1.5">
              {sectionData.map((section, index) => {
                const isActive = index === currentSection;
                const isCompleted = index < currentSection;
                const SectionIcon = section.icon;
                
                return (
                  <div key={index} className={`flex items-center gap-1.5 flex-1 px-2 py-1.5 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-primary/10 border border-primary/30' : 'border border-transparent'
                  }`}>
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300
                      ${isActive 
                        ? 'border-primary text-primary bg-primary/15' 
                        : isCompleted
                        ? 'border-success text-white bg-success'
                        : 'border-muted-foreground text-muted-foreground bg-muted/20'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <SectionIcon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] md:text-xs font-semibold transition-colors duration-300 truncate ${
                        isActive 
                          ? 'text-primary' 
                          : isCompleted
                          ? 'text-success'
                          : 'text-muted-foreground'
                      }`}>
                        {section.title}
                      </p>
                    </div>
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