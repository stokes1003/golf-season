# Fairway Fleas Golf Season App

A modern web application for managing and visualizing golf league statistics, leaderboards, and player scores. Built with React, Mantine, TypeScript, and React Query.

## Features

- Player leaderboard with net and gross scoring
- Interactive statistics and charts (scores, averages, handicap evolution)
- Add and manage player scores and golf courses
- Responsive design for desktop and mobile
- Data fetching and caching with React Query

## Tech Stack

- **Frontend:** React, TypeScript, Mantine UI, Mantine Charts
- **State/Data:** React Query (@tanstack/react-query)
- **Backend:** Netlify Functions (serverless)
- **Database:** MongoDB (via serverless functions)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fairway-fleas.git
   cd fairway-fleas
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in your MongoDB connection string and any other required variables.

4. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173` (or your configured port).

### Local Development

To run both the frontend and serverless functions locally, use:

```bash
npx netlify dev
```

This will start the Vite dev server and Netlify Functions together.  
The app will be available at `http://localhost:8888` by default.

### Netlify Functions (API)

- Serverless functions are located in the `netlify/functions/` directory.
- To run locally, use the Netlify CLI:
  ```bash
  npm install -g netlify-cli
  netlify dev
  ```

## Project Structure

```
src/
  components/        # React components (Leaderboard, Statistics, etc.)
  hooks/             # Custom hooks for data fetching
  lib/               # Query client and shared utilities
  types/             # TypeScript type definitions
netlify/functions/   # Serverless backend functions
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT

---

**Maintained by the Fairway Fleas team.**
