<div align="center">

  <img src="public/favicon.svg" alt="Mockify Logo" width="80" height="80" />

  # Mockify

  **Generate stunning AI mockups and images instantly — powered by fal.ai and Together AI.**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://mockify.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Mockify is a free, open-source AI image generator built for designers, developers, and marketers. It uses a Next.js API route to call [fal.ai](https://fal.ai) and [Together AI](https://together.ai) — giving you access to Flux Schnell, Flux Pro, Imagen 4, and Ideogram 3.0 in a single clean interface. All generated images and settings are stored in localStorage — no auth, no database required.

---

## ✨ Features

- 🚀 **Multiple AI Models** — Flux Schnell, Flux Pro, Imagen 4, Ideogram 3.0, Together Flux (free fallback)
- 🎨 **Prompt Enhancement** — Automatically enriches prompts with composition and quality keywords
- 📐 **Aspect Ratio Selector** — Square (1:1), Landscape (16:9), Portrait (9:16)
- ⚙️ **Quality Control** — Per-model quality settings (Standard / HD)
- 🕓 **Session History** — Browse, search, re-load, and delete previously generated images
- 🔍 **Fullscreen Lightbox** — View generated images fullscreen with zoom in/out support
- 💾 **Download** — Save any generated image locally as PNG
- 📋 **Copy Prompt** — One-click copy of the prompt used for any image
- ⚡ **Example Prompts** — Quick-start chips for common product and mockup use cases
- 💾 **Persistent Settings** — Model, quality, and size preferences saved to localStorage

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| AI Inference | fal.ai + Together AI (server-side API route) |
| Icons | Lucide React |
| Package Manager | pnpm |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- [fal.ai](https://fal.ai/dashboard/keys) API key
- [Together AI](https://api.together.xyz/settings/api-keys) API key (optional fallback)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MuhammadTanveerAbbas/mockify.git
cd mockify

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env.local
# Add your FAL_KEY and TOGETHER_API_KEY to .env.local

# 4. Start the development server
pnpm dev

# 5. Open in browser
# http://localhost:3000
```

---

## 🔐 Environment Variables

```env
# fal.ai — https://fal.ai/dashboard/keys
FAL_KEY=your_fal_ai_key

# Together AI — https://api.together.xyz/settings/api-keys
TOGETHER_API_KEY=your_together_api_key
```

---

## 📁 Project Structure

```
mockify/
├── public/              # Static assets (favicon)
├── app/
│   ├── api/
│   │   └── generate/          # API route — calls fal.ai / Together AI
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page — state, history, error boundary
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── prompt-form.tsx        # Prompt input, model/quality/size selectors
│   ├── mockup-result.tsx      # Image display, download, copy, fullscreen lightbox
│   ├── prompt-history.tsx     # Session history list with search and delete
│   ├── wave-loader.tsx        # Loading animation
│   └── empty-state.tsx        # Empty state UI
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── fal.ts                 # fal.ai client wrapper
│   ├── together.ts            # Together AI client wrapper
│   ├── generateImage.ts       # Client-side fetch wrapper + model/size/quality config
│   └── utils.ts               # Tailwind class utilities
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## 🌐 Deployment

Deploy on **Vercel** — add `FAL_KEY` and `TOGETHER_API_KEY` as environment variables in your project settings.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/mockify)

---

## 🗺 Roadmap

- [x] Multiple AI model support (fal.ai + Together AI)
- [x] Prompt enhancement engine
- [x] Aspect ratio & quality controls
- [x] Session history with search
- [x] Fullscreen lightbox with zoom
- [x] Persistent settings via localStorage
- [ ] Image-to-image generation
- [ ] Batch generation mode
- [ ] Custom prompt templates

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Built by The MVP Guy

<div align="center">

**Muhammad Tanveer Abbas**
SaaS Developer | Building production-ready MVPs in 14–21 days

[![Portfolio](https://img.shields.io/badge/Portfolio-themvpguy.vercel.app-black?style=for-the-badge)](https://themvpguy.vercel.app)
[![Twitter](https://img.shields.io/badge/Twitter-@m_tanveerabbas-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/m_tanveerabbas)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammadtanveerabbas)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas)

*If this project helped you, please consider giving it a ⭐*

</div>
