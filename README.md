# Portfolio Website

Personal portfolio and personal site of Tiago Coutinho, AI Engineer.

Live at **https://tiago-coutinho.com**

It is a single-page-application built with Vite and React: a long scrolling home page
that summarises the profile, plus dedicated pages for work experience, education,
projects and hardware setup. On top of the plain content it carries three interactive
extras: an AI chat assistant that answers questions about Tiago, a simulated terminal
("Dev Mode") that exposes the same CV data as a filesystem, and webcam-based hands-free
scrolling.

## Tech stack

| Concern | Choice |
| --- | --- |
| Build tool | Vite 5 (`@vitejs/plugin-react-swc`) |
| Framework | React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3 (+ `@tailwindcss/typography`, `tailwindcss-animate`) |
| UI components | shadcn/ui on Radix UI primitives, `lucide-react` / `react-icons` icons |
| Routing | React Router 6 (`react-router-dom`) |
| Data fetching | TanStack Query 5 (provider is mounted app-wide; current data is static/local) |
| Forms | `react-hook-form` + `zod` (shadcn form primitives) |
| Computer vision | `@mediapipe/tasks-vision` (hand landmark detection) |
| Anti-spam | Cloudflare Turnstile via `@marsidev/react-turnstile` |
| Tests | Vitest + Testing Library + jsdom |

All CV, project and setup content is hard-coded as typed arrays inside the page and
component files — there is no CMS and no backend for the site content.

## Site index

Every route registered in `src/App.tsx`:

| Tab / label | Path | Component | What it is |
| --- | --- | --- | --- |
| Home | `/` | `src/pages/Index.tsx` | The main page. Composes all the home sections listed below, plus the animated starfield background and the Dev Mode terminal. |
| Work | `/experience` | `src/pages/Experience.tsx` | "Professional Experience". Full detail for each role (Unit4, Glintt Global, Nonius, Padrão Ortopédico) with company logo, dates, location, responsibility bullets, technology tags and an optional link to the company site. Entries are anchor-addressable, e.g. `/experience#glintt`. |
| Education | `/education` | `src/pages/Education.tsx` | Academic background: MSc in Biomedical Engineering and BSc in Bioengineering (Universidade Católica Portuguesa), with dates and a short description each. Anchors such as `/education#masters` work. |
| Projects | `/projects` | `src/pages/Projects.tsx` | Expanded cards for the personal projects (Firebreak, The GitHub Discipline, IMLens, Speed Champion): summary, long description, a "how it was built" write-up, feature list, technology tags, live/GitHub links, status badge and a lightbox screenshot gallery. |
| Setup | `/setup` | `src/pages/Setup.tsx` | "My Setup" — a grid of the hardware used day to day (laptop, ultrawide monitor, keyboard, mouse, dock, webcam, headset, Raspberry Pi 5 home server, mini PC), each with a product photo, category badge, specs and a link to the product page. |
| — | `*` | `src/pages/NotFound.tsx` | Catch-all 404 page with a link back home. Logs the attempted path to the console. |

### Home page sections

The navigation bar shows eight tabs. On the home page they scroll to in-page sections;
on any other page the same labels become links back to `/` (or to the dedicated route).
Order as a visitor sees it, left to right:

| Tab | Target | Contents |
| --- | --- | --- |
| Home | `#hero` | Hero: name typed out character by character, current role, "Download Resume" button (`public/Tiago_Coutinho_CV.pdf`), "Enter Dev Mode" button and a profile photo. |
| About | `#about` | Three-paragraph self-description focused on production AI systems and the biomedical engineering background. |
| Work | `#journey` | "Professional Journey" — an alternating vertical timeline of the four roles. Each card links through to its anchor on `/experience`. |
| Education | `#education` | Same timeline treatment for the two degrees; cards link to `/education`. |
| Skills | `#skills` | "Skills" — three auto-scrolling marquee rows of technology icons (languages/frameworks, AI/ML, infrastructure/data stores). Hovering pauses the rows and highlights one item. |
| Projects | `#projects` | Short teaser section with a single card linking to `/projects`. |
| Setup | `#setup` | Short teaser section with a single card linking to `/setup`. |
| Contact | `#contact` | "Send a Transmission" — GitHub and LinkedIn links plus a name/email/message form submitted to Formspree, gated by a Cloudflare Turnstile widget (submit stays disabled until the token is solved). |

