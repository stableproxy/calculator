#!/bin/sh
#
# Cuts a release of @stableproxy/calculator: build -> bump -> commit -> push.
#
# It does NOT publish. Publishing happens in GitHub Actions
# (.github/workflows/publish.yml) through npm trusted publishing, so there is no
# token to manage and no 2FA prompt to answer. Pushing is what triggers it.
#
# That split exists because this script used to run `npm publish` locally, AFTER
# `git push`, with no error handling and an unconditional "Done!" at the end. A
# rejected publish therefore still advanced the repo and still reported success:
# 1.0.62, 1.0.63 and 1.0.65 were all tagged in git and never reached npm.
#
# Regenerate the bundle first (from the repo root, inside the app container):
#   php artisan js:generate-calculator-module
# or run ./update_local.sh, which does that plus the build.
set -e

echo "Building dist/ from module/ ..."
npx -p typescript tsc -p .

# A release with nothing in it is almost always a forgotten regeneration.
if [ -z "$(git status --porcelain)" ]; then
  echo ""
  echo "Nothing to release: the built bundle is identical to what is already committed."
  echo "Regenerate it first — php artisan js:generate-calculator-module — then re-run."
  exit 1
fi

# Check the branch can land BEFORE bumping: otherwise a rejected push burns a
# version number on a commit that never goes anywhere.
git fetch origin main
if [ -n "$(git rev-list HEAD..origin/main)" ]; then
  echo ""
  echo "origin/main has commits this checkout does not. Pull and rebase first."
  exit 1
fi

version=$(cat .version)
date=$(date +"%m-%d-%y %H:%M:%S")

# Bump the patch component: 1.0.64 -> 1.0.65
newVersion=$(echo "$version" | awk -F. -v OFS=. '{$NF++;print}')
echo "$newVersion" > .version
npm version "$newVersion" --no-git-tag-version

echo "Releasing $newVersion (was $version), compiled at $date ..."

git add .
# The message names the version being released. It used to name the PREVIOUS
# one, because the bump happens above it — so git history claimed a version that
# was in fact the release before it.
git commit -m "[#] Auto-Generate - $newVersion, compiled at $date."
git push origin main

echo ""
echo "Pushed $newVersion. npm publish runs in CI:"
echo "  https://github.com/stableproxy/calculator/actions/workflows/publish.yml"
echo ""
echo "That workflow is idempotent — safe to re-run if it fails."
