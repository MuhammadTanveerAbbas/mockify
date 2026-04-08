<div align="center">

  <img src="public/favicon.svg" alt="Mockify Logo" width="80" height="80" />

  # Mockify

  **Generate stunning AI mockups and images instantly  no API keys, no setup, no cost.**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://mockify.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Mockify is a free, browser-based AI image generator built for designers, developers, and marketers who need high-quality mockups and visuals without the friction of API keys or paid subscriptions. It runs entirely client-side via [Puter.js](https://developer.puter.com), giving you access to the world's best image models  DALL·E 3, Flux, Imagen, Gemini, and Ideogram  in a single clean interface. Unlike other tools that lock features behind paywalls, Mockify is fully open-source and costs nothing to use.

---

## ✨ Features

- 🚀 **Multiple AI Models**  Choose from DALL·E 3, Flux 1.1 Pro, Imagen 4 Ultra, Gemini 2.5 Flash, and Ideogram 3.0
- 🎨 **Prompt Enhancement**  Automatically enriches prompts with composition and quality keywords for better results
- 📐 **Aspect Ratio Selector**  Square (1:1), Landscape (16:9), Portrait (9:16), Large Square, and Widescreen
- ⚙️ **Quality Control**  Per-model quality settings (Standard / HD / Low / Medium / High)
- 🕓 **Session History**  Browse, search, re-load, and delete previously generated images within the session
- 🔍 **Fullscreen Lightbox**  View generated images fullscreen with zoom in/out support
- 💾 **Download**  Save any generated image locally as PNG
- 📋 **Copy Prompt**  One-click copy of the prompt used for any image
- ⚡ **Example Prompts**  Quick-start chips for common product and mockup use cases
- 💾 **Persistent Settings**  Model, quality, and size preferences saved to localStorage
- 🔓 **No API Key Required** Powered entirely by Puter.js, zero configuration needed

---

## 🛠 Tech Stack

| Category | Technlogy |
|----------|----------|
| Framework | Next.js 16(App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| AI Inference | Puter.js (`puter.ai.txt2img`) |
| Icons | Lucide React |
| Package Manager | pnpm |

---

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/MuhammadTanveerAbbas/mockify.git
cd mockify

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev

# 4. Open in browser
# http://localhost:3000
```

> No `.env` file or API keys needed. Puter.js handles all AI calls client-side.

---

## 🔐 Environment Variables

This project requires **no environment variables**. All AI inference runs through Puter.js in the browser  no backend, no secrets.

---

## 📁 Project Structure

```
mockify/
├── public/              # Static assets (favicon, screenshots, demo GIF)
├── app/
│   ├── api/
│   │   └── generate-mockup/   # API route (reserved)
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout, loads Puter.js script
│   └── page.tsx               # Main page  state, history, error boundary
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── prompt-form.tsx        # Prompt input, model/quality/size selectors, example chips
│   ├── mockup-result.tsx      # Image display, download, copy, fullscreen lightbox
│   ├── prompt-history.tsx     # Session history list with search and delete
│   ├── history-sidebar.tsx    # Sidebar wrapper for history panel
│   ├── wave-loader.tsx        # Loading animation
│   └── empty-state.tsx        # Empty state UI
├── hooks/
│   ├── use-mobile.ts          # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
├── lib/
│   ├── generateImage.ts       # Puter.js wrapper, prompt enhancer, model/size/quality config
│   └── utils.ts               # Tailwind class utilities
├── .gitignore
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

This project is deployed on **Vercel**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/mockify)

1. Click the button above
2. Connect your GitHub account
3. Deploy  no environment variables needed

---

## 🗺 Roadmap

- [x] Multiple AI model support
- [x] Prompt enhancement engine
- [x] Aspect ratio & quality controls
- [x] Session history with search
- [x] Fullscreen lightbox with zoom
- [x] Persistent settings via localStorage
- [ ] Image-to-image generation
- [ ] Batch generation mode
- [ ] Custom prompt templates

---

## 🤝 Contibuting

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