The desktop nav is a floating pill that only fades in after ~100px of scroll; on mobile
the same items live behind a hamburger that opens a full-screen overlay menu
(`src/components/Navigation.tsx`). Sub-pages also show a "Back" button in the top-left
until you scroll past 100px.

## Interactive features

### AI chat assistant

`src/components/ChatWidget.tsx` + `src/hooks/useChat.ts`

A floating chat button on every page (it is mounted in `App.tsx`, outside the router).
Opens a panel where visitors can ask questions about Tiago. Messages are POSTed to
`https://backend.tiago-coutinho.com/chat` and the reply is read from the response body
as a stream, so the answer types itself out token by token. The hook handles streaming
state, removes the empty assistant bubble on failure, and surfaces specific messages for
422 and 429 (rate-limited) responses. After 45 seconds idle the widget shows a one-off
"need some help?" nudge, throttled to once every 10 minutes via `localStorage`.

The hook also carries a `provider` field (`'openai' | 'local'`) sent with each request;
it currently stays at its `'openai'` default because the widget does not expose a
provider switch.

### Dev Mode terminal

`src/components/DevModeTerminal.tsx` + `src/hooks/useTerminal.ts` + `src/data/terminalFileSystem.ts`

A full-screen fake shell, opened from the "Enter Dev Mode" button in the hero. It boots
with an ASCII logo and a progress sequence, then drops you at a
`tiago@portfolio:~$` prompt over a simulated filesystem (`~/about`, `~/work`,
`~/education`, `~/skills`, `~/projects`) whose files are the same CV data the site
renders — `.md` for the bio, pretty-printed `.json` per role, degree and project.

Supported commands: `ls`, `cd`, `pwd`, `cat`, `clear`, `help`, `exit`, `open`, `github`,
`linkedin`, `htop`, `reboot`, plus a joke response for `rm`. Tab completion and up/down
history navigation are implemented, and ESC exits. `open <project>` and the social
commands open real URLs in a new tab. `cat` on a `*.skill` file returns a "permission
denied" gag; `htop` renders a fake process table; `reboot` plays a canvas particle
implode/explode animation (`src/components/RebootAnimation.tsx`).

### Hands-free scrolling

`src/components/HandsFreeButton.tsx` + `src/hooks/useHandGesture.ts`

