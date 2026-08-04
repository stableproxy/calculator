# Calculator.js [![npm version](https://img.shields.io/npm/v/@stableproxy/calculator.svg?style=flat)](https://www.npmjs.com/@stableproxy/calculator)

## ⚠️ This is auto-generated module. Do not modify it manually.

You can also get actual version from API using [https://api.stableproxy.com/v2/cart/calculator.js](https://api.stableproxy.com/v2/cart/calculator.js)
API also supports types:

* `module`
* `require`
* `window`

## How generator works?

Generator convert backend code to frontend code. It's very simple. It just replace all `require` to `import` and add `export default` to the end of file.

## Who using this?

This module is using in [https://stableproxy.com](https://stableproxy.com) (Frontend) and [https://api.stableproxy.com](https://api.stableproxy.com) projects.

## Releasing

Everything here is generated from `PriceCalculator::calculate()` in the backend
repo, so a release starts there:

```bash
# 1. regenerate the bundles (in the backend repo; host PHP is often unusable)
docker compose exec app_dev php artisan js:generate-calculator-module

# 2. cut the release
cd public/js/calculator && ./upload.sh
```

`upload.sh` builds `dist/`, refuses to release an unchanged bundle or a branch
that is behind `origin/main`, bumps the patch version, commits and pushes.

**It does not publish.** The push triggers
[`.github/workflows/publish.yml`](.github/workflows/publish.yml), which smoke-tests
every entry point and publishes to npm using
[trusted publishing](https://docs.npmjs.com/trusted-publishers) — an OIDC token
minted at run time, so there is no `NPM_TOKEN` to rotate and no 2FA prompt.
Every release therefore also carries a provenance attestation.

The workflow skips a version that is already on npm, so re-running it is safe.
If a release commit landed but the publish failed, re-run it from the Actions
tab rather than cutting a new version.

> The npm trusted-publisher entry is bound to this exact file path. Moving or
> renaming `.github/workflows/publish.yml` breaks publishing until the entry on
> npmjs.com is updated to match.