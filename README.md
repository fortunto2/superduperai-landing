This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Google Tag Manager Setup

This project includes Google Tag Manager integration using `@next/third-parties`.

To configure Google Tag Manager:

1. Create a `.env.local` file in the root directory of your project
2. Add your Google Tag Manager ID:
   ```
   NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
   ```
3. Replace `GTM-XXXXXXX` with your actual Google Tag Manager ID

After configuring, restart the development server if it's running. The Google Tag Manager integration will be automatically included in all pages of your application.

### User Identification

The integration includes a consistent user identification system that:

- Generates a UUID for each visitor
- Stores it in localStorage and cookies
- Sends it to Google Tag Manager as `user_id` parameter
- Works across subdomains if needed
- Can be synchronized with authenticated user IDs

This ensures analytics data is consistent and prevents duplicate user counting. 
Further analytics services like Microsoft Clarity or Hotjar should be configured through GTM for best results.

### Development Mode Behavior

By default, Google Tag Manager is **not loaded** in development mode to prevent unnecessary tracking during development. This behavior can be changed if needed:

```tsx
// To enable GTM in development mode, modify in src/app/layout.tsx:
<AnalyticsProviders skipInDevelopment={false} />
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
