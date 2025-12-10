# Deploying to Fly.io

This guide explains how to deploy your BusyBee application to Fly.io. Fly.io provides:

- ✅ **No cold starts** - Keep your apps running 24/7
- ✅ **Fast global edge network**
- ✅ **Free tier** includes 3 shared-cpu VMs with 256MB RAM
- ✅ **Simple deployment** with Docker

## Prerequisites

1. **Install Fly.io CLI**

   ```bash
   # macOS
   brew install flyctl

   # Linux/WSL
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
   ```

2. **Sign up and authenticate**

   ```bash
   fly auth signup  # Or: fly auth login if you have an account
   ```

3. **Add a credit card** (required even for free tier, but you won't be charged for the free allowance)

---

## Deploy Backend (NestJS + GraphQL)

### Step 1: Prepare Firebase Credentials

Convert your Firebase service account to base64:

```bash
cat apps/busybee-be/firebase-service-account.json | base64
```

Copy the output - you'll need it in Step 3.

### Step 2: Launch the Backend App

From your project root:

```bash
# Launch the app (interactive setup)
cd /Users/karan/Personal\ Projects/busybee
fly launch \
  --name busybee-backend \
  --region ams \
  --config apps/busybee-be/fly.toml \
  --dockerfile apps/busybee-be/Dockerfile \
  --no-deploy
```

**Important answers during setup:**

- **Would you like to set up a Postgresql database?** → No
- **Would you like to set up an Upstash Redis database?** → No (unless you need caching)
- **Would you like to deploy now?** → No (we need to set secrets first)

### Step 3: Set Secrets

Set your Firebase credentials and other environment variables:

```bash
# Set Firebase credentials (paste the base64 string from Step 1)
fly secrets set FIREBASE_SERVICE_ACCOUNT_BASE64="<paste-base64-string-here>" -a busybee-backend

# Set any other environment variables
fly secrets set NODE_ENV="production" -a busybee-backend
```

### Step 4: Deploy Backend

```bash
fly deploy --config apps/busybee-be/fly.toml --dockerfile apps/busybee-be/Dockerfile -a busybee-backend
```

### Step 5: Verify Deployment

```bash
# Check status
fly status -a busybee-backend

# View logs
fly logs -a busybee-backend

# Open in browser (should show GraphQL playground or API response)
fly open -a busybee-backend
```

Your backend will be available at: `https://busybee-backend.fly.dev`

---

## Deploy Frontend (Angular)

### Step 1: Configure Production Environment

The frontend uses hardcoded Firebase configuration in `apps/busybee-fe/src/environments/environment.prod.ts`. This is safe because Firebase client-side config is not secret - it's exposed in every browser request. Security comes from Firebase Security Rules, not hiding these values.

Update `environment.prod.ts` with your Firebase config:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://busybee-backend.fly.dev/graphql',
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project-id.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project-id.firebasestorage.app',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
  },
};
```

### Step 2: Launch the Frontend App

```bash
fly launch \
  --name busybee \
  --region ams \
  --config apps/busybee-fe/fly.toml \
  --dockerfile apps/busybee-fe/Dockerfile \
  --no-deploy
```

### Step 3: Deploy Frontend

```bash
fly deploy --config apps/busybee-fe/fly.toml -a busybee
```

### Step 4: Verify Deployment

```bash
# Check status
fly status -a busybee

# View logs
fly logs -a busybee

# Open in browser
fly open -a busybee
```

Your frontend will be available at: `https://busybee.fly.dev`

---

## Update Backend CORS

After deploying the frontend, update your backend CORS configuration to allow requests from your Fly.io frontend:

In `apps/busybee-be/src/main.ts`, update the CORS origin array:

```typescript
app.enableCors({
  origin: [
    'http://localhost:4200',
    'http://localhost:4000',
    'https://busybee.fly.dev',
    /\.fly\.dev$/, // Allow all fly.dev subdomains
  ],
  credentials: true,
});
```

Then redeploy the backend:

```bash
fly deploy --config apps/busybee-be/fly.toml --dockerfile apps/busybee-be/Dockerfile -a busybee-backend
```

---

## Configuration Details

### Backend Configuration

**File:** `apps/busybee-be/fly.toml`

Key settings:

- `auto_stop_machines = false` - Prevents cold starts
- `min_machines_running = 1` - Keeps 1 instance always running
- `memory = "512mb"` - Adjust based on your needs

### Frontend Configuration

**File:** `apps/busybee-fe/fly.toml`

Key settings:

- Uses nginx to serve static files
- `memory = "256mb"` - Frontend needs less memory
- Port 8080 (Fly.io default for HTTP services)

---

## Useful Commands

### Monitoring & Debugging

```bash
# View real-time logs
fly logs -a busybee-backend
fly logs -a busybee-frontend

# SSH into the running machine
fly ssh console -a busybee-backend

# Check machine status
fly status -a busybee-backend

# View app dashboard
fly dashboard busybee-backend
```

### Scaling

```bash
# Scale to more instances (for production)
fly scale count 2 -a busybee-backend

# Scale memory
fly scale memory 1024 -a busybee-backend

# Scale VM size
fly scale vm shared-cpu-2x -a busybee-backend
```

