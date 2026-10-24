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
- Read news and events through the shared server-side source module: try published Hygraph content when HYGRAPH_ENDPOINT is configured, then WordPress through WORDPRESS_URL, then labelled demonstration content; read configuration only inside the server-function handler to keep runtime settings server-side.
- Keep the same setting names available locally and hosted (a git-ignored `.env` file documented by `.env.example`, and project secrets in the hosted preview) so the portal can be developed in any editor without code changes.
