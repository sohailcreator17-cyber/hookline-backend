"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Copy, Check, Loader2, RotateCcw } from "lucide-react"

const SAMPLE_PITCH = `Hi Sarah,

I noticed Brightwave just expanded its design team and shipped a refreshed onboarding flow — congrats on the momentum. Teams scaling that fast usually hit the same wall: research insights get buried in scattered docs and never reach the people shipping features.

That's exactly what we solve. HookLine helps product teams turn raw customer conversations into prioritized, shareable insights in minutes — so your designers spend time building, not digging.

Worth a 15-minute look at how teams like yours cut research synthesis time by 60%?

Best,
Jordan`

export function PitchGenerator() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  async function handleGenerate() {
    if (!input.trim() || loading) return
    setLoading(true)
    setOutput("")
    setError("")
    setCopied(false)

    try {
      const res = await fetch("/api/generate-pitch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate pitch. Please try again.")
      }

      setOutput(data.pitch ?? "")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!output) return
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Personalized Pitch Generator
        </span>
        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Write a pitch they&apos;ll actually reply to
        </h1>
        <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
          Paste a prospect&apos;s LinkedIn profile or company website and HookLine drafts a tailored,
          ready-to-send outreach message.
        </p>
      </header>

      {/* Input card */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <label htmlFor="prospect-input" className="sr-only">
          Prospect details
        </label>
        <textarea
          id="prospect-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste LinkedIn Profile Text or Website URL here..."
          rows={6}
          className="w-full resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="text-xs text-muted-foreground">{input.length} characters</span>
          <button
            onClick={handleGenerate}
            disabled={!input.trim() || loading}
            className={cn(
              "group inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all",
              "bg-gradient-to-r from-primary to-accent hover:opacity-95 hover:shadow-primary/30",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
            )}
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Personalized Pitch
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output box */}
      <OutputBox
        output={output}
        loading={loading}
        copied={copied}
        error={error}
        onCopy={handleCopy}
        onRegenerate={handleGenerate}
      />
    </div>
  )
}

function OutputBox({
  output,
  loading,
  copied,
  error,
  onCopy,
  onRegenerate,
}: {
  output: string
  loading: boolean
  copied: boolean
  error: string
  onCopy: () => void
  onRegenerate: () => void
}) {
  const hasContent = output.length > 0

  return (
    <section aria-label="Generated pitch" className="mt-6">
      <div className="flex items-center justify-between px-1 pb-2">
        <h2 className="text-sm font-medium text-foreground">Generated Pitch</h2>
        {hasContent && !loading && (
          <div className="flex items-center gap-1">
            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              Regenerate
            </button>
            <button
              onClick={onCopy}
              aria-label="Copy to clipboard"
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-accent" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="min-h-44 rounded-2xl border border-border bg-card p-5 shadow-sm">
        {loading ? (
          <div className="space-y-3">
            {[100, 92, 96, 70, 88, 60].map((w, i) => (
              <div
                key={i}
                className="h-3.5 animate-pulse rounded bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : hasContent ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{output}</p>
        ) : error ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5">
            <p className="text-sm leading-relaxed text-destructive">{error}</p>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-4 flex items-center gap-2 rounded-lg border border-dashed border-border bg-secondary/50 px-3 py-2">
              <Sparkles className="size-3.5 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">
                Example preview — this is how your personalized pitch will look. Add prospect details above
                and hit generate to create your own.
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground/80">
              {SAMPLE_PITCH}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
