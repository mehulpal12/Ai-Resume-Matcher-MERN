export interface IAISpecs {
  matchPercentage: number;
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  verdict: string;
  tailoredResumeBullets: string[];
}

export interface IAnalyzeBody {
  jobDescription?: string;
  resumeText?: string;
}