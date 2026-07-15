import express, { type Request, type Response, type NextFunction, type Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import multer from 'multer';
import { PDFParse } from 'pdf-parse';
import Analysis from '../models/analysis.js';
import mongoose from 'mongoose';
import type { IAnalyzeBody, IAISpecs } from '../types/analysis.js';

const router: Router = express.Router();

// GoogleGenAI will be initialized dynamically in the route handler

// A global array to hold active real-time client connections
let clients: Response[] = [];

// Helper function to push updated history to all open browser windows
const broadcastHistory = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      const collectionHistory = await Analysis.find()
        .sort({ createdAt: -1 })
        .limit(5);
      
      // SSE data must always be formatted as a string prefixed with "data: " followed by two newlines
      const payload = `data: ${JSON.stringify(collectionHistory)}\n\n`;
      
      clients.forEach(client => client.write(payload));
    }
  } catch (err) {
    console.error("Failed to broadcast history stream:", err);
  }
};

// Configure Multer storage engine in memory buffer mode
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // Enforce a 5MB size limit boundary per resume file
});

// Core POST Route: Evaluates files or text payloads against Job Descriptions
router.post(
  '/analyze', 
  upload.single('resumeFile'), 
  async (req: Request<{}, {}, IAnalyzeBody>, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { jobDescription } = req.body;
      let resumeText = req.body.resumeText || '';

      // If an upload file payload arrives, extract the raw characters from the binary streams
      if (req.file) {
        if (req.file.mimetype !== 'application/pdf') {
          return res.status(400).json({ error: 'Unsupported file formatting. Please supply a valid standard PDF document.' });
        }
        const parser = new PDFParse({ data: req.file.buffer });
        const parsedPdf = await parser.getText();
        resumeText = parsedPdf.text;
      }

      // Defensive input checks
      if (!resumeText.trim()) {
        return res.status(400).json({ error: 'Resume vector space cannot be resolved. Upload a file or paste text content.' });
      }
      if (!jobDescription || !jobDescription.trim()) {
        return res.status(400).json({ error: 'Target Job Description properties cannot be empty.' });
      }

     const systemInstruction = `
  You are an uncompromising corporate Applicant Tracking System (ATS) mathematical processing engine.
  Your explicit job is to run a rigorous, data-driven match matrix audit comparing the Resume Text against the Job Description (JD).
  
  CRITICAL REALISM RULE: You must compute the 'matchPercentage' strictly using the following objective point deductions. Do not cluster scores around a comfortable default value like 70% or 75%. If a candidate is a poor fit, give them a low score (e.g., 20%-40%). If they are an exact fit, reward them highly.
  
  SCORING ALGORITHM CALCULATION STEPS:
  1. Start the evaluation baseline at 100 points.
  2. TECH STACK SHORTFALLS: Identify key framework, database, language, or tool requirements listed in the JD that are completely missing from the resume text. Deduct exactly 8 points for every major missing technical keyword.
  3. EXPERIENCE MAPPING DEFICIT: Check if the resume meets the explicit years of experience or structural job title requirements mentioned in the JD. Deduct up to 25 points if their longevity or seniority profile falls drastically short.
  4. CONTEXT / SOFT SKILL MISALIGNMENT: Check for operational methodology gaps (e.g., Agile, CI/CD pipelines, System Design). Deduct 4 points for each critical operational gap.
  5. The remaining point value is your absolute final integer for 'matchPercentage'. Enforce a floor value of 0 and a ceiling value of 100.
  
  Keep descriptions highly concise (under 10 words per list item) to optimize processing speeds and minimize latency overhead.
  
  You must return a raw JSON structure matching the schema template directly underneath. Do not wrap the output inside markdown tick marks or block definitions.
  
  Schema Definition:
  {
    "matchPercentage": number,
    "missingKeywords": string[],
    "strengths": string[],
    "weaknesses": string[],
    "verdict": string,
    "tailoredResumeBullets": string[]
  }
`;

      // Modern SDK structured generation sequence utilizing the lightning-fast gemini-2.5-flash
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const generationPayload = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Candidate Resume Core Text:\n${resumeText}\n\nTarget Position Job Description:\n${jobDescription}`,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchPercentage: {
                type: Type.INTEGER,
                description: 'Strict match score from 0 to 100 based on exact keyword overlap and experience requirements.'
              },
              missingKeywords: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Key skills, libraries, frameworks, or languages requested in JD but not present in Resume.'
              },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Areas where candidate meets or exceeds expectations.'
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Areas where candidate falls short or lacks experience.'
              },
              verdict: {
                type: Type.STRING,
                description: 'A 2-3 sentence strategic executive summary advising on candidate suitability.'
              },
              tailoredResumeBullets: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly three high-impact, metrics-driven bullet points customized to improve their ATS score.'
              }
            },
            required: [
              'matchPercentage',
              'missingKeywords',
              'strengths',
              'weaknesses',
              'verdict',
              'tailoredResumeBullets'
            ]
          }
        }
      });

      // Clean up character buffers and parse the validated strict target response text
      const responsePayloadText = generationPayload.text?.trim();
      if (!responsePayloadText) {
        throw new Error('Empty response envelope returned from AI core cluster.');
      }
      
      const parsedDataMetrics: IAISpecs = JSON.parse(responsePayloadText);

      // Asynchronously log execution transaction metadata if Mongoose has a live database cluster bound
      if (mongoose.connection.readyState === 1) {
        Analysis.create({
          resumeSnippet: resumeText.substring(0, 150),
          jobDescriptionSnippet: jobDescription.substring(0, 150),
          matchPercentage: parsedDataMetrics.matchPercentage,
          results: parsedDataMetrics
        })
        .then(() => {
          broadcastHistory();
        })
        .catch((err: any) => console.error('Non-blocking Database logging tracking operational failure:', err));
      }

      return res.status(200).json(parsedDataMetrics);

    } catch (error) {
      next(error);
    }
  }
);

// The modified /history route now establishes a persistent SSE connection
router.get('/history', (req: Request, res: Response) => {
  // Set SSE mandatory headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send an initial history burst immediately upon connection
  res.write('retry: 10000\n\n');
  clients.push(res);
  
  // Immediately push data to the newly connected user
  if (mongoose.connection.readyState === 1) {
    Analysis.find().sort({ createdAt: -1 }).limit(5)
      .then(history => {
        res.write(`data: ${JSON.stringify(history)}\n\n`);
      })
      .catch(err => {
        console.error("Failed to fetch initial history burst:", err);
      });
  }

  // Handle browser closing tabs or disconnecting
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

export default router;