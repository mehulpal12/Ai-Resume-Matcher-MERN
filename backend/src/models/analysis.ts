import { Schema, model, Document } from 'mongoose';
import type { IAISpecs } from '../types/analysis.js';

export interface IAnalysisDocument extends Document {
  resumeSnippet: string;
  jobDescriptionSnippet: string;
  matchPercentage: number;
  results: IAISpecs;
  createdAt: Date;
}

const analysisSchema = new Schema<IAnalysisDocument>({
  resumeSnippet: {
    type: String,
    required: true
  },
  jobDescriptionSnippet: {
    type: String,
    required: true
  },
  matchPercentage: {
    type: Number,
    required: true
  },
  results: {
    missingKeywords: [String],
    strengths: [String],
    weaknesses: [String],
    verdict: String,
    tailoredResumeBullets: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default model<IAnalysisDocument>('Analysis', analysisSchema);