import { NextRequest, NextResponse } from 'next/server';
import { journalQueries, insightQueries } from '@/lib/db';

// GET /api/entries/[id] - Get a specific journal entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const entryId = parseInt(params.id, 10);

    if (isNaN(entryId)) {
      return NextResponse.json(
        { error: 'Invalid entry ID' },
        { status: 400 }
      );
    }

    const entry = journalQueries.getEntryById.get(entryId) as any;

    if (!entry) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      );
    }

    const insight = insightQueries.getInsightByEntryId.get(entryId) as any;

    return NextResponse.json({
      entry: {
        ...entry,
        insights: insight
          ? {
              summary: insight.summary,
              themes: JSON.parse(insight.themes),
            }
          : null,
      },
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal entry' },
      { status: 500 }
    );
  }
}
