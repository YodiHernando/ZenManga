<div align="center">

# ⛩️ ZenManga
**Your minimalist, futuristic gateway to the world of manga.**

![ZenManga Tech Stack](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FramerMotion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Jikan API](https://img.shields.io/badge/Jikan_API-2e51a2?style=for-the-badge&logo=myanimelist&logoColor=white)

</div>

## 📌 Overview
**ZenManga** is a blazingly fast, aesthetically pleasing Single Page Application (SPA) designed to help you discover, read about, and track your favorite Manga, Manhwa, and Light Novels. Built with performance and premium UI/UX in mind, ZenManga delivers a seamless "Dashboard" feel with zero latency, entirely powered by the [Jikan API](https://jikan.moe/).

---

## ✨ Key Features
- 🌌 **Glassmorphism Aesthetic:** A deep dark mode accompanied by smooth, glowing glass visual effects.
- 📚 **My Reading Vault:** A built-in personal tracker for your manga. Update reading chapters incrementally, change statuses dynamically (Reading, Completed, On Hold), and watch the pulse UI react synchronously. 
- 🚀 **Infinite Scroll Engine:** Browse through tens of thousands of manga seamlessly with infinite scrolling handled aggressively by React Query and Intersection Observers to prevent memory leaks.
- ⚡ **Zero-Lag Filter Dashboard:** Instantly filter directories by Genre, Status, or Type using an interactive command center approach, devoid of chaotic CSS layout shifts.
- 🎭 **Page Transitions:** Enjoy silky smooth routing and micro-interactions powered by Framer Motion.

---

## 🛠️ Tech Stack
* **Framework:** [React 18](https://react.dev/) inside [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Data Fetching & Caching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
* **Data Source:** [Jikan REST API v4](https://docs.api.jikan.moe/)

---

## 🚀 Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
Make sure you have Node.js installed (v16.0 or higher recommended).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YodiHernando/ZenManga.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ZenManga
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5173`.

---

## 🌍 Deployment
ZenManga is fully optimized to be deployed on serverless platforms such as **Vercel** or **Netlify**.
The repository includes a `vercel.json` file designed specifically to handle React Router fallbacks natively, ensuring that deep direct links will not result in 404 errors in production.

To deploy on Vercel:
1. Connect your GitHub repository to Vercel.
2. Vercel will automatically detect `Vite` as the framework.
3. Click **Deploy**. No additional environment variables are required!

---

## 🤝 Acknowledgements
- Data provided exclusively by the [Jikan API](https://jikan.moe/), an unofficial MyAnimeList API.
- Conceptualized with a focus on delivering high-end UI design aesthetics.

<div align="center">
  <br>
  <i>Crafted with passion for manga readers worldwide.</i>
</div>
