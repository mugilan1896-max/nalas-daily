# Nala's Daily - Frontend

This is the React + TypeScript frontend for Nala's Daily meal subscription service.

## Local Development

To run the project locally for development:

```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server
npm run dev
```

## Production Static Deployment

The project is configured for static deployment (e.g., on Vercel, Netlify, or standard web hosts).
The `vercel.json` file is included to handle React single-page application routing correctly.

To generate the static build:

```bash
# 1. Install dependencies
npm install

# 2. Build the project
npm run build
```

This will output the static assets to the `dist` directory.

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the `client` directory.
3. Vercel will automatically detect the Vite project and use the `vercel.json` for routing.

### Environment Variables
For production, create a `.env` file based on `.env.example`.
