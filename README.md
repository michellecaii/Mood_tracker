# Mood Journal Landing Page

A minimalist mood journal application with AI-powered insights. Reflect on your emotions, write freely, and receive personalized summaries and themes from your journal entries.

## Features

- **Emotion Check-in**: Select how you're feeling with a simple, color-coded interface
- **Free-form Reflection**: Write your thoughts without judgment or limits
- **AI Insights**: Get personalized 2-3 sentence summaries and 3-5 key themes from each entry
- **Pattern Tracking**: View your emotional patterns over time
- **Theme Discovery**: See recurring themes across your journal entries
- **Database Storage**: All entries and insights are stored locally in SQLite

## Setup

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
GEMINI_API_KEY=your_google_gemini_api_key_here
```

To get a Google Gemini API key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy it to your `.env.local` file

**Note**: The app will work without an API key, but AI insights will show a fallback message. To get personalized insights, you'll need to add your Google Gemini API key.

### 3. Run the Development Server

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database

The application uses SQLite for local storage. The database file is automatically created in the `data/` directory when you first save an entry.

### Database Schema

- **journal_entries**: Stores journal entries with date, emotion, and reflection text
- **ai_insights**: Stores AI-generated summaries and themes for each entry

## API Routes

- `POST /api/entries` - Create a new journal entry (generates AI insights automatically)
- `GET /api/entries` - Get all journal entries (optional query params: `?days=7` or `?date=2024-01-01`)
- `GET /api/entries/[id]` - Get a specific journal entry by ID

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **SQLite (better-sqlite3)** - Local database
- **Google Gemini API** - AI insights generation
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **date-fns** - Date utilities

## Project Structure

```
├── app/
│   ├── api/
│   │   └── entries/        # API routes for journal entries
│   ├── page.tsx            # Main landing page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   └── ui/                 # UI components
├── lib/
│   ├── db.ts               # Database setup and queries
│   ├── ai.ts               # Google Gemini integration
│   └── utils.ts            # Utility functions
└── data/                   # SQLite database (auto-created)
```

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The database is stored locally in the `data/` directory
- All journal entries are private and stored on your machine
- AI insights require a Google Gemini API key (free tier available)
- The app works offline for viewing entries, but AI insights require internet connection
- 

## Demo Link
- https://youtu.be/Ns7uABqJ_XE

