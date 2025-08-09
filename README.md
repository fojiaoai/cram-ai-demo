# CramAI Monorepo (Frontend + Backend)

CramAI is an AI-powered content analysis platform. It supports multi-source input (video links, web URLs, file uploads) and provides a unified analysis interface with bilingual (中文/English) and light/dark theme support.

This repository contains both:
- Frontend: Vite + React + TypeScript + Tailwind + shadcn/ui
- Backend: Node.js + Express (optional in current demo; frontend is self-contained for demo data)


## Highlights

- Unified, consistent navigation across all pages
- Global language switch (中文/EN) and theme switch (Light/Dark)
- Landing page with Pricing Plans and Product Highlights
- Dashboard with file upload and URL/link analysis
- Unified Deep Research flow with editable AI plan modal ("由多变少" distillation)
- Direct auto-start analysis (skip upload UI) via query/state
- Analysis interface with: Summary, Mindmap (Markdown + SVG demo), Transcript, Chat, and more
- Exam interface with right-side practice dashboard and fullscreen question area
- Remote demo video (Bilibili) and local demo asset with robust fallback


## Tech Stack

- Frontend
  - React 18, TypeScript, Vite
  - react-router-dom (routing)
  - react-i18next (i18n)
  - Tailwind CSS, shadcn/ui
  - lucide-react (icons)
  - next-themes style provider via `ThemeProvider` (attribute="class")

- Backend
  - Node.js, Express
  - Multer (uploads), JSDOM (web extraction)
  - OpenAI API (optional/integratable)
  - MongoDB (optional), Axios


## Repository Layout

```text
cram-ai/
  backend/                           # Express backend (optional for current demo)
    .env.example
    config/
      database.js
    middleware/
      auth.js
    models/
      Content.js
      User.js
    routes/
      auth.js
      content.js
      upload.js
    services/
      contentProcessor.js
      s3Service.js
    package.json
    package-lock.json
    server.js

  cram-ai/                           # Frontend application (Vite React TS)
    components.json
    deploy/                          # Built static assets (for static hosting)
      index.html
      assets/
      avatars/
      placeholder.svg
    index.html                       # Vite entry html (dev/build)
    package.json
    package-lock.json
    postcss.config.js
    public/
      avatars/
      placeholder.svg
      videos/
        teacher-exam-demo.mp4        # Local demo video asset
    src/
      App.tsx                        # Routes and ThemeProvider wrapper
      globals.css
      layout.tsx
      main.tsx

      components/
        navigation-bar.tsx           # Shared top navigation (brand, search, i18n, theme)
        language-switcher.tsx        # Locale toggle (中 / EN)
        theme-provider.tsx           # Theme provider (attribute="class")
        upload-demo.tsx              # Unified upload/link + deep plan modal + navigation
        ai-analysis.tsx
        video-parser.tsx
        web-parser.tsx
        dashboard/
          animations.css
          content-item.tsx
          dashboard-skeleton.tsx
          quick-action-card.tsx
          stats-card.tsx
        exam/
          exam-header.tsx
          exam-window.tsx
          data-dashboard.tsx
          question-display.tsx
        question-bank/
          categories-tab.tsx
          personal-stats.tsx
          quick-actions.tsx
        ui/                          # shadcn/ui primitives
          accordion.tsx
          alert-dialog.tsx
          alert.tsx
          aspect-ratio.tsx
          avatar.tsx
          badge.tsx
          breadcrumb.tsx
          button.tsx
          calendar.tsx
          card.tsx
          carousel.tsx
          chart.tsx
          checkbox.tsx
          collapsible.tsx
          command.tsx
          context-menu.tsx
          dialog.tsx
          drawer.tsx
          dropdown-menu.tsx
          error-boundary.tsx
          form.tsx
          hover-card.tsx
          input-otp.tsx
          input.tsx
          label.tsx
          loading-spinner.tsx
          menubar.tsx
          navigation-menu.tsx
          offline-indicator.tsx
          pagination.tsx
          popover.tsx
          progress.tsx
          radio-group.tsx
          resizable.tsx
          scroll-area.tsx
          select.tsx
          separator.tsx
          sheet.tsx
          sidebar.tsx
          skeleton.tsx
          slider.tsx
          sonner.tsx
          switch.tsx
          table.tsx
          tabs.tsx
          textarea.tsx
          toast.tsx
          toaster.tsx
          toggle-group.tsx
          toggle.tsx
          tooltip.tsx
          use-mobile.tsx
          use-toast.ts

      hooks/
        use-mobile.tsx
        use-online-status.tsx
        use-toast.ts

      i18n/
        index.ts
        locales/
          en.json                    # English strings
          zh.json                    # 中文文案

      lib/
        utils.ts

      pages/
        landing-page.tsx             # Home (brand i18n, theme switch, highlights, pricing, upload)
        dashboard.tsx                # Legacy dashboard (kept)
        dashboard-optimized.tsx      # Primary dashboard (NavigationBar + UploadDemo flow)
        exam-interface.tsx           # Exam UI with right-side panel + fullscreen
        my-courses.tsx               # Placeholder page with NavigationBar
        explore.tsx                  # Placeholder page with NavigationBar
        creators.tsx                 # Creators page with NavigationBar
        community.tsx                # Community page (routing placeholder)
        auth-page.tsx                # Login/Signup (fully localized)
        analysis-results.tsx         # Analysis results page (Back to Home)
        ai-analysis-interface.tsx    # Legacy analysis page (kept)
        unified-analysis-interface.tsx # Unified analysis interface (main)

    tailwind.config.ts
    tsconfig.json
    tsconfig.app.json
    tsconfig.node.json
    vite.config.ts

  vite.config.ts                      # Root vite config (legacy/unused for app)
```


