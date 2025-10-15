import type { SurveyResponse } from "./schema";

export type SectionKey = "environment" | "relationship" | "motivation";

export type QuestionType = "likert" | "categorical";

export interface SectionQuestion {
  id: keyof SurveyResponse;
  label: string;
  type: QuestionType;
}

export const environmentQuestions: SectionQuestion[] = [
  {
    id: "setor_localizacao",
    label: "Para análise das condições do setor de trabalho, informar a localização do setor:",
    type: "categorical",
  },
  {
    id: "setor_computadores",
    label: "Os computadores do setor necessários para realizar o meu trabalho são adequados.",
    type: "likert",
  },
  {
    id: "setor_mobiliario",
    label: "Os mobiliários e as instalações do setor são adequados (estão em boas condições).",
    type: "likert",
  },
  {
    id: "setor_limpeza",
    label: "A limpeza do setor é adequada.",
    type: "likert",
  },
  {
    id: "setor_temperatura",
    label: "A temperatura do setor é adequada.",
    type: "likert",
  },
  {
    id: "setor_iluminacao",
    label: "A iluminação do setor é adequada.",
    type: "likert",
  },
  {
    id: "alojamento_localizacao",
    label: "Para análise das condições dos alojamentos, informar a localização do alojamento:",
    type: "categorical",
  },
  {
    id: "alojamento_limpeza",
    label: "A limpeza do alojamento é adequada.",
    type: "likert",
  },
  {
    id: "alojamento_temperatura",
    label: "A temperatura do alojamento é adequada.",
    type: "likert",
  },
  {
    id: "alojamento_iluminacao",
    label: "A iluminação do alojamento é adequada.",
    type: "likert",
  },
  {
    id: "alojamento_armarios_condicao",
    label: "Os armários estão em boas condições de pintura e preservação.",
    type: "likert",
  },
  {
    id: "alojamento_armario_preservado",
    label: "Tenho realizado a limpeza e arrumação do meu armário de modo a preservá-lo.",
    type: "likert",
  },
  {
    id: "banheiro_localizacao",
    label: "Para análise das condições dos banheiros, informar a localização do banheiro:",
    type: "categorical",
  },
  {
    id: "banheiro_vasos_suficientes",
    label: "Os vasos são suficientes para o contingente de usuários.",
    type: "likert",
  },
  {
    id: "banheiro_vasos_preservados",
    label: "Os vasos estão em boas condições de limpeza e preservação.",
    type: "likert",
  },
  {
    id: "banheiro_torneiras_funcionam",
    label: "As torneiras funcionam adequadamente.",
    type: "likert",
  },
  {
    id: "banheiro_chuveiros_suficientes",
    label: "Os chuveiros são suficientes para o contingente de usuários.",
    type: "likert",
  },
  {
    id: "banheiro_chuveiros_funcionam",
    label: "Os chuveiros funcionam adequadamente.",
    type: "likert",
  },
  {
    id: "banheiro_limpeza",
    label: "A limpeza do banheiro é adequada.",
    type: "likert",
  },
  {
    id: "banheiro_iluminacao",
    label: "A iluminação do banheiro é adequada.",
    type: "likert",
  },
  {
    id: "recreio_localizacao",
    label: "Para análise das condições dos salões de recreio, informar a localização do salão:",
    type: "categorical",
  },
  {
    id: "recreio_mobiliario_quantidade",
    label: "A quantidade de mobiliário do salão de recreio é adequada para o contingente de usuários.",
    type: "likert",
  },
  {
    id: "recreio_mobiliario_condicao",
    label: "O mobiliário do salão de recreio está em boas condições.",
    type: "likert",
  },
  {
    id: "recreio_limpeza",
    label: "A limpeza do salão de recreio é adequada.",
    type: "likert",
  },
  {
    id: "recreio_temperatura",
    label: "A temperatura do salão de recreio é adequada.",
    type: "likert",
  },
  {
    id: "recreio_iluminacao",
    label: "A iluminação do salão de recreio é adequada.",
    type: "likert",
  },
  {
    id: "rancho_localizacao",
    label: "Para análise das condições do rancho, informar a localização do rancho:",
    type: "categorical",
  },
  {
    id: "rancho_qualidade_comida",
    label: "Estou satisfeito com a qualidade da comida servida no rancho.",
    type: "likert",
  },
  {
    id: "rancho_mobiliario_condicao",
    label: "O mobiliário do rancho está em boas condições de preservação e limpeza.",
    type: "likert",
  },
  {
    id: "rancho_limpeza",
    label: "A limpeza do rancho é adequada.",
    type: "likert",
  },
  {
    id: "rancho_temperatura",
    label: "A temperatura do rancho é adequada.",
    type: "likert",
  },
  {
    id: "rancho_iluminacao",
    label: "A iluminação do rancho é adequada.",
    type: "likert",
  },
  {
    id: "escala_servico_tipo",
    label: "Para análise das condições da escala de serviço, informar sua escala:",
    type: "categorical",
  },
  {
    id: "escala_equipamentos_condicao",
    label: "Quando estou de serviço, percebo que os equipamentos utilizados estão em boas condições.",
    type: "likert",
  },
  {
    id: "escala_pernoite_adequada",
    label: "Quando estou de serviço, as instalações de pernoite são adequadas.",
    type: "likert",
  },
  {
    id: "tfm_participa_regularmente",
    label: "Participo com regularidade do Treinamento Físico Militar.",
    type: "likert",
  },
  {
    id: "tfm_incentivo_pratica",
    label: "É incentivada a prática de Treinamento Físico Militar.",
    type: "likert",
  },
  {
    id: "tfm_instalacoes_adequadas",
    label: "Considero as instalações para a prática de Treinamento Físico Militar adequadas.",
    type: "likert",
  },
];

