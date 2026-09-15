type VercelCreditsResponse = {
  balance?: unknown;
  total_used?: unknown;
};

defineProvider({
  id: "vercel-ai-gateway",
  name: "Vercel AI Gateway",
  icon: { monogram: "▲" },
  topLevel: true,
  endpoints: ["https://ai-gateway.vercel.sh"],
  auth: { type: "bearer", secret: "AI_GATEWAY_API_KEY" },
  settings: [
    {
      key: "AI_GATEWAY_API_KEY",
      title: "AI Gateway API key",
      subtitle: "Vercel AI Gateway key used to read the team's credit balance.",
      type: "secure",
    },
  ],
  capabilities: ["http-status"],

  async fetchUsage(ctx) {
    const response = await ctx.http.getJSON<VercelCreditsResponse>(
      "https://ai-gateway.vercel.sh/v1/credits",
    );

    if (response.status === 401) {
      throw ctx.fail.authenticationExpired("Vercel AI Gateway rejected the API key.");
    }
    if (response.status === 403) {
      throw ctx.fail.permissionDenied("The API key cannot read Vercel AI Gateway credits.");
    }
    if (response.status === 429) {
      throw ctx.fail.rateLimited("Vercel AI Gateway rate limit exceeded.");
    }
    if (response.status >= 500) {
      throw ctx.fail.providerUnavailable(`Vercel AI Gateway returned HTTP ${response.status}.`);
    }
    if (response.status !== 200) {
      throw ctx.fail.apiFailure(`Vercel AI Gateway returned HTTP ${response.status}.`);
    }

    const payload = response.json;
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw ctx.fail.parseFailure("Vercel AI Gateway credits response must be an object.");
    }

    function amount(value: unknown, field: string): number {
      const parsed =
        typeof value === "number"
          ? value
          : typeof value === "string" && value.trim() !== ""
            ? Number(value)
            : Number.NaN;
      if (!Number.isFinite(parsed) || parsed < 0) {
        throw ctx.fail.parseFailure(`Vercel AI Gateway ${field} must be a nonnegative amount.`);
      }
      return parsed;
    }

    const balance = amount(payload.balance, "balance");
    const totalUsed = amount(payload.total_used, "total_used");

    return {
      cost: {
        used: totalUsed,
        balance,
        currency: "USD",
        period: "Lifetime",
      },
      identity: { loginMethod: "AI Gateway API key" },
      dataConfidence: "exact",
      details: [
        {
          title: "Credits",
          rows: [
            { label: "Remaining", value: ctx.format.usd(balance) },
            { label: "Lifetime spend", value: ctx.format.usd(totalUsed) },
          ],
        },
      ],
    };
  },
});