A floating hand button (also mounted app-wide) that asks for camera permission and then
scrolls the page with finger gestures. It loads MediaPipe's `HandLandmarker` model
(WASM runtime from jsDelivr, model weights from Google's model storage, GPU delegate)
and inspects the 21 landmarks of one hand per frame: index finger extended upward with
the other fingers closed scrolls up, index pointing down scrolls down, anything else is
neutral. The button icon turns green and shows an arrow while a gesture is recognised.
First use (and again after an hour, tracked in `localStorage`) shows an onboarding
overlay with a gesture diagram. The camera stream is stopped on toggle-off and on unmount.

Note this pulls the model and WASM runtime from the network at activation time, so it
needs internet access even when the site itself is served locally.

### Cloudflare Turnstile

Used only in the contact form (`src/components/Contact.tsx`). The site key is inlined in
the component and the solved token is appended to the Formspree payload as
`cf-turnstile-response`.

## Project structure

```
src/
  App.tsx                 Providers (TanStack Query, tooltips, toasters), router, app-wide widgets
  main.tsx                React entry point
  index.css / App.css     Tailwind layers, design tokens, custom animations
  pages/                  One component per route (Index, Experience, Education, Projects, Setup, NotFound)
  components/
    Navigation.tsx        Desktop pill nav + mobile overlay menu
    Hero.tsx AboutMe.tsx Timeline.tsx Education.tsx TechStack.tsx
    ProjectsPreview.tsx SetupPreview.tsx Contact.tsx Footer.tsx
                          Home page sections, in render order
    ProjectCard.tsx ProjectGallery.tsx   Project detail card and screenshot lightbox
    ChatWidget.tsx        AI chat panel
    DevModeTerminal.tsx RebootAnimation.tsx   Simulated terminal and its reboot effect
    HandsFreeButton.tsx HandsFreeOnboarding.tsx   Gesture scrolling UI
    ParticlesBackground.tsx   Canvas starfield behind every page
    BackButton.tsx NavLink.tsx Constellation.tsx
    ui/                   shadcn/ui primitives (generated; see components.json)
  hooks/
    useChat.ts            Chat state + streaming fetch to the backend
    useTerminal.ts        Command parsing, filesystem navigation, history, autocomplete
    useHandGesture.ts     MediaPipe hand landmark detection and scroll loop
    useScrollToTop.ts     Scroll to top (or to the URL hash) on navigation
    use-mobile.tsx use-toast.ts   shadcn helpers
  data/
    terminalFileSystem.ts The simulated filesystem tree for Dev Mode
  lib/utils.ts            `cn` class-name helper
  assets/                 Profile photo, project screenshots, logos/ (companies, university), setup/ (hardware photos)
  test/                   Vitest setup and tests
public/                   favicons, og-image, robots.txt, Tiago_Coutinho_CV.pdf
about-me.md               Knowledge base for the chat assistant (see below)
```

### `about-me.md`

The file at the repo root is the system prompt and knowledge base for the AI chat
assistant: the persona, its hard restrictions, and the factual information it is allowed
to answer from. **It is not imported by any frontend code** — nothing in `src/` reads it.
It lives here as the canonical source so it can be version-controlled next to the site,
but the running chat backend holds its own copy. Editing it here does not change the
assistant's answers until the backend is updated too.

## Getting started

Prerequisites: Node.js 20+ and npm 10+.

A `bun.lockb` is checked in from the project's scaffold, but the project is built with
npm in practice — use `package-lock.json`.

```sh
npm install
npm run dev
```

The dev server listens on **port 8080** (configured in `vite.config.ts`), so the site is
at `http://localhost:8080`.

Other scripts:

```sh
npm run build        # production build into dist/
npm run build:dev    # build with mode=development (unminified, dev-mode plugins)
npm run preview      # serve the built dist/ locally
npm run lint         # ESLint over the repo
npm test             # vitest run (single pass)
npm run test:watch   # vitest in watch mode
```

### Tests

The test setup is minimal and honest about it: Vitest configured with the jsdom
environment and `@testing-library/jest-dom` matchers (`vitest.config.ts`,
`src/test/setup.ts`), and a single placeholder test in `src/test/example.test.ts`. There
is no meaningful component or unit coverage yet — the harness exists so tests can be
added without setup work.

## Deployment

The site is self-hosted on a Raspberry Pi behind nginx. nginx serves the built static
files from the `dist/` directory directly, so there is no Node process running in
production and no CI/CD pipeline. A deploy is just:

```sh
git pull
npm run build
```

nginx picks up the new files immediately; no service restart is needed for a frontend
release. `dist/` is gitignored, so it is always built on the host.

The AI chat backend is a **separate service**: a Dockerised FastAPI app served by
uvicorn, reachable at `https://backend.tiago-coutinho.com` and hard-coded as the chat
endpoint in `src/hooks/useChat.ts`. It is deployed and versioned independently of this
repository and keeps its own copy of the `about-me.md` knowledge base, so a frontend
deploy never updates the assistant. The contact form posts to Formspree and Turnstile is
validated by Cloudflare, so neither needs anything running on the Pi either.
