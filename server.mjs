import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in server environment.');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
const INTERVIEW_MODEL = 'gemini-2.5-flash';
const ANALYSIS_MODEL = 'gemini-3-pro-preview';

app.use(cors());
app.use(express.json({ limit: '20mb' }));

function cleanJSON(text) {
  if (!text) return '{}';
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return clean;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt.' });
    }

    const response = await ai.models.generateContent({
      model: INTERVIEW_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      },
    });

    const questions = JSON.parse(cleanJSON(response.text || '[]'));
    res.json({ questions: Array.isArray(questions) ? questions : [] });
  } catch (error) {
    console.error('generate-questions error', error);
    res.status(500).json({ error: 'Failed to generate questions.' });
  }
});

app.post('/api/ai/transcribe-analyze', async (req, res) => {
  try {
    const { question, mimeType, base64Audio } = req.body || {};
    if (!question || !base64Audio) {
      return res.status(400).json({ error: 'Missing question or audio.' });
    }

    const response = await ai.models.generateContent({
      model: INTERVIEW_MODEL,
      contents: {
        parts: [
          {
            text: `Transcribe the audio/video answer to the question: "${question}". Then, rate the quality of the answer on a scale of 1-100 based on relevance, clarity, and depth. Return JSON: { "transcript": string, "score": number }.`
          },
          { inlineData: { mimeType: mimeType || 'video/webm', data: base64Audio } },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transcript: { type: Type.STRING },
            score: { type: Type.INTEGER },
          },
        },
      },
    });

    const parsed = JSON.parse(cleanJSON(response.text || '{}'));
    res.json({
      transcript: parsed.transcript || 'Audio could not be processed.',
      quality: parsed.score || 50,
    });
  } catch (error) {
    console.error('transcribe-analyze error', error);
    res.status(500).json({ error: 'Failed to transcribe/analyze.' });
  }
});

app.post('/api/ai/generate-profile', async (req, res) => {
  try {
    const { prompt, fallbackRole, fallbackScore } = req.body || {};
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt.' });
    }

    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedRole: { type: Type.STRING },
            finalMatchScore: { type: Type.INTEGER },
            formattedResume: { type: Type.STRING },
          },
        },
      },
    });

    const parsed = JSON.parse(cleanJSON(response.text || '{}'));
    res.json({
      summary: parsed.summary || 'Could not generate profile.',
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      suggestedRole: parsed.suggestedRole || fallbackRole || 'Candidate',
      finalMatchScore: parsed.finalMatchScore || fallbackScore || 50,
      formattedResume: parsed.formattedResume || '# Profile Generation Failed\nPlease try again.',
    });
  } catch (error) {
    console.error('generate-profile error', error);
    res.status(500).json({ error: 'Failed to generate profile.' });
  }
});

app.use(express.static(distDir));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  return res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Talent Finder API listening on port ${port}`);
});
