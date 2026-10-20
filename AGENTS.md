<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Keep TanStack Start routing and use lightweight semantic React markup with shared CSS; the runtime is fixed but the presentation should translate cleanly to Gutenberg.
- Store demonstration editorial content in a browser-safe structured module and render it with shared archive and detail templates; this mirrors future WordPress content types and fields.
- Keep contact submission client-side with an explicit unsent state until a delivery service is requested; never claim a message was delivered.
- Read news and events from WordPress only through the server-side source module behind the WORDPRESS_URL variable; when that site is unreachable or empty, fall back to the demonstration module and keep the "indicative" disclaimers, so fallback content is never presented as published WordPress content.
