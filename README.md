# 🎮 GameBacklog Tracker

![UI Preview Placeholder](https://via.placeholder.com/1200x600/09090b/a855f7?text=GameBacklog+Tracker+-+Modern+Gaming+Hub)

> **Track. Discover. Play.** > Your ultimate, lightning-fast hub for tracking and discovering the best games, wrapped in a modern, "Netflix-like" UI.

## 📖 About the Project

GameBacklog Tracker is a personal full-stack gaming aggregator focused on game discovery and cataloging. Instead of just searching for games, users can build their own personalized libraries, track their progress, create custom lists, and rate their favorite titles. 

The platform utilizes the **IGDB API** for rich game metadata and employs a **BFF (Backend for Frontend)** architecture to ensure a fast, secure, and seamless user experience.

---

## 🛠️ Tech Stack

This project is organized as a monorepo containing both the Client and API layers.

### **Frontend (`/frontend`)**
* **Framework:** React.js (via Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (Dark mode, glassmorphism)
* **State & Data Fetching:** TanStack Query (React Query)
* **Animations:** Framer Motion

### **Backend (`/backend`)**
* **Framework:** Spring Boot (Java / Kotlin)
* **API Client:** Spring WebFlux (for asynchronous IGDB API calls)
* **Caching:** Spring Cache / Redis (minimizes external API quotas)
* **Security:** Spring Security

### **Database & Services**
* **Database:** PostgreSQL (hosted on Supabase)
* **Authentication:** Auth0 (Google, Discord, Email)
* **External Data:** IGDB API (via Twitch OAuth2)

---

## 🏗️ Architecture & Data Flow

The app uses a **Backend for Frontend (BFF)** pattern. The React frontend never communicates directly with the database or IGDB.

1. **Client Request:** React sends a request to the Spring Boot API.
2. **Data Orchestration:** * **User Data** (e.g., adding a game to the backlog) is routed directly to the PostgreSQL database.
   * **Game Metadata** (e.g., searching "Zelda") hits the Spring Boot Cache first. If there's a cache miss, the backend securely fetches a Twitch OAuth token, queries IGDB, normalizes the complex JSON response, caches it, and returns it to the client.

---

## 🗺️ Roadmap & Features

We are building this project in phases, prioritizing core tracking functionality first.

### 🔴 Phase 1: Core MVP (Current)
- [x] **User Auth:** Secure login/registration via Auth0.
- [x] **Database Setup:** PostgreSQL CRUD operations.
- [x] **IGDB Integration:** Robust backend proxy to fetch game metadata.
- [x] **Core Tracker:** Add games to standard lists (Backlog, Playing, Completed, Wishlist).
- [x] **Library View:** Fast, responsive grid-view of the user's saved games.

### 🟡 Phase 2: User Experience (Next Steps)
- [ ] **Custom Lists:** Create personalized collections (e.g., "Couch Co-op").
- [ ] **Game Details:** Immersive full-screen game pages with deep metadata.
- [ ] **Ratings & Notes:** Set personal scores (1-10) and write review notes.
- [ ] **Discovery Feed:** Home page featuring trending and popular releases.
- [ ] **UI Polish:** Glassmorphism hover effects and Skeleton loaders.

### 🟢 Phase 3: Advanced Features
- [ ] **Basic Stats:** Profile dashboard with completion percentages.
- [ ] **Advanced Filters:** Sort library by platform, release year, or genre.
- [ ] **Progress Indicators:** Visual tracking for game completion.

### 🟣 Phase 4: Future Vision
- [ ] **Platform Sync:** Auto-import libraries from Steam, PSN, and Xbox.
- [ ] **Smart Recommendations:** Algorithm suggesting what to play next from your backlog.

---

## 🗄️ Database Schema (High Level)

To optimize performance and save space, we only cache essential game data locally. The rest lives on IGDB.

* `users`: Manages authenticated users (via Auth0 UUID).
* `cached_games`: Stores minimal IGDB data (ID, title, cover URL) to reduce external API hits.
* `user_games`: The pivot table linking users to games, storing status (`PLAYING`, `BACKLOG`), ratings, and notes.
* `custom_lists` & `custom_list_items`: Manages user-created game collections.

---

## 🚀 Getting Started

To run this project locally, you will need Node.js, Java (JDK 17+), and a PostgreSQL database.

### 1. Clone the repository
```bash
git clone [https://github.com/yourusername/gamebacklog-tracker.git](https://github.com/yourusername/gamebacklog-tracker.git)
cd gamebacklog-tracker
