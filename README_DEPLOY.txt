PADEL 5IVE · Short Link Netlify edition

IMPORTANT: This is a source project containing Netlify Functions, NOT a static index.html-only ZIP.

Recommended deployment: connect this project to a GitHub repository in Netlify, or use Netlify CLI to deploy with functions.
1. Extract ZIP and put files in a Git repository, preserving netlify/functions/results.mjs.
2. In Netlify, import the repository; build command npm run build; publish directory dist (already in netlify.toml).
3. In Netlify site settings > Environment variables, add PADEL5IVE_SHARE_PIN with a strong secret (at least 8 characters). Do not put this PIN in source code. Redeploy if necessary.
4. Open existing dashboard and publish Share Results; enter PIN when prompted.
5. Share short URL https://YOUR-SITE.netlify.app/r/XXXXXXXXXX. Same link updates when shared again from the same browser; new tournament resets ID.
6. Test link in Safari private window and WhatsApp.

For CLI with Netlify installed and authenticated: npm install && npm run build && netlify deploy --prod --dir=dist --functions=netlify/functions

CAUTION: Uploading just the HTML/static ZIP will NOT deploy Netlify Functions. Drag-and-drop ZIP might publish only static files depending on its build pathway; use Git deploy or CLI for reliable server functions.

Read-only visitors do not need PIN. Admin sharing requires PIN. Protect it as a secret. Netlify free tier subject to usage limits.
