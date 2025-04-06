#!/bin/bash

# Remote GitHub repo
REMOTE_REPO="https://github.com/eyobsis/fst_test_project.git"

# ✅ Configure Git globally if not already set
echo "🔍 Checking Git global config..."

if ! git config --global user.name > /dev/null; then
  echo "⚙️ Setting Git global username to 'eyobsis'..."
  git config --global user.name "eyobsis"
fi

if ! git config --global user.email > /dev/null; then
  echo "📧 Setting Git global email to 'ehtube2020@gmail.com'..."
  git config --global user.email "ehtube2020@gmail.com"
fi

# ✅ Initialize Git if not already
if [ ! -d ".git" ]; then
  echo "🔧 Initializing Git repo..."
  git init
  git branch -M main
fi

# ✅ Add remote if not already
if ! git remote | grep -q "origin"; then
  echo "🌐 Adding remote origin..."
  git remote add origin "$REMOTE_REPO"
fi

# ✅ Stage all files
echo "📦 Staging changes..."
git add .

# ✅ Function to generate emoji-rich commit messages
generate_commit_message() {
  local msg=""
  local files=$(git diff --cached --name-only)

  for file in $files; do
    ext="${file##*.}"
    case "$ext" in
      html) msg+="💻 Added/Updated HTML file: $file\n" ;;
      css) msg+="🎨 Updated CSS styles: $file\n" ;;
      js|jsx) msg+="⚙️ Updated JS logic: $file\n" ;;
      php) msg+="🐘 PHP logic update: $file\n" ;;
      json) msg+="🧾 Config or data file: $file\n" ;;
      md) msg+="📝 Documentation updated: $file\n" ;;
      sh) msg+="🔧 Script updated: $file\n" ;;
      png|jpg|jpeg|gif|svg) msg+="🖼️ Image asset added/updated: $file\n" ;;
      *) msg+="📁 Updated file: $file\n" ;;
    esac
  done

  echo -e "$msg" | sed '/^\s*$/d'
}

# ✅ Generate commit message
COMMIT_MSG=$(generate_commit_message)

# ✅ Fallback message
if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="📦 Regular update"
fi

# ✅ Commit
echo "✅ Committing with message:"
echo "$COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# ✅ Push
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo "✅ Done! Project is pushed to GitHub."
