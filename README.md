# CineVerse — Movie Explorer

A polished React movie discovery app designed to stand out from a basic API-search assignment.

## Features

- Search movies with live TMDB API integration
- Trending / popular / top-rated / upcoming sections
- Genre chips and year filtering
- Movie detail modal with backdrop, poster, overview, ratings and metadata
- Personal Watchlist using localStorage
- Responsive mobile-first layout
- Loading skeletons and friendly error states
- API-key-free demo fallback data so the UI still works immediately
- Clean component structure and React hooks
- React Router ready
- Modern glassmorphism + cinematic visual design

## Run

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal.

## Optional live API

1. Create a TMDB API key.
2. Copy `.env.example` to `.env`
3. Add:

```env
VITE_TMDB_API_KEY=your_key
```

Without a key, CineVerse automatically uses its built-in demo catalogue.

## Assignment mapping

- Search Movies → live search + instant local fallback
- View Movie Details → detail modal
- Display Ratings → rating badge + score
- Category Filters → genre chips + year
- Responsive Design → desktop/tablet/mobile layouts
- Error Handling → API error + retry UI
- Loading Indicators → skeleton cards
- Components → reusable MovieCard, Hero, Filters, Modal, etc.
- Hooks → useState/useEffect/useMemo
- API Integration → TMDB service
- State Management → React state + localStorage watchlist
- Routing → React Router

## Suggested project title

**CineVerse — AI-Inspired Cinematic Movie Discovery Platform**

For an assignment/demo, describe the "AI-inspired" part as a personalized discovery-style UI; the current implementation does not claim to train an AI model.