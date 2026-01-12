import { GoogleGenerativeAI } from '@google/generative-ai';

// #region agent log
fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:3',message:'Module load - checking env var',data:{hasGeminiKey:!!process.env.GEMINI_API_KEY,keyLength:process.env.GEMINI_API_KEY?.length||0,allEnvKeys:Object.keys(process.env).filter(k=>k.includes('GEMINI')||k.includes('GEMINI')).join(',')},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// #region agent log
fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:8',message:'Module load - genAI created',data:{genAIExists:!!genAI,genAIType:genAI?.constructor?.name||'null'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
// #endregion

export interface AIInsightResult {
  summary: string;
  themes: string[];
}

export async function generateInsights(reflection: string, emotion?: string | null): Promise<AIInsightResult> {
  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:15',message:'generateInsights entry',data:{hasGenAI:!!genAI,hasEnvKey:!!process.env.GEMINI_API_KEY,envKeyLength:process.env.GEMINI_API_KEY?.length||0,checkResult:!genAI||!process.env.GEMINI_API_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  if (!genAI || !process.env.GEMINI_API_KEY) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:20',message:'Returning fallback - API key check failed',data:{genAIIsNull:!genAI,envKeyIsMissing:!process.env.GEMINI_API_KEY},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // Fallback response if API key is not set
    return {
      summary: "Your reflection has been saved. Add your Google Gemini API key to generate personalized insights.",
      themes: ["Reflection", "Mindfulness", "Self-awareness"],
    };
  }

  // #region agent log
  fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:28',message:'API key check passed - proceeding to generate',data:{reflectionLength:reflection.length,hasEmotion:!!emotion},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
  // #endregion

  const emotionContext = emotion ? `The user selected the emotion: ${emotion}.` : '';
  
  const prompt = `You are a compassionate AI assistant that helps people understand their emotions and thoughts through journal entries. Provide empathetic, insightful, and supportive analysis.

Analyze the following journal entry and provide:
1. A personalized summary (2-3 sentences) that captures the emotional tone and key thoughts
2. 3-5 key themes (single words or short phrases) that represent the main topics or patterns

${emotionContext}

Journal Entry:
"${reflection}"

Respond in JSON format with this exact structure:
{
  "summary": "2-3 sentence personalized summary here",
  "themes": ["theme1", "theme2", "theme3", "theme4", "theme5"]
}

Make the summary empathetic, insightful, and supportive. Keep themes concise (1-2 words each).`;

  try {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:50',message:'Before API call',data:{promptLength:prompt.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
    });
    
    const result = await model.generateContent(prompt);
    
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:58',message:'API call successful',data:{hasResult:!!result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'G'})}).catch(()=>{});
    // #endregion
    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('No response from Gemini');
    }

    // Extract JSON from response (handle cases where there might be markdown code blocks)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/g, '').trim();
    }

    const parsed = JSON.parse(jsonContent);
    
    return {
      summary: parsed.summary || "Your reflection has been saved.",
      themes: Array.isArray(parsed.themes) 
        ? parsed.themes.slice(0, 5) // Ensure max 5 themes
        : ["Reflection", "Mindfulness", "Self-awareness"],
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai.ts:85',message:'Error in generateInsights',data:{errorName:error instanceof Error?error.name:'unknown',errorMessage:error instanceof Error?error.message:'unknown'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H'})}).catch(()=>{});
    // #endregion
    console.error('Error generating AI insights:', error);
    // Return fallback response on error
    return {
      summary: "Your reflection has been saved. There was an issue generating insights, but your entry is stored safely.",
      themes: ["Reflection", "Mindfulness", "Self-awareness"],
    };
  }
}