export const relationshipQuestions: SectionQuestion[] = [
  {
    id: "encarregado_ouve_melhorias",
    label: "Meu Encarregado está interessado em ouvir as minhas propostas de melhoria de processo.",
    type: "likert",
  },
  {
    id: "encarregado_fornece_meios",
    label: "O meu Encarregado fornece os meios necessários para o cumprimento das minhas atribuições.",
    type: "likert",
  },
  {
    id: "disposicao_contribuir_setor",
    label: "Estou interessado em contribuir com as atividades e tarefas do meu setor.",
    type: "likert",
  },
  {
    id: "encarregado_delega",
    label: "O meu Encarregado sabe delegar responsabilidades.",
    type: "likert",
  },
  {
    id: "pares_auxiliam_setor",
    label: "Meus pares me auxiliam sempre que preciso resolver problemas do meu setor.",
    type: "likert",
  },
  {
    id: "relacionamento_intersetorial",
    label: "O relacionamento entre os setores é considerado satisfatório.",
    type: "likert",
  },
  {
    id: "entrosamento_tripulacao",
    label: "Existe um bom entrosamento entre os integrantes da Tripulação.",
    type: "likert",
  },
  {
    id: "convivencia_regras",
    label: "A convivência com meus pares e superiores observa as regras do \"bom convívio\".",
    type: "likert",
  },
  {
    id: "confianca_respeito_relacoes",
    label: "Existe confiança e respeito nas relações no meu ambiente de trabalho.",
    type: "likert",
  },
  {
    id: "integracao_familia_papem",
    label: "A OM adota as medidas necessárias para que os integrantes da tripulação sintam-se integrados à Família PAPEM.",
    type: "likert",
  },
];

export const motivationQuestions: SectionQuestion[] = [
  {
    id: "feedback_desempenho_regular",
    label: "Recebo regularmente informações sobre o meu desempenho.",
    type: "likert",
  },
  {
    id: "conceito_compativel_desempenho",
    label: "Considero o meu conceito compatível com o meu desempenho profissional.",
    type: "likert",
  },
  {
    id: "importancia_funcao_papem",
    label: "Eu identifico a importância da minha função dentro das atividades da PAPEM.",
    type: "likert",
  },
  {
    id: "trabalho_reconhecido_valorizado",
    label: "Considero que o meu trabalho é reconhecido e valorizado.",
    type: "likert",
  },
  {
    id: "crescimento_profissional_estimulado",
    label: "Percebo que o meu desenvolvimento e crescimento profissional são estimulados.",
    type: "likert",
  },
  {
    id: "cursos_suficientes_atividade",
    label: "Os cursos e treinamentos que fiz são suficientes para o exercício das minhas atividades.",
    type: "likert",
  },
  {
    id: "programa_adestramento_regular",
    label: "Percebo que existe um programa de adestramento regular ou que é incentivada a realização de cursos relacionados com minha atividade.",
    type: "likert",
  },
  {
    id: "orgulho_trabalhar_papem",
    label: "Sinto orgulho de trabalhar na PAPEM.",
    type: "likert",
  },
  {
    id: "atuacao_area_especializacao",
    label: "Minha função é exercida de acordo com minha área de especialização ou formação profissional.",
    type: "likert",
  },
  {
    id: "potencial_melhor_em_outra_funcao",
    label: "Desenvolveria melhor meu potencial se estivesse em outra função.",
    type: "likert",
  },
  {
    id: "carga_trabalho_justa",
    label: "Considero justo minha carga de trabalho e minhas atribuições.",
    type: "likert",
  },
  {
    id: "licenca_autorizada_sem_prejuizo",
    label: "Quando necessito gozar algum tipo de licença especial, sou autorizado pelo meu chefe, sem prejuízo ao serviço.",
    type: "likert",
  },
];

export const sectionQuestions: Record<SectionKey, SectionQuestion[]> = {
  environment: environmentQuestions,
  relationship: relationshipQuestions,
  motivation: motivationQuestions,
};

export interface RatingBreakdown {
  rating: string;
  count: number;
}

export interface QuestionStats {
  questionId: keyof SurveyResponse;
  label: string;
  type: QuestionType;
  totalResponses: number;
  ratings: RatingBreakdown[];
  average: number | null;
}

export interface SectionStatsResponse {
  section: SectionKey;
  questions: QuestionStats[];
  totalResponses: number;
}

export interface CommentRecord {
  id: number;
  setor_localizacao: string | null;
  aspecto_positivo: string | null;
  aspecto_negativo: string | null;
  proposta_processo: string | null;
  proposta_satisfacao: string | null;
  created_at: string | null;
}
