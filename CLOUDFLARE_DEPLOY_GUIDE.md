# Cloudflare Pages Deployment Guide

A complete step-by-step guide to deploy this Astro static site to **Cloudflare Pages** (not Workers).

---

## 1. Prerequisites

- A GitHub account with your `agecalculator` repository pushed to it.
- A Cloudflare account (free tier works perfectly).

---

## 2. Push the project to GitHub (if not already done)

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit"

# Replace <your-username> with your actual GitHub username
git remote add origin https://github.com/<your-username>/agecalculator.git
git branch -M main
git push -u origin main
```

---

## 3. Deploy via Cloudflare Dashboard

1. Go to **https://dash.cloudflare.com** and log in.
2. In the left sidebar, click **Pages**.
3. Click the **"Create a project"** button (blue button, top right).
4. Click **"Connect to Git"**.

---

## 4. Connect your GitHub repository

1. Authorize Cloudflare to access your GitHub account if prompted.
2. Search for and select the `agecalculator` repository.
3. Click **"Begin setup"**.

---

## 5. Configure build settings

Set the following **exactly**:

| Setting | Value |
|---|---|
| **Project name** | `agecalculator` (or a custom name — see section 7) |
| **Framework preset** | `Astro` (Cloudflare auto-fills the fields below) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | *(leave blank)* |
| **Node.js version** | `22` (or whatever matches your `package.json` engines field) |

Environment variables — none are required. Leave this section empty.

---

## 6. Deploy

1. Click the **"Save and Deploy"** button.
2. Cloudflare will now:
   - Clone your repository
   - Run `npm install`
   - Run `npm run build`
   - Deploy the `dist/` folder to a `*.pages.dev` URL
3. Wait ~1–2 minutes for the build to finish.
4. Once successful, you will see a green checkmark and your live URL.

---

## 7. Project name suggestions

| Suggested name | Final URL |
|---|---|
| `agecalculator` | `https://agecalculator.pages.dev` |
| `age-calculator` | `https://age-calculator.pages.dev` |
| `agecalculatordob` | `https://agecalculatordob.pages.dev` |

> **Note:** The `astro.config.mjs` file already has `site` set to `https://agecalculatordob.pages.dev`. If you use a different project name, update it accordingly:
>
> ```js
> // astro.config.mjs — line 7
> site: 'https://your-project-name.pages.dev',
> ```
>
> Then commit and push the change before deploying again.

---

## 8. Final URL after deployment

Your site will be live at:

```
https://<project-name>.pages.dev
```

For example, if you chose `agecalculator` as the project name:

```
https://agecalculator.pages.dev
```

---

## 9. (Optional) Custom domain

1. Go to your Pages project in the Cloudflare dashboard.
2. Click **"Custom domains"** tab.
3. Click **"Set up a custom domain"**.
4. Enter your domain (e.g., `agecalculator.com`).
5. Follow the DNS instructions to point the domain to Cloudflare.
6. Update `site` in `astro.config.mjs` to your custom domain, then rebuild.

---

## 10. Troubleshooting

### Build fails with "Node.js version not supported"

**Fix:** Go to your Pages project → **Settings** → **Environment variables** → add `NODE_VERSION` with value `22`, then redeploy.

### Build fails with "command not found: astro"

**Fix:** Make sure `astro` is in `dependencies` (not just `devDependencies`) in `package.json`. Then run `npm install` locally, commit the updated `package-lock.json`, and push again.

### Build succeeds but page shows 404

**Fix:** This is usually a wrong **Build output directory**. Make sure it is set to `dist` (not `public` or anything else).

### Deployment succeeds but CSS/styles are missing

**Fix:** Run `npm run build` locally and check that the `dist/` folder contains your CSS files. If missing, ensure `tailwindcss` plugin is properly configured in `astro.config.mjs`. Then rebuild in Cloudflare by going to the project → **Deployments** → click the three dots → **"Retry deployment"**.

### "The build output directory (dist) does not exist"

**Fix:** Your build command must succeed. Run `npm run build` locally to check for errors. Common causes:
- Missing `node_modules` (Cloudflare runs `npm install` automatically, but if it fails, check the build log).
- A syntax error in your Astro files.

### I pushed a new commit but Cloudflare didn't rebuild

**Fix:** Check your project settings → **Build configuration** → make sure **"Automatic deployments"** is enabled. By default it watches your `main` (or `master`) branch.

### How do I view the build log?

In the Cloudflare dashboard:
1. Go to **Pages** → **your project**.
2. Click the **"Deployments"** tab.
3. Click on the deployment you want to inspect.
4. You will see the full live build log — scroll through to find errors.

---

## 11. Redeploying after changes

After any code change, simply push to your GitHub repository:

```bash
git add .
git commit -m "Your change description"
git push
```

Cloudflare Pages automatically detects the push and triggers a new build. No manual steps needed.
