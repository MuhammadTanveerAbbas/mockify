<div align="center">

  <img src="public/favicon.svg" alt="Mockify Logo" width="80" height="80" />

  # Mockify

  **Generate AI mockups and images in your browser, powered by Puter.js.**

  [![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://mockify-muhammadtanveerabbas.vercel.app)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Mockify is a free, open-source AI image generator for designers, developers, and marketers. It runs entirely in the browser using [Puter.js](https://developer.puter.com), no backend API keys, auth, or database required. Generated images and your model settings are saved in your browser's localStorage.

---

## Features

- **Multiple AI models**, DALL-E 3, Flux 1.1 Pro, Imagen 4 Ultra, Gemini 2.5 Flash, Ideogram 3.0 (via Puter.js)
- **Prompt enhancement**, Adds composition and quality guidance before generation
- **Aspect ratio selector**, Square, landscape, portrait, and widescreen options (model-dependent)
- **Quality control**, Per-model quality settings where supported
- **Generation history**, Browse, search, reload, and delete images saved in localStorage
- **Fullscreen lightbox**, View generated images with zoom
- **Download**, Save any generated image locally
- **Copy prompt**, One-click copy of the prompt used for any image
- **Example prompts**, Quick-start chips for common product and mockup use cases
- **Persistent settings**, Model, quality, and size preferences saved to localStorage

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5.7 |
| Styling | Tailwind CSS v4 |
| AI Inference | Puter.js (client-side) |
| Icons | Lucide React |
| Package Manager | pnpm or npm |

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm or npm

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

No environment variables are required. Puter.js handles AI inference in the browser.

---

## Project Structure

```
mockify/
├── public/              # Static assets (favicon)
├── app/
│   ├── globals.css      # Global styles and design tokens
│   ├── layout.tsx       # Root layout (loads Puter.js)
│   └── page.tsx         # Main page, generation, history, settings
├── components/
│   ├── prompt-form.tsx        # Prompt input, model/quality/size selectors
│   ├── mockup-result.tsx      # Image display, download, copy, fullscreen
│   ├── prompt-history.tsx     # History list with search and delete
│   ├── wave-loader.tsx        # Loading animation
│   └── empty-state.tsx        # Empty state UI
├── lib/
│   ├── generateImage.ts       # Puter.js wrapper + model/size/quality config
│   └── utils.ts               # Tailwind class utilities
├── package.json
├── tsconfig.json
└── README.md
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript compiler |

---

## Deployment

Deploy on **Vercel** or any static Next.js host. No environment variables are needed.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MuhammadTanveerAbbas/mockify)

---

## Roadmap

- [x] Multiple AI model support via Puter.js
- [x] Prompt enhancement
- [x] Aspect ratio and quality controls
- [x] Generation history with search (localStorage)
- [x] Fullscreen lightbox with zoom
- [x] Persistent settings via localStorage
- [ ] Image-to-image generation
- [ ] Batch generation mode
- [ ] Custom prompt templates

---

## Contributing

Contributions are welcome:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Built by The MVP Guy

<div align="center">

**Muhammad Tanveer Abbas**
SaaS Developer | Building production-ready MVPs in 14-21 days

[![Portfolio](https://img.shields.io/badge/Portfolio-themvpguy.vercel.app-black?style=for-the-badge)](https://themvpguy.vercel.app)
[![Twitter](https://img.shields.io/badge/Twitter-@m_tanveerabbas-1DA1F2?style=for-the-badge&logo=twitter)](https://x.com/m_tanveerabbas)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/muhammadtanveerabbas)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github)](https://github.com/MuhammadTanveerAbbas)

</div>
