export interface AIAnalysis {
  improvedTitle: string;
  titleAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  descriptionAnalysis: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  };
  suggestedTags: string[];
  seoSuggestions: string[];
  contentStrategy: {
    recommendations: string[];
    nextSteps: string[];
  };
} 