This is a [Next.js](https://nextjs.org) project for displaying casino bonus information.

## Getting Started

### 1. Configure Backend URL

Create a `.env.local` file in the root directory:

```env
BACKEND_URL=http://localhost:3001
```

Or if you need it accessible in the browser:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 2. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

**Note:** The app will fetch bonuses from `BACKEND_URL/bonuses`. If the backend is unavailable, it will fall back to static data.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `app/` - Next.js app directory with pages and layouts
- `components/` - React components
- `lib/` - Utility functions and data
- `public/` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
