
# ───────────────────────────────────────────────────────────────

# PROJECT ISOLATION — ENFORCED FROM FIRST MESSAGE
Before ANY migration, deploy, file write, or server action:
1. Read THIS project's .env file
2. Confirm the DATABASE_URL and server match this project
3. Never use credentials from memory of another projects or from global setting or previous or another projects
If no .env exists — STOP and ask me for credentials.

════════════════════════════════════════════════════
# LAYER 1 — PROJECT IDENTITY
════════════════════════════════════════════════════

## commands
dev:       npm run dev              # localhost:3000
build:     npm run build
test:      npm test -- --coverage
typecheck: npx tsc --noEmit
lint:      npx eslint . --max-warnings 0
deploy:    MANUAL ONLY — never auto-deploy without my confirmation

## folder structure (fill in when project starts)


## current phase
[update this every session — what are we building right now]

## do not touch
[list frozen files or folders here after project matures]

════════════════════════════════════════════════════
# LAYER 2 — SKILLS (fire automatically — no action needed)
════════════════════════════════════════════════════

## frontend-design — fires on ANY UI task
Before writing a single line of CSS or JSX:
1. State the visual direction: font pair, color strategy, spacing
2. No Inter font. No purple gradient. No generic card-on-gray.
3. Get my approval on direction first — then code

UI checklist before every component is done:
- [ ] Font is intentional and named
- [ ] Colors are from a defined system — not random
- [ ] Mobile layout designed first
- [ ] WCAG AA contrast on all text
- [ ] Focus states on all interactive elements

## web-design-guidelines — fires on UI audits
100+ accessibility and UX rules. Auto-runs when reviewing UI code.

## vercel-react-best-practices — fires on React/Next.js code
62 performance rules. Catches N+1 renders, barrel imports, waterfall patterns.

## firecrawl — fires on research tasks
Use for: library docs, competitor analysis, API research.
Write results to files — never dump into context.
Requires FIRECRAWL_API_KEY in .env

## webapp-testing — fires when I say "test this"
Opens a real browser, navigates your app, clicks and verifies flows.
Requires the app running locally first.

## document skills (docx/pdf/pptx/xlsx) — fire on document tasks
Create real downloadable files when asked.

## secure-workflow-guide + code-maturity-assessor — fire on security tasks
Trail of Bits security rules. Run before every client handover.

════════════════════════════════════════════════════
# LAYER 3 — SUBAGENTS (use these — never pollute main context)
════════════════════════════════════════════════════

researcher  → haiku  → explore codebase, find patterns, lookup library
planner     → sonnet → write PLAN.md before any feature touching 5+ files
implementer → sonnet → execute plan, one commit per logical change
tester      → haiku  → write tests after feature is built
architect   → opus   → DB schema, auth model, public API — expensive, use sparingly

Order always:
researcher → planner → [my review of PLAN.md] → implementer → tester → quality gates

════════════════════════════════════════════════════
# LAYER 4 — QUALITY GATES (ALL must pass before "done")
════════════════════════════════════════════════════

Run in this order — stop if any fail:
1. npx tsc --noEmit                    → zero type errors
2. npx eslint . --max-warnings 0       → zero lint warnings
3. npm test -- --coverage              → all tests pass

Code review before every PR:
- [ ] no console.log / var_dump in production code
- [ ] no hardcoded secrets — env vars only
- [ ] no `any` type — proper types or unknown + guard
- [ ] no DB calls inside components — use /lib/db/
- [ ] no N+1 queries — no DB calls inside loops
- [ ] all async has try/catch
- [ ] server actions return { data, error } — never throw
- [ ] all images have width + height attributes
- [ ] input validation on all API routes
- [ ] .env and .mcp.json are in .gitignore

Performance (UI changes only):
- [ ] LCP under 2.5s — check Lighthouse
- [ ] images in WebP format
- [ ] nothing render-blocking above the fold

Security (auth/data changes only):
- [ ] all protected routes check session first
- [ ] no user input interpolated into SQL
- [ ] no secrets in client-side code

════════════════════════════════════════════════════
# LAYER 5 — HOOKS (system-level — cannot be bypassed)
════════════════════════════════════════════════════

These are enforced by ~/.claude/hooks/PreToolUse.sh:
- Migrations blocked unless THIS project's .env has DATABASE_URL
- Deploy commands blocked — manual confirmation required
- .env writes outside this project folder blocked
- rm -rf blocked globally
- DROP TABLE / DROP DATABASE blocked globally

════════════════════════════════════════════════════
# GSD WORKFLOW
════════════════════════════════════════════════════

First session:    npx @opengsd/get-shit-done-redux@latest → /gsd-new-project
Return session:   /gsd-map-codebase → /gsd-resume-work
New feature:      /gsd-plan-phase → review → /gsd-execute-phase
UI work:          /gsd-ui-phase  (triggers frontend-design skill)
Code review:      /gsd-code-review after every major feature
Deploy:           /gsd-ship after project is complete

════════════════════════════════════════════════════
# BEHAVIOR RULES (Karpathy — always apply)
════════════════════════════════════════════════════

1. Think before coding
   Ask ONE question if unclear. Never assume and charge ahead.
   Present options when multiple approaches exist — let me choose.

2. Simplicity first
   Minimum code that solves the problem.
   If 200 lines could be 50 — rewrite it.

3. Surgical changes only
   Touch only files related to the task.
   Never refactor adjacent code unless asked.

4. Verify before done
   Run all quality gates. Never say done without verifying it works.

5. Session end — always do this before closing
   - Run all quality gates
   - Commit with clear message
   - Update "current phase" in this file
   - Write one paragraph: what changed and why
