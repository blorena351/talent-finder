import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config({ path: '.env.local' });
dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);
const apiKey = process.env.GEMINI_API_KEY;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const dataDir = path.join(__dirname, 'data');
const dataFile = process.env.DATA_FILE || path.join(dataDir, 'db.json');

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY in server environment.');
  process.exit(1);
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@talentfinder.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow123!';
const SHOW_VERIFICATION_CODE = process.env.SHOW_VERIFICATION_CODE === 'true';

const ai = new GoogleGenAI({ apiKey });
const INTERVIEW_MODEL = 'gemini-2.5-flash';
const ANALYSIS_MODEL = 'gemini-3-pro-preview';
const adminSessions = new Map();

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

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    const now = new Date().toISOString();
    const initial = {
      users: [
        {
          id: 'admin_user',
          name: 'System Admin',
          role: 'admin',
          email: ADMIN_EMAIL,
          passwordHash: hashPassword(ADMIN_PASSWORD),
          status: 'active',
          emailVerified: true,
          onboardingComplete: true,
          createdAt: now,
          updatedAt: now,
        },
      ],
      verificationCodes: {},
      profiles: {},
    };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeDb(db) {
  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return safe;
}

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.adminUserId = adminSessions.get(token);
  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, role } = req.body || {};
    if (!email || !password || !['company', 'applicant'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid registration payload.' });
    }

    const db = readDb();
    if (db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const now = new Date().toISOString();
    const newUser = {
      id: crypto.randomUUID(),
      email: String(email).toLowerCase(),
      name: String(email).split('@')[0],
      role,
      passwordHash: hashPassword(password),
      status: 'active',
      emailVerified: false,
      onboardingComplete: false,
      createdAt: now,
      updatedAt: now,
    };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.verificationCodes[newUser.email] = code;
    db.users.push(newUser);
    writeDb(db);

    return res.json({
      success: true,
      ...(SHOW_VERIFICATION_CODE ? { debugVerificationCode: code } : {}),
    });
  } catch (error) {
    console.error('register error', error);
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

app.post('/api/auth/verify', (req, res) => {
  try {
    const { email, code } = req.body || {};
    const db = readDb();
    const normalizedEmail = String(email || '').toLowerCase();

    if (!normalizedEmail || !code || db.verificationCodes[normalizedEmail] !== code) {
      return res.status(400).json({ success: false });
    }

    const idx = db.users.findIndex((u) => u.email === normalizedEmail);
    if (idx === -1) {
      return res.status(404).json({ success: false });
    }

    db.users[idx].emailVerified = true;
    db.users[idx].updatedAt = new Date().toISOString();
    delete db.verificationCodes[normalizedEmail];
    writeDb(db);

    return res.json({ success: true, user: publicUser(db.users[idx]) });
  } catch (error) {
    console.error('verify error', error);
    return res.status(500).json({ success: false });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = readDb();
    const user = db.users.find((u) => u.email === String(email || '').toLowerCase());

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    if (user.passwordHash !== hashPassword(String(password || ''))) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }
    if (user.role !== 'admin' && !user.emailVerified) {
      return res.status(403).json({ success: false, message: 'Email not verified.' });
    }

    return res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('login error', error);
    return res.status(500).json({ success: false, message: 'Login failed.' });
  }
});

app.post('/api/auth/onboarding', (req, res) => {
  try {
    const { userId, role, displayName, profile } = req.body || {};
    if (!userId || !role || !displayName || !profile) {
      return res.status(400).json({ success: false, message: 'Invalid onboarding payload.' });
    }

    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    db.users[idx].name = displayName;
    db.users[idx].onboardingComplete = true;
    db.users[idx].updatedAt = new Date().toISOString();
    db.profiles[userId] = { role, ...profile, updatedAt: new Date().toISOString() };
    writeDb(db);

    return res.json({ success: true, user: publicUser(db.users[idx]) });
  } catch (error) {
    console.error('onboarding error', error);
    return res.status(500).json({ success: false, message: 'Onboarding failed.' });
  }
});

app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const db = readDb();
    const admin = db.users.find((u) => u.role === 'admin' && u.email === String(email || '').toLowerCase());

    if (!admin || admin.passwordHash !== hashPassword(String(password || ''))) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = crypto.randomBytes(24).toString('hex');
    adminSessions.set(token, admin.id);

    return res.json({ success: true, token, user: publicUser(admin) });
  } catch (error) {
    console.error('admin login error', error);
    return res.status(500).json({ success: false, message: 'Admin login failed.' });
  }
});

app.get('/api/admin/users', requireAdmin, (_req, res) => {
  try {
    const db = readDb();
    return res.json({ users: db.users.map(publicUser) });
  } catch (error) {
    console.error('admin users error', error);
    return res.status(500).json({ error: 'Failed to load users.' });
  }
});

app.patch('/api/admin/users/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    if (!['active', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.users[idx].status = status;
    db.users[idx].updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, user: publicUser(db.users[idx]) });
  } catch (error) {
    console.error('admin status update error', error);
    return res.status(500).json({ error: 'Failed to update user status.' });
  }
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

ensureDb();
app.listen(port, () => {
  console.log(`Talent Finder API listening on port ${port}`);
});
