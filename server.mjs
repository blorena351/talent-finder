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
const dataDir = process.env.DATA_DIR || '/tmp/talent-finder-data';
const dataFile = process.env.DATA_FILE || path.join(dataDir, 'db.json');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@talentfinder.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMeNow123!';
const SHOW_VERIFICATION_CODE = process.env.SHOW_VERIFICATION_CODE === 'true';
const DISABLE_EMAIL_VERIFICATION = process.env.DISABLE_EMAIL_VERIFICATION !== 'false';
const TEST_COMPANY_EMAIL = process.env.TEST_COMPANY_EMAIL || 'test.company@talentfinder.com';
const TEST_COMPANY_PASSWORD = process.env.TEST_COMPANY_PASSWORD || 'TestCompany123!';
const TEST_APPLICANT_EMAIL = process.env.TEST_APPLICANT_EMAIL || 'test.applicant@talentfinder.com';
const TEST_APPLICANT_PASSWORD = process.env.TEST_APPLICANT_PASSWORD || 'TestApplicant123!';

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const INTERVIEW_MODEL = 'gemini-2.5-flash';
const ANALYSIS_MODEL = 'gemini-3-pro-preview';
const adminSessions = new Map();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

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
    const initial = { users: [], verificationCodes: {}, profiles: {} };
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2));
  }

  const now = new Date().toISOString();
  const db = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

  const upsertUser = ({
    id,
    name,
    role,
    email,
    password,
    onboardingComplete = true,
  }) => {
    const normalizedEmail = String(email).toLowerCase();
    const existingIdx = db.users.findIndex((u) => u.email === normalizedEmail);
    const payload = {
      id,
      name,
      role,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      status: 'active',
      emailVerified: true,
      onboardingComplete,
      updatedAt: now,
    };

    if (existingIdx === -1) {
      db.users.push({ ...payload, createdAt: now });
      return id;
    }

    db.users[existingIdx] = {
      ...db.users[existingIdx],
      ...payload,
      createdAt: db.users[existingIdx].createdAt || now,
    };
    return db.users[existingIdx].id;
  };

  const adminId = upsertUser({
    id: 'admin_user',
    name: 'System Admin',
    role: 'admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    onboardingComplete: true,
  });

  const companyId = upsertUser({
    id: 'test_company_user',
    name: 'Test Company',
    role: 'company',
    email: TEST_COMPANY_EMAIL,
    password: TEST_COMPANY_PASSWORD,
    onboardingComplete: true,
  });

  const applicantId = upsertUser({
    id: 'test_applicant_user',
    name: 'Test Applicant',
    role: 'applicant',
    email: TEST_APPLICANT_EMAIL,
    password: TEST_APPLICANT_PASSWORD,
    onboardingComplete: true,
  });

  db.profiles = db.profiles || {};
  db.profiles[companyId] = db.profiles[companyId] || {
    role: 'company',
    companyName: 'Test Company',
    website: 'https://example.com',
    size: '11-50',
    industry: 'Technology',
    country: 'Portugal',
    contactPerson: 'Test Manager',
    contactPhone: '+351900000000',
    updatedAt: now,
  };

  db.profiles[applicantId] = db.profiles[applicantId] || {
    role: 'applicant',
    fullName: 'Test Applicant',
    country: 'Portugal',
    phone: '+351900000001',
    linkedInUrl: 'https://linkedin.com/in/test-applicant',
    updatedAt: now,
  };

  if (!db.users.find((u) => u.id === adminId)) {
    throw new Error('Failed to ensure admin account.');
  }

  fs.writeFileSync(dataFile, JSON.stringify(db, null, 2));
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
      emailVerified: DISABLE_EMAIL_VERIFICATION,
      onboardingComplete: false,
      createdAt: now,
      updatedAt: now,
    };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    if (!DISABLE_EMAIL_VERIFICATION) {
      db.verificationCodes[newUser.email] = code;
    }
    db.users.push(newUser);
    writeDb(db);

    return res.json({
      success: true,
      user: publicUser(newUser),
      emailVerificationRequired: !DISABLE_EMAIL_VERIFICATION,
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
    if (!DISABLE_EMAIL_VERIFICATION && user.role !== 'admin' && !user.emailVerified) {
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

app.get('/api/admin/users/:id/profile', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.json({ profile: db.profiles[id] || {} });
  } catch (error) {
    console.error('admin profile read error', error);
    return res.status(500).json({ error: 'Failed to load user profile.' });
  }
});

app.patch('/api/admin/users/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, status } = req.body || {};
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (typeof name === 'string' && name.trim().length > 0) {
      db.users[idx].name = name.trim();
    }

    if (typeof email === 'string' && email.trim().length > 0) {
      const normalizedEmail = email.trim().toLowerCase();
      const emailInUse = db.users.some((u, i) => i !== idx && u.email === normalizedEmail);
      if (emailInUse) {
        return res.status(409).json({ error: 'Email already in use.' });
      }
      db.users[idx].email = normalizedEmail;
    }

    if (typeof password === 'string' && password.length >= 8) {
      db.users[idx].passwordHash = hashPassword(password);
    }

    if (status === 'active' || status === 'suspended') {
      db.users[idx].status = status;
    }

    db.users[idx].updatedAt = new Date().toISOString();
    writeDb(db);

    return res.json({ success: true, user: publicUser(db.users[idx]) });
  } catch (error) {
    console.error('admin user update error', error);
    return res.status(500).json({ error: 'Failed to update user.' });
  }
});

app.put('/api/admin/users/:id/profile', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const profile = req.body || {};
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    db.profiles[id] = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);

    return res.json({ success: true, profile: db.profiles[id] });
  } catch (error) {
    console.error('admin profile update error', error);
    return res.status(500).json({ error: 'Failed to update user profile.' });
  }
});

app.post('/api/ai/generate-questions', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service is not configured.' });
    }

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

app.post('/api/ai/transcribe', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service is not configured.' });
    }

    const { question, mimeType, base64Audio } = req.body || {};
    if (!question || !base64Audio) {
      return res.status(400).json({ error: 'Missing question or audio.' });
    }

    const response = await ai.models.generateContent({
      model: INTERVIEW_MODEL,
      contents: {
        parts: [
          {
            text: `Transcribe the answer to this interview question: "${question}". Return JSON: { "transcript": string }.`
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
          },
        },
      },
    });

    const parsed = JSON.parse(cleanJSON(response.text || '{}'));
    res.json({
      transcript: parsed.transcript || 'Audio could not be processed.',
    });
  } catch (error) {
    console.error('transcribe error', error);
    res.status(500).json({ error: 'Failed to transcribe.' });
  }
});

app.post('/api/ai/evaluate-transcript', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service is not configured.' });
    }

    const { question, transcript } = req.body || {};
    if (!question || !transcript) {
      return res.status(400).json({ error: 'Missing question or transcript.' });
    }

    const response = await ai.models.generateContent({
      model: INTERVIEW_MODEL,
      contents: `Evaluate this interview answer transcript.\nQuestion: "${question}"\nTranscript: "${transcript}"\n\nScore the quality from 1-100 based on relevance, clarity, depth, and evidence in the text. Return JSON: { "score": number }.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
          },
        },
      },
    });

    const parsed = JSON.parse(cleanJSON(response.text || '{}'));
    res.json({
      quality: parsed.score || 50,
    });
  } catch (error) {
    console.error('evaluate-transcript error', error);
    res.status(500).json({ error: 'Failed to evaluate transcript.' });
  }
});

app.post('/api/ai/analyze-video', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service is not configured.' });
    }

    const { question, mimeType, base64Audio } = req.body || {};
    if (!question || !base64Audio) {
      return res.status(400).json({ error: 'Missing question or video.' });
    }

    const response = await ai.models.generateContent({
      model: INTERVIEW_MODEL,
      contents: {
        parts: [
          {
            text: `Analyze the non-verbal communication in this interview video answer to "${question}". Focus on delivery, confidence, pace, and clarity cues. Return JSON: { "summary": string, "confidence": number } where confidence is 1-100.`
          },
          { inlineData: { mimeType: mimeType || 'video/webm', data: base64Audio } },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
          },
        },
      },
    });

    const parsed = JSON.parse(cleanJSON(response.text || '{}'));
    res.json({
      summary: parsed.summary || 'Video analysis unavailable.',
      confidence: parsed.confidence || 50,
    });
  } catch (error) {
    console.error('analyze-video error', error);
    res.status(500).json({ error: 'Failed to analyze video.' });
  }
});

app.post('/api/ai/generate-profile', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({ error: 'AI service is not configured.' });
    }

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
