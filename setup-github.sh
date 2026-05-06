#!/bin/bash
# AIClaimPath — one-command GitHub setup
# Usage: bash setup-github.sh YOUR_GITHUB_USERNAME

set -e

USERNAME=$1

if [ -z "$USERNAME" ]; then
  echo "Usage: bash setup-github.sh YOUR_GITHUB_USERNAME"
  exit 1
fi

REPO="aiclaimpath"
REMOTE="https://github.com/$USERNAME/$REPO.git"

echo ""
echo "================================================"
echo "  AIClaimPath → GitHub setup"
echo "  Repo: github.com/$USERNAME/$REPO"
echo "================================================"
echo ""

# Check git is installed
if ! command -v git &> /dev/null; then
  echo "Git not found. Install from https://git-scm.com"
  exit 1
fi

# Init git if not already
if [ ! -d ".git" ]; then
  echo "→ Initializing git..."
  git init
  echo "✓ Git initialized"
else
  echo "✓ Git already initialized"
fi

# Create .gitignore if missing
if [ ! -f ".gitignore" ]; then
  echo "node_modules/
.next/
.env
.env.local
.env.*.local
.vercel
*.log" > .gitignore
  echo "✓ .gitignore created"
fi

# Stage all files
echo "→ Staging all files..."
git add .
echo "✓ Files staged"

# Commit
echo "→ Creating initial commit..."
git commit -m "🚀 Initial commit — AIClaimPath v0.1

- Next.js 15 + Tailwind CSS frontend
- Claude claude-sonnet-4-20250514 streaming chat agent
- RAG pipeline with Pinecone vector DB
- All 50 states data with deadlines + portal links
- Eligibility checker API
- Privacy-first: PII scrubber on all inputs
- Rate limiting with Upstash Redis
- GitHub Actions CI/CD for Vercel deploy
- Ready to launch aiclaimpath.com"
echo "✓ Commit created"

# Set branch to main
git branch -M main

# Add remote
echo "→ Connecting to GitHub..."
if git remote get-url origin &> /dev/null; then
  git remote set-url origin "$REMOTE"
  echo "✓ Remote updated to $REMOTE"
else
  git remote add origin "$REMOTE"
  echo "✓ Remote added: $REMOTE"
fi

# Push
echo "→ Pushing to GitHub..."
echo ""
echo "  (If prompted, sign in with your GitHub credentials)"
echo "  (Or use a Personal Access Token as password)"
echo ""
git push -u origin main

echo ""
echo "================================================"
echo "  ✅ SUCCESS!"
echo "  View your repo: https://github.com/$USERNAME/$REPO"
echo ""
echo "  Next step: Connect to Vercel"
echo "  → vercel.com/new → Import $REPO"
echo "================================================"
echo ""
