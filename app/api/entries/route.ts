import { NextRequest, NextResponse } from 'next/server';
import { journalQueries, insightQueries } from '@/lib/db';
import { generateInsights } from '@/lib/ai';

// POST /api/entries - Create a new journal entry with AI insights
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emotion, reflection } = body;

    if (!reflection || reflection.trim().length === 0) {
      return NextResponse.json(
        { error: 'Reflection text is required' },
        { status: 400 }
      );
    }

    // Insert journal entry
    const result = journalQueries.insertEntry.run(emotion || null, reflection.trim());
    const entryId = result.lastInsertRowid as number;

    // Generate AI insights
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/entries/route.ts:23',message:'Before calling generateInsights',data:{hasReflection:!!reflection,reflectionLength:reflection.length,hasEmotion:!!emotion,envKeyInRoute:!!process.env.GEMINI_API_KEY,envKeyLength:process.env.GEMINI_API_KEY?.length||0},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'I'})}).catch(()=>{});
    // #endregion
    const insights = await generateInsights(reflection, emotion);
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/4b49980a-4310-4fbd-8732-7803e70dc7a1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/api/entries/route.ts:25',message:'After generateInsights',data:{hasInsights:!!insights,summaryLength:insights.summary.length,themesCount:insights.themes.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'J'})}).catch(()=>{});
    // #endregion

    // Store AI insights
    insightQueries.insertInsight.run(
      entryId,
      insights.summary,
      JSON.stringify(insights.themes)
    );

    // Get the complete entry with insights
    const entry = journalQueries.getEntryById.get(entryId) as any;
    const insight = insightQueries.getInsightByEntryId.get(entryId) as any;

    return NextResponse.json({
      entry: {
        ...entry,
        insights: insight ? {
          summary: insight.summary,
          themes: JSON.parse(insight.themes),
        } : null,
      },
    });
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

// GET /api/entries - Get all journal entries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('days');
    const date = searchParams.get('date');

    let entries: any[];

    if (date) {
      entries = journalQueries.getEntriesByDate.all(date) as any[];
    } else if (days) {
      const daysNum = parseInt(days, 10);
      entries = journalQueries.getRecentEntries.all(daysNum) as any[];
    } else {
      entries = journalQueries.getAllEntries.all() as any[];
    }

    // Attach insights to each entry
    const entriesWithInsights = entries.map((entry) => {
      const insight = insightQueries.getInsightByEntryId.get(entry.id) as any;
      return {
        ...entry,
        insights: insight
          ? {
              summary: insight.summary,
              themes: JSON.parse(insight.themes),
            }
          : null,
      };
    });

    return NextResponse.json({ entries: entriesWithInsights });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entries' },
      { status: 500 }
    );
  }
}