### Managing Secrets

```bash
# List secrets
fly secrets list -a busybee-backend

# Unset a secret
fly secrets unset SECRET_NAME -a busybee-backend

# Import secrets from .env file
fly secrets import -a busybee-backend < .env
```

### Updates & Redeployment

```bash
# Redeploy backend after code changes
fly deploy --config apps/busybee-be/fly.toml --dockerfile apps/busybee-be/Dockerfile -a busybee-backend

# Redeploy frontend after code changes
fly deploy --config apps/busybee-fe/fly.toml --dockerfile apps/busybee-fe/Dockerfile -a busybee-frontend

# Force rebuild from scratch
fly deploy --build-only -a busybee-backend
```

---

## Cost Optimization

### Free Tier Limits (as of 2024)

- 3 shared-cpu VMs with 256MB RAM each
- 160GB bandwidth per month
- 3GB persistent storage

### Staying Within Free Tier

**Option 1: Run Both Apps on Minimal Resources**

- Backend: 1 VM, 256MB RAM
- Frontend: 1 VM, 256MB RAM
- Total: 2 VMs (within free tier)

**Option 2: Scale Down When Not in Use**

```bash
# Scale to 0 (stops all machines, no charges)
fly scale count 0 -a busybee-backend

# Scale back up when needed
fly scale count 1 -a busybee-backend
```

**Option 3: Use Auto-Stop for Frontend (Static Site)**

```toml
# In apps/busybee-fe/fly.toml
auto_stop_machines = true   # Frontend can restart quickly
auto_start_machines = true
min_machines_running = 0    # Allow scaling to 0
```

---

## Custom Domains

### Add Your Own Domain

```bash
# Add domain to your app
fly certs add yourdomain.com -a busybee-frontend

# Follow DNS instructions
fly certs show yourdomain.com -a busybee-frontend
```

Then update your DNS provider with the provided CNAME or A records.

---

## Troubleshooting

### Build Fails

**Problem:** Docker build errors

**Solution:**

```bash
# Check build logs
fly logs -a busybee-backend

# Test build locally
docker build -f apps/busybee-be/Dockerfile -t busybee-backend .

# Clean cache and rebuild
fly deploy --no-cache -a busybee-backend
```

### App Not Starting

**Problem:** Health checks failing

**Solution:**

```bash
# Check logs for errors
fly logs -a busybee-backend

# SSH into the machine
fly ssh console -a busybee-backend

# Inside the machine, check if app is running
ps aux | grep node
netstat -tlnp | grep 3000
```

### Firebase Credentials Not Working

**Problem:** `FIREBASE_SERVICE_ACCOUNT_BASE64 is invalid`

**Solution:**

```bash
# Verify the secret is set correctly
fly secrets list -a busybee-backend

# Re-generate and set the secret
cat apps/busybee-be/firebase-service-account.json | base64 | fly secrets set FIREBASE_SERVICE_ACCOUNT_BASE64=- -a busybee-backend
```

### CORS Errors

**Problem:** Frontend can't connect to backend

**Solution:**

1. Check backend CORS configuration includes your frontend URL
2. Verify backend is running: `fly status -a busybee-backend`
3. Check backend logs: `fly logs -a busybee-backend`
4. Test backend directly: `curl https://busybee-backend.fly.dev/api`

---

## CI/CD with GitHub Actions

Create `.github/workflows/deploy-fly.yml`:

```yaml
name: Deploy to Fly.io

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only --config apps/busybee-be/fly.toml --dockerfile apps/busybee-be/Dockerfile -a busybee-backend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    needs: deploy-backend
    steps:
      - uses: actions/checkout@v4
      - uses: superfly/flyctl-actions/setup-flyctl@master
      - run: flyctl deploy --remote-only --config apps/busybee-fe/fly.toml --dockerfile apps/busybee-fe/Dockerfile -a busybee-frontend
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

Get your API token: `fly auth token`

Add it to GitHub secrets as `FLY_API_TOKEN`.

---

## Additional Resources

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly.io Pricing](https://fly.io/docs/about/pricing/)
- [Fly.io Community Forum](https://community.fly.io/)

---

## Quick Reference

```bash
# Deploy both apps
fly deploy --config apps/busybee-be/fly.toml -a busybee-backend
fly deploy --config apps/busybee-fe/fly.toml -a busybee-frontend

# View logs
fly logs -a busybee-backend
fly logs -a busybee-frontend

# Open apps
fly open -a busybee-backend
fly open -a busybee-frontend

# Check status
fly status -a busybee-backend
fly status -a busybee-frontend
```

---

## Summary

✅ **Backend:** `https://busybee-backend.fly.dev`

- NestJS + GraphQL API
- No cold starts with `min_machines_running = 1`
- Firebase Admin SDK with base64 encoded credentials

✅ **Frontend:** `https://busybee.fly.dev`

- Angular SPA served with nginx
- Firebase config hardcoded in `environment.prod.ts` (safe - client config is public)
- Automatic HTTPS and caching

Both apps run 24/7 with no cold starts, perfect for production use!
