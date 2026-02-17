/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Store } from './store';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function postJSON<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function generateQuestions(jobTitle: string, requirements: string): Promise<string[]> {
  try {
    const prompts = Store.getPrompts();
    const prompt = prompts.questionGeneration
      .replace('{{jobTitle}}', jobTitle)
      .replace('{{requirements}}', requirements);

    const data = await postJSON<{ questions: string[] }>('/api/ai/generate-questions', { prompt });
    if (Array.isArray(data.questions) && data.questions.length > 0) {
      return data.questions;
    }

    throw new Error('No questions returned');
  } catch (e) {
    console.error('Failed to generate questions', e);
    return [
      'Tell us about your experience relevant to this role.',
      'Describe a challenge you faced and how you overcame it.',
      'Why do you want to work with us?',
    ];
  }
}

export async function transcribeAndAnalyze(audioBlob: Blob, question: string): Promise<{ transcript: string; quality: number }> {
  try {
    const base64Audio = await blobToBase64(audioBlob);
    const data = await postJSON<{ transcript: string; quality: number }>('/api/ai/transcribe-analyze', {
      question,
      mimeType: audioBlob.type || 'video/webm',
      base64Audio,
    });

    return {
      transcript: data.transcript || 'Audio could not be processed.',
      quality: data.quality || 50,
    };
  } catch (e) {
    console.error('Analysis failed', e);
    return { transcript: '(Analysis unavailable due to error)', quality: 50 };
  }
}

export async function generateCandidateProfile(
  jobTitle: string,
  requirements: string,
  qaPairs: { question: string; answer: string; score: number }[]
) {
  const avgScore = Math.round(qaPairs.reduce((acc, curr) => acc + curr.score, 0) / qaPairs.length);
  const transcriptText = qaPairs.map((qa, i) => `Q${i + 1}: ${qa.question}\nA: ${qa.answer}`).join('\n\n');

  const prompts = Store.getPrompts();
  const prompt = prompts.profileGeneration
    .replace('{{jobTitle}}', jobTitle)
    .replace('{{requirements}}', requirements)
    .replace('{{avgScore}}', avgScore.toString())
    .replace('{{transcript}}', transcriptText);

  try {
    return await postJSON('/api/ai/generate-profile', {
      prompt,
      fallbackRole: jobTitle,
      fallbackScore: avgScore,
    });
  } catch (e) {
    console.error('Profile generation failed', e);
    return {
      summary: 'Could not generate profile.',
      skills: [],
      strengths: [],
      suggestedRole: jobTitle,
      finalMatchScore: avgScore,
      formattedResume: '# Profile Generation Failed\nPlease try again.',
    };
  }
}