## Frontend App

### Key Pages and Routes

- `/` → `landing-page.tsx`
  - Brand i18n: 中文显示「佛脚AI」，英文显示「CramAI」
  - Language toggle button text: 中文环境显示「中」，英文显示「EN」
  - Light/Dark theme toggle
  - Upload area (uses `UploadDemo`) and marketing sections (Pricing, Highlights)

- `/dashboard` → `dashboard-optimized.tsx`
  - Uses `NavigationBar`
  - Quick actions and `UploadDemo` with unified deep-research flow

- `/unified-analysis` → `unified-analysis-interface.tsx`
  - Auto-start analysis flow; supports `autostart=1`, `type=url|video`, `q=<url>`
  - Tabs: Main(Summary+Key Points), Transcript, Mindmap(Markdown+SVG), Flashcards, Notes, Resources, Discussion
  - Video area: local demo `/videos/teacher-exam-demo.mp4` with fallback to remote demo (Bilibili)

- `/exam-interface` → `exam-interface.tsx`
  - Left setup, middle question display (supports fullscreen), right sticky `DataDashboard`

- `/my-courses`, `/explore`, `/creators`, `/community` → Navigation-ready placeholders

- `/auth` → `auth-page.tsx` (Login/Signup, localized)

- `/analysis-results` → `analysis-results.tsx` (demo results; Back to Home)

All pages share the `NavigationBar` (brand link routes to home; unified i18n & theme controls).


### Internationalization (i18n)

- Library: `react-i18next`
- Files: `src/i18n/locales/en.json`, `src/i18n/locales/zh.json`
- Usage: `const { t, i18n } = useTranslation()` and `t('key')`
- Brand and button text adapt to language:
  - Brand: 中文「佛脚AI」, 英文「CramAI」
  - Language toggle: 中文环境显示「中」, 英文环境显示「EN」


### Theming (Light/Dark)

- Provider: `ThemeProvider` with `attribute="class"` in `App.tsx`
- Toggle surfaces in `NavigationBar` and `landing-page.tsx`
- Tailwind dark classes are applied across components (upload inputs, cards, modals, etc.)


### Unified Upload + Deep Research Flow

- Component: `src/components/upload-demo.tsx`
- Features:
  - Drag-and-drop files (simulated progress)
  - Add URL to list with simulated progress
  - On completion, show "AI 深度分析方案 / Deep Research Plan" modal
  - User can edit the plan text (focus on "由多变少" distillation)
  - Start analysis navigates to `/unified-analysis` with `autostart` and passes `plan` in navigation state


### Analysis Auto-Start and Params

Navigation to `/unified-analysis` supports skipping the upload UI when:
- `?autostart=1&type=url|video&q=<url>` is present; or
- Navigation `state` carries `{ autostart: true, type, q }`

The analysis view then seeds demo content (summary, key points, transcript items, chat) matching the teacher exam prep theme.


### Demo Video Sources

- Local demo: `public/videos/teacher-exam-demo.mp4`
- Remote demo (fallback): Bilibili
  - `https://www.bilibili.com/video/BV1iL4y1e7VX/?share_source=copy_web`
  - Logic: if `videoSrc` is a direct media URL (mp4/webm/mov/m4v) use `<video>`, otherwise use `<iframe>` (for platforms like Bilibili)


## Backend API (Optional for Demo)

The frontend demo does not require the backend to run. The backend is provided for future integration.

### Endpoints (planned)
- `GET /api/health` – health check
- `POST /api/analyze/file` – file upload and analysis
- `POST /api/analyze/video-link` – analyze a video by URL (YouTube/Bilibili)
- `POST /api/analyze/web-url` – analyze a web page

Configure `.env` in `cram-ai/backend/` using `.env.example` as a template.


## Setup & Development

Prerequisites:
- Node.js 18+
- npm 9+

### Frontend

```bash
cd cram-ai/cram-ai
npm install
npm run dev  # http://localhost:5173
```

Build:
```bash
npm run build
npm run preview
```

### Backend (optional)

```bash
cd cram-ai/backend
cp .env.example .env   # fill in OPENAI_API_KEY, etc.
npm install
npm run dev            # http://localhost:5000
```


## Common Tasks

- Change language: use the top-right language switcher (中 / EN)
- Change theme: use the top-right theme toggle (Light/Dark)
- Start analysis directly from dashboard or landing:
  1) Add a file or a link
  2) Wait for progress = 100%
  3) Edit the AI plan in the popup
  4) Click Start → navigates to `/unified-analysis` and auto-runs demo analysis


## Notes

- Some third-party platforms restrict embedding; when using `iframe` for remote videos (e.g., Bilibili), browser policies may vary.
- The current app demonstrates front-end flows without backend processing; swap the demo data with real API calls when backend is ready.


## License

Proprietary – All rights reserved.