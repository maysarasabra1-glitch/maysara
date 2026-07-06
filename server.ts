import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crash on startup if key is missing during build
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Advisor endpoint
app.post('/api/advisor', async (req, res) => {
  try {
    const { prompt, isDraftRequest, districtName, issueTitle, issueDescription } = req.body;

    if (!prompt && !isDraftRequest) {
      return res.status(400).json({ error: 'من فضلك أرسل سؤالاً أو تفاصيل الشكوى للصياغة.' });
    }

    const ai = getGeminiClient();

    let userMessage = prompt;
    let systemInstruction = `أنت "المستشار الذكي لمحليات وطن"، خبير ومستشار قانوني متخصص في شئون الإدارة المحلية وقانون المجالس المحلية المصري رقم 43 لسنة 1979 وتعديلاته وتطبيقاته بمحافظة القاهرة.
    مهمتك هي مساعدة المواطنين وأعضاء المجالس المحلية في محافظة القاهرة بتقديم إرشادات قانونية مبسطة، إجابات واضحة، وصياغات قانونية صحيحة ورسمية للشكاوى والطلبات.
    
    إرشادات عامة:
    1. أجب دائماً باللغة العربية الفصحى المبسطة وبأسلوب رسمي، لبق، ومحفز للعمل المدني والمشاركة المجتمعية.
    2. صنف الإجابة بوضوح باستخدام عناوين فرعية ونقاط منسقة لتسهيل القراءة والمتابعة.
    3. إذا طلب المواطن صياغة شكوى رسمية أو طلب، قم بصياغة مستند قانوني مهني غاية في الاحترافية ومكتوب بأسلوب إداري متميز موجه للمسؤول المختص (مثل السيد اللواء محافظ القاهرة، أو السيد رئيس الحي المعني).
    4. أشر دائماً إلى المواد القانونية المرتبطة في قانون الإدارة المحلية إن وجدت (مثلاً: دور المجلس المحلي في الرقابة، كيفية تشكيل اللجان، حقوق المواطن في الإبلاغ) لتعزيز موثوقية المنصة وقوتها.
    5. تجنب الإشادة المبالغ فيها بنفسك، واجعل المحتوى عملياً وواقعياً يخدم المصلحة العامة.`;

    if (isDraftRequest) {
      systemInstruction += `\nلقد طلب المستخدم صياغة "شكوى رسمية" تتبع الأطر التنفيذية بمحافظة القاهرة.`;
      userMessage = `صغ شكوى رسمية ومقنعة وقانونية بالتفاصيل التالية:
      - الحي المعني: حي ${districtName || 'غير محدد'} بمحافظة القاهرة
      - عنوان المشكلة: ${issueTitle}
      - تفاصيل المشكلة وأضرارها: ${issueDescription}
      
      قم بالصياغة باتباع البروتوكول الإداري المصري الرسمي (يبدأ بالسلام، التقديم، عرض المشكلة قانونياً، تحديد المطالب بوضوح، تذييل بالتوقيع والاسم والبيانات كفراغات فارغة).
      قم بتضمين نصائح للمواطن عن كيفية تقديم هذا الطلب الفعلي (مثلاً: التوجه للمركز التكنولوجي بالحي، تقديمها عبر منظومة الشكاوى الموحدة، أو تسليمها لسكرتارية مكتب رئيس الحي والحصول على رقم صادر).`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'عذراً، لم أتمكن من معالجة طلبك في الوقت الحالي. يرجى المحاولة لاحقاً.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Error in AI Advisor:', error);
    res.status(500).json({ 
      error: error.message || 'حدث خطأ غير متوقع أثناء معالجة الطلب في خادم الذكاء الاصطناعي.' 
    });
  }
});

// Setup Vite Dev Server / Static Asset Hosting
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
