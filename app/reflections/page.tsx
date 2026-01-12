"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { format, parseISO } from "date-fns"

interface JournalEntry {
  id: number
  date: string
  emotion: string | null
  reflection: string
  created_at: string
  insights: {
    summary: string
    themes: string[]
  } | null
}

const emotions = [
  { label: "Happy", color: "bg-yellow-100" },
  { label: "Calm", color: "bg-blue-100" },
  { label: "Peaceful", color: "bg-emerald-100" },
  { label: "Anxious", color: "bg-purple-100" },
  { label: "Sad", color: "bg-indigo-100" },
  { label: "Angry", color: "bg-red-100" },
]

export default function ReflectionsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/entries")
      const data = await response.json()
      setEntries(data.entries || [])
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEmotionColor = (emotion: string | null) => {
    if (!emotion) return "bg-slate-100"
    const emotionData = emotions.find((e) => e.label === emotion)
    return emotionData?.color || "bg-slate-100"
  }

  // Group entries by date
  const groupedEntries = entries.reduce((acc, entry) => {
    const dateKey = entry.date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(entry)
    return acc
  }, {} as Record<string, JournalEntry[]>)

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-8 md:px-12">
        <Link href="/" className="text-2xl font-light tracking-wide text-slate-700 hover:text-slate-900 transition-colors">
          Reflect
        </Link>
        <Link href="/">
          <Button 
            variant="ghost" 
            className="text-slate-600 hover:text-slate-900"
          >
            Back to home
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:px-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-4">
            All Reflections
          </h1>
          <p className="text-lg text-slate-500">
            A complete history of your thoughts and feelings
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading reflections...</p>
          </div>
        ) : entries.length === 0 ? (
          <Card className="p-12 text-center bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
            <p className="text-lg text-slate-600 mb-4">No reflections yet</p>
            <p className="text-slate-500 mb-6">Start your journey by writing your first reflection</p>
            <Link href="/">
              <Button className="bg-slate-900 text-white hover:bg-slate-800">
                Write your first reflection
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-12">
            {sortedDates.map((date) => {
              const dateEntries = groupedEntries[date]
              const parsedDate = parseISO(date)
              const formattedDate = format(parsedDate, "EEEE, MMMM d, yyyy")

              return (
                <div key={date} className="space-y-6">
                  <h2 className="text-2xl font-light text-slate-700 border-b border-slate-200 pb-2">
                    {formattedDate}
                  </h2>
                  
                  <div className="space-y-6">
                    {dateEntries.map((entry) => (
                      <Card 
                        key={entry.id} 
                        className="p-6 md:p-8 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {entry.emotion && (
                              <div className={`${getEmotionColor(entry.emotion)} px-3 py-1 rounded-full`}>
                                <span className="text-sm font-medium text-slate-700">
                                  {entry.emotion}
                                </span>
                              </div>
                            )}
                            <span className="text-sm text-slate-500">
                              {format(parseISO(entry.created_at), "h:mm a")}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6">
                          <p className="text-base leading-relaxed text-slate-800 whitespace-pre-wrap">
                            {entry.reflection}
                          </p>
                        </div>

                        {entry.insights && (
                          <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
                            <div>
                              <p className="text-sm font-semibold text-slate-600 mb-2">AI Summary</p>
                              <p className="text-sm leading-relaxed text-slate-700">
                                {entry.insights.summary}
                              </p>
                            </div>
                            
                            {entry.insights.themes && entry.insights.themes.length > 0 && (
                              <div>
                                <p className="text-sm font-semibold text-slate-600 mb-2">Key Themes</p>
                                <div className="flex flex-wrap gap-2">
                                  {entry.insights.themes.map((theme) => (
                                    <span
                                      key={theme}
                                      className="px-3 py-1 bg-slate-50 text-slate-700 text-sm rounded-full border border-slate-200"
                                    >
                                      {theme}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8 md:px-12 mt-20 text-center text-sm text-slate-500">
        <p>Reflect • A journal for self-understanding</p>
      </footer>
    </div>
  )
}
