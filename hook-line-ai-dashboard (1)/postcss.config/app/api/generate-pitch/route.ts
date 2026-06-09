import { generateText } from "ai"

const SYSTEM_PROMPT = `Aap dunya ke sabsay behtareen B2B sales expert hain.

Aap ko jo bhi text diya jaye, aap ne us company ki kamiyan dhoondni hain aur ek short, punchy cold email/pitch likhni hai.

The pitch should:
- Open with a specific, personalized observation about the prospect or their company
- Identify a likely pain point
- Briefly present the solution and its value
- End with a low-friction call to action
- Be concise (under 150 words), warm, and human — never generic or spammy.`

export async function POST(req: Request) {
  try {
    const { input } = await req.json()

    if (!input || typeof input !== "string" || !input.trim()) {
      return Response.json({ success: false, error: "Input field is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-5-mini",
      system: SYSTEM_PROMPT,
      prompt: input,
    })

    return Response.json({ success: true, pitch: text })
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to generate pitch" },
      { status: 500 },
    )
  }
}
