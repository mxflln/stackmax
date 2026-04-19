# StackMax

AI-powered personalised supplement stack builder. Mobile-first web app.

## Stack
- Next.js 14
- Claude API (Anthropic) for AI stack generation
- Deployed on Vercel

## Deploy in 5 minutes

1. **Push to GitHub**
   ```
   git init
   git add .
   git commit -m "StackMax initial"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to vercel.com → New Project → Import your repo
   - Add environment variable: `ANTHROPIC_API_KEY` = your key

3. **Connect payment (Gumroad)**
   - Create a product on Gumroad at A$9.99
   - Replace the `handleUnlock` function in `pages/index.js` to redirect to your Gumroad link
   - Use Gumroad's license key system to verify purchases

## Monetisation Flow
- Free: 3-supplement starter stack (no paywall)
- Pro (A$9.99 one-time): Full 10-12 stack + routine + interactions + AU sources
- Upsell shown after free results

## Customisation
- Change `PRO_PRICE` in `pages/index.js` to update displayed price
- Replace `handleUnlock` with your Gumroad redirect URL
- Modify goals list in `GOALS` array to add/remove categories
