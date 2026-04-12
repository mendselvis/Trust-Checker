import { Router } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { AnalyseConversationBody } from "@workspace/api-zod";

const analyseRouter = Router();

const SYSTEM_PROMPT = `You are TrustCheck, an expert romance scam detection AI. Your job is to analyse a conversation and identify whether it shows signs of a romance scam.

You must scan for these specific patterns:
1. Speed of romantic escalation — love declared or deep affection expressed unusually quickly
2. Avoidance of video calls — excuses for why they cannot video call (broken camera, shy, travelling, bad connection)
3. Mentions of money, crypto, investment — any financial topics, requests for money, talk of investment opportunities
4. Overseas location claims — claims of being a soldier abroad, oil rig worker, doctor working overseas, etc.
5. Inconsistent story details — contradictions in age, job, location, background
6. Excessive flattery — over-the-top compliments, calling the person unique/special/soulmate very early
7. Urgency and emotional pressure — rushing into a relationship, pushing to move off the platform, urgency around decisions
8. Isolation tactics — trying to cut the person off from friends/family
9. Profile or identity inconsistencies — claims that don't match, vague personal history

Return a JSON object with EXACTLY this structure (no markdown, no explanation outside the JSON):
{
  "trustScore": <integer 0-100, where 100 = completely trustworthy, 0 = definite scam>,
  "verdict": <"safe" | "caution" | "danger">,
  "summary": <one paragraph plain English summary of findings>,
  "redFlags": [
    {
      "id": <unique short string>,
      "label": <short label, e.g. "Rapid emotional escalation">,
      "description": <one or two sentences of plain English explaining what was detected and why it is a red flag>,
      "severity": <"low" | "medium" | "high">,
      "position": <decimal 0.0 to 1.0 indicating roughly where in the conversation this flag appears, e.g. 0.1 for very early, 0.5 for middle, 0.9 for near end>
    }
  ]
}

Verdict rules:
- "safe": trustScore 70-100 — few or no red flags found
- "caution": trustScore 40-69 — some warning signs present
- "danger": trustScore 0-39 — significant red flags, high risk of scam

If NO red flags are found, return an empty redFlags array and trustScore of 80-100.
Do not invent red flags that are not present. Be objective and evidence-based.
Return ONLY valid JSON.`;

analyseRouter.post("/analyse", async (req, res) => {
  const parsed = AnalyseConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request: conversation text is required" });
    return;
  }

  const { conversation } = parsed.data;

  if (conversation.trim().length < 20) {
    res.status(400).json({ error: "Conversation is too short to analyse" });
    return;
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please analyse this conversation for romance scam patterns:\n\n${conversation}`,
        },
      ],
    });

    const block = message.content[0];
    if (!block || block.type !== "text") {
      res.status(500).json({ error: "Unexpected response from AI" });
      return;
    }

    let result;
    try {
      const text = block.text.trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found");
      result = JSON.parse(jsonMatch[0]);
    } catch {
      req.log.error({ text: block.text }, "Failed to parse AI JSON response");
      res.status(500).json({ error: "Failed to parse AI analysis" });
      return;
    }

    if (
      typeof result.trustScore !== "number" ||
      !["safe", "caution", "danger"].includes(result.verdict) ||
      typeof result.summary !== "string" ||
      !Array.isArray(result.redFlags)
    ) {
      res.status(500).json({ error: "Invalid analysis structure from AI" });
      return;
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error calling Anthropic API");
    res.status(500).json({ error: "Analysis failed. Please try again." });
  }
});

export default analyseRouter;
