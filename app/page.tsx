"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { format, differenceInDays, parseISO } from "date-fns"

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

export default function HomePage() {
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [reflection, setReflection] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [currentInsight, setCurrentInsight] = useState<{ summary: string; themes: string[] } | null>(null)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const emotions = [
    { label: "Happy", color: "bg-yellow-100" },
    { label: "Calm", color: "bg-blue-100" },
    { label: "Peaceful", color: "bg-emerald-100" },
    { label: "Anxious", color: "bg-purple-100" },
    { label: "Sad", color: "bg-indigo-100" },
    { label: "Angry", color: "bg-red-100" },
  ]

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/entries")
      const data = await response.json()
      setEntries(data.entries || [])
      
      // Set the most recent insight if available
      if (data.entries && data.entries.length > 0 && data.entries[0].insights) {
        setCurrentInsight(data.entries[0].insights)
      }
    } catch (error) {
      console.error("Error fetching entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveReflection = async () => {
    if (!reflection.trim()) {
      alert("Please write a reflection before saving.")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emotion: selectedEmotion,
          reflection: reflection.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save reflection")
      }

      const data = await response.json()
      
      // Update current insight
      if (data.entry.insights) {
        setCurrentInsight(data.entry.insights)
      }

      // Refresh entries list
      await fetchEntries()

      // Clear form
      setReflection("")
      setSelectedEmotion(null)
      
      alert("Reflection saved successfully!")
    } catch (error) {
      console.error("Error saving reflection:", error)
      alert("Failed to save reflection. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    setReflection("")
    setSelectedEmotion(null)
  }

  const scrollToEmotionSection = () => {
    const element = document.getElementById("emotion-check-in")
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Calculate theme counts from entries
  const themeCounts: Record<string, number> = {}
  entries.forEach((entry) => {
    if (entry.insights?.themes) {
      entry.insights.themes.forEach((theme) => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1
      })
    }
  })

  const themes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count: `${count} ${count === 1 ? "entry" : "entries"}`,
    }))

  // Get entries for timeline (last 7 days) and group by date
  const today = new Date()
  const allTimelineEntries = entries
    .filter((entry) => {
      const entryDate = parseISO(entry.date)
      const daysDiff = differenceInDays(today, entryDate)
      return daysDiff >= 0 && daysDiff < 7
    })
    .sort((a, b) => {
      // Sort by date first, then by time
      const dateA = parseISO(a.date)
      const dateB = parseISO(b.date)
      if (dateA.getTime() !== dateB.getTime()) {
        return dateB.getTime() - dateA.getTime()
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

  // Group entries by date
  const groupedByDate = allTimelineEntries.reduce((acc, entry) => {
    const dateKey = entry.date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(entry)
    return acc
  }, {} as Record<string, JournalEntry[]>)

  // Convert to array and sort by date (newest first)
  const timelineDays = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => {
      return parseISO(dateB).getTime() - parseISO(dateA).getTime()
    })
    .slice(0, 7)

  // Helper function to get time of day as percentage (0-100%)
  const getTimeOfDayPercentage = (createdAt: string) => {
    const date = new Date(createdAt)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    // Convert to percentage of day (0 = midnight, 100 = end of day)
    return ((hours * 60 + minutes) / (24 * 60)) * 100
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-8 md:px-12">
        <div className="text-2xl font-light tracking-wide text-slate-700">Reflect</div>
        <div className="flex items-center gap-3">
          <Link href="/reflections">
            <Button 
              variant="ghost" 
              className="text-slate-600 hover:text-slate-900"
            >
              View all reflections
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-slate-600 hover:text-slate-900"
            onClick={scrollToEmotionSection}
          >
            Start today
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center space-y-6 px-6 py-20 md:py-32 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-slate-600 mb-2">
          Hi Michelle!
        </h2>
        <h1 className="text-5xl md:text-6xl font-light leading-tight max-w-3xl text-slate-900">
          Reflect on how you <span className="font-normal">feel</span> today
        </h1>
        <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
          Understand patterns over time. No scores. No pressure. Just you, reflecting freely.
        </p>
        <Button 
          size="lg" 
          className="mt-4 bg-slate-900 text-white hover:bg-slate-800"
          onClick={scrollToEmotionSection}
        >
          Start today
        </Button>
      </section>

      {/* Emotion Check-In */}
      <section id="emotion-check-in" className="space-y-8 px-6 py-20 md:px-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light text-slate-900 mb-2">How you feel today</h2>
          <p className="text-slate-500 mb-8">Colors and feelings, no numbers or scores</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {emotions.map((emotion) => (
              <button
                key={emotion.label}
                onClick={() => setSelectedEmotion(emotion.label)}
                onMouseEnter={() => setHoveredEmotion(emotion.label)}
                onMouseLeave={() => setHoveredEmotion(null)}
                className={`p-6 rounded-lg transition-all cursor-pointer ${emotion.color} ${
                  selectedEmotion === emotion.label
                    ? "ring-2 ring-offset-2 ring-slate-600 scale-105"
                    : hoveredEmotion === emotion.label
                    ? "ring-2 ring-offset-2 ring-slate-400 scale-105"
                    : "hover:shadow-md"
                }`}
              >
                <p className="text-sm font-medium text-slate-700">{emotion.label}</p>
              </button>
            ))}
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-light text-slate-900 mb-3">Write your reflection</h3>
            <p className="text-slate-500 mb-6">Share your thoughts without judgment or limits</p>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What's on your mind today? Write freely without judgment..."
              className="min-h-40 text-base rounded-lg border-slate-300 bg-white shadow-sm focus:shadow-md transition-shadow"
            />
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSaveReflection}
                disabled={isSaving || !reflection.trim()}
                className="bg-slate-900 text-white hover:bg-slate-800 font-medium disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save reflection"}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="text-slate-600 border-slate-300 hover:bg-slate-50 bg-white font-medium"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Reflection Card */}
      <section className="space-y-8 px-6 py-20 md:px-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light text-slate-900 mb-8">Your reflection</h2>

          {currentInsight ? (
            <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-600 mb-4">AI SUMMARY</p>
              <p className="text-lg leading-relaxed text-slate-800 mb-6">{currentInsight.summary}</p>

              <div className="space-y-3 border-t border-slate-300 pt-6">
                <p className="text-sm font-semibold text-slate-600">Key themes</p>
                <div className="flex flex-wrap gap-2">
                  {currentInsight.themes.map((theme) => (
                    <span
                      key={theme}
                      className="px-3 py-1 bg-white text-slate-700 text-sm rounded-full border border-slate-300"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-600 mb-4">AI SUMMARY</p>
              <p className="text-lg leading-relaxed text-slate-800 mb-6 text-slate-500 italic">
                Save a reflection to see your personalized AI insights here.
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-8 px-6 py-20 md:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-slate-900 mb-8">Your emotional patterns</h2>

          <div className="space-y-6">
            {isLoading ? (
              <p className="text-slate-500 text-center py-8">Loading...</p>
            ) : timelineDays.length > 0 ? (
              timelineDays.map(([date, dayEntries]) => {
                const entryDate = parseISO(date)
                const daysDiff = differenceInDays(today, entryDate)
                
                // Sort entries by time (earliest first for left-to-right display)
                const sortedEntries = [...dayEntries].sort((a, b) => {
                  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                })

                // Calculate positions for each segment based on time of day
                const segments = sortedEntries.map((entry, index) => {
                  const timePercent = getTimeOfDayPercentage(entry.created_at)
                  const emotionColor = entry.emotion
                    ? emotions.find((e) => e.label === entry.emotion)?.color || "bg-slate-100"
                    : "bg-slate-100"
                  
                  // Calculate width and position based on time between entries
                  let left = 0
                  let width = 100
                  
                  if (sortedEntries.length === 1) {
                    // Single entry: full width
                    left = 0
                    width = 100
                  } else {
                    if (index === 0) {
                      // First segment: from start to midpoint between first and second entry
                      const nextTime = getTimeOfDayPercentage(sortedEntries[index + 1].created_at)
                      left = 0
                      width = (timePercent + nextTime) / 2
                    } else if (index === sortedEntries.length - 1) {
                      // Last segment: from previous midpoint to end
                      const prevTime = getTimeOfDayPercentage(sortedEntries[index - 1].created_at)
                      left = (timePercent + prevTime) / 2
                      width = 100 - left
                    } else {
                      // Middle segments: between midpoints of adjacent entries
                      const prevTime = getTimeOfDayPercentage(sortedEntries[index - 1].created_at)
                      const nextTime = getTimeOfDayPercentage(sortedEntries[index + 1].created_at)
                      left = (timePercent + prevTime) / 2
                      width = (nextTime + timePercent) / 2 - left
                    }
                  }

                  return {
                    entry,
                    emotionColor,
                    width: Math.max(width, 8), // Minimum 8% width for visibility
                    left: Math.max(0, left),
                    time: format(parseISO(entry.created_at), "h:mm a"),
                  }
                })

                return (
                  <div key={date} className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 w-20 flex-shrink-0">
                        {daysDiff === 0 ? "Today" : daysDiff === 1 ? "1d ago" : `${daysDiff}d ago`}
                      </span>
                      <div className="flex-1 relative h-16 bg-slate-100 rounded-md overflow-hidden">
                        {segments.map((segment, segIndex) => (
                          <div
                            key={segment.entry.id}
                            className={`absolute h-full ${segment.emotionColor} opacity-75 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center group`}
                            style={{
                              left: `${segment.left}%`,
                              width: `${segment.width}%`,
                            }}
                            title={`${segment.entry.emotion || "No emotion"} - ${segment.time}: ${segment.entry.reflection.substring(0, 50)}...`}
                          >
                            <span className="text-xs text-slate-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity px-1 text-center">
                              {segment.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Show timestamps below the bar */}
                    <div className="flex items-center gap-4">
                      <div className="w-20"></div>
                      <div className="flex-1 flex gap-1 text-xs text-slate-400">
                        {segments.map((segment, segIndex) => (
                          <span
                            key={segment.entry.id}
                            className="flex-1 text-center"
                            style={{ flex: `0 0 ${segment.width}%` }}
                          >
                            {segment.time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-slate-500 text-center py-8">No entries yet. Start reflecting to see your patterns!</p>
            )}
          </div>
        </div>
      </section>

      {/* Common Themes */}
      <section className="space-y-8 px-6 py-20 md:px-12 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light text-slate-900 mb-8">Your themes</h2>

          {themes.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <Card
                  key={theme.name}
                  className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-sm font-semibold text-slate-600 mb-2">{theme.count}</p>
                  <p className="text-lg font-medium text-slate-900">{theme.name}</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              Save reflections to see your recurring themes appear here.
            </p>
          )}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="space-y-8 px-6 py-20 md:py-32 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-slate-900 max-w-2xl mx-auto">Start reflecting today</h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          A safe, private space to understand yourself better over time.
        </p>
        <Button size="lg" className="mx-auto bg-slate-900 text-white hover:bg-slate-800">
          Begin your journey
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8 md:px-12 text-center text-sm text-slate-500">
        <p>Reflect • A journal for self-understanding</p>
      </footer>
    </div>
  )
}
