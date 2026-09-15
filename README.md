# Vercel AI Gateway for CodexBar

A local [CodexBar](https://github.com/steipete/CodexBar) provider plugin that displays your remaining [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) credits and lifetime spend.

The plugin uses Vercel's documented [`GET /v1/credits`](https://vercel.com/docs/ai-gateway/sdks-and-apis/rest-api#check-credit-balance) endpoint. It does not scrape the Vercel dashboard or read Vercel CLI credentials.

## Requirements

- CodexBar 0.59.0 or newer for first-class provider tabs
- A Vercel AI Gateway API key

Create a key from **Vercel Dashboard > AI Gateway > API Keys**. The key belongs to a Vercel team, and the displayed balance and spend are for that team.

## Install

### CodexBar

1. Download [`vercel-ai-gateway.ts`](https://raw.githubusercontent.com/bkonkle/codexbar-vercel-ai-gateway/main/vercel-ai-gateway.ts).
2. Open **CodexBar > Settings > Plugins**.
3. Click **Install...** and select the downloaded file.
4. Review and approve access to `https://ai-gateway.vercel.sh`.
5. Enter your AI Gateway API key in the plugin settings.
6. Optionally change the credit budget from its `$20` default.

CodexBar stores the key as a secure plugin setting and injects it as a bearer token. The plugin source cannot read or log the key directly.

### Install script

From a cloned copy of this repository:

```sh
./scripts/install.sh
```

The script copies the plugin to `${XDG_CONFIG_HOME:-~/.config}/codexbar/providers/vercel-ai-gateway.ts`. If a different version already exists, it creates a timestamped backup before replacing it.

After installation, open **CodexBar > Settings > Plugins**, click **Refresh**, and approve the plugin.

With **Merge Icons** enabled, the plugin appears as its own provider tab. With Merge Icons disabled, CodexBar displays
it as an appended plugin card.

## What It Shows

- Remaining AI Gateway credit balance in USD
- Remaining-credit progress against a configurable budget, defaulting to $20
- Lifetime AI Gateway spend in USD
- Exact-data confidence, because both values come directly from Vercel

Vercel reports a current balance but not a fixed credit limit. The plugin therefore calculates its progress bar against
the **Credit budget (USD)** setting rather than deriving a limit from lifetime spend. Set this to your usual top-up
amount or another balance target. The displayed dollar balance remains the exact value reported by Vercel.

## Permissions And Privacy

The plugin declares one network origin:

```text
https://ai-gateway.vercel.sh
```

It makes one authenticated request:

```text
GET https://ai-gateway.vercel.sh/v1/credits
```

No analytics, telemetry, cookies, local files, Vercel CLI sessions, or other network services are used. The repository contains no credentials. Never commit your API key or add it to the plugin source.

## Troubleshooting

### Plugin does not appear

Confirm the file is at `~/.config/codexbar/providers/vercel-ai-gateway.ts`, then click **Refresh** in CodexBar's Plugins settings.

### Authentication error

Create or copy a current key from the AI Gateway section of the Vercel dashboard and replace the secure setting in CodexBar. General Vercel personal access tokens are not AI Gateway API keys.

### Incorrect team balance

AI Gateway keys are team-scoped. Use a key created under the team whose balance you want to monitor.

## Development

CodexBar loads `.js` and `.ts` provider files from `~/.config/codexbar/providers`. Edit `vercel-ai-gateway.ts`, run `./scripts/install.sh`, then refresh the Plugins pane.

The plugin API is defined by the `codexbar-plugin.d.ts` declaration bundled with CodexBar.

## License

[MIT](LICENSE)
