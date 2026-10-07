# Calculator.js [![npm version](https://img.shields.io/npm/v/@stableproxy/calculator.svg?style=flat)](https://www.npmjs.com/@stableproxy/calculator)

## ⚠️ This is auto-generated module. Do not modify it manually.

You can also get actual version from API using [https://api.stableproxy.com/v2/cart/calculator.js](https://api.stableproxy.com/v2/cart/calculator.js)
API also supports types:

* `module`
* `require`
* `window`

## Prices

The bundle holds pricing **logic** only, generated from `PriceCalculator::calculate()` in the
backend. Every number comes from a price sheet — the backend's `config/pricing.php`:

```js
import Calculator, {CalculatorInput} from "@stableproxy/calculator"

const calculator = new Calculator()
calculator.setCatalog(catalog)            // {pricing, fx: {rates}, user: {sale_divisor, bonuses}}
calculator.calculate(new CalculatorInput({proxyFor: "shared", proxyCount: 100, trafficInGb: 100}))
```

`user.bonuses` from the catalog apply to every `calculate()` whose input has no `bonuses`
(absent or `{}`); bonuses passed in the input win.

Without `setCatalog()` the calculator uses the sheet that was current when this version was
generated (`calculator.getPricing()`), so older integrations keep pricing correctly. Pass a
fresh sheet to price with today's numbers without a new release.

Use this npm build. The obfuscated builds the API serves in production (`app.debug=false`,
e.g. the live `/v2/cart/calculator.js`) rename `CalculatorInput`'s property names too, so
`new CalculatorInput({proxyFor: …})` matches nothing there and prices the defaults.

## Who uses this?

The StableProxy dashboard and its embeddable widget (both install the latest version at build
time), and the backend's `/v2/cart/calculator.js`.

## Releasing

Releases are automatic. In the backend repo:

```bash
docker compose exec -T dev php artisan js:generate-calculator-module   # in dev: APP_DEBUG=true keeps option names readable
cd public/js/calculator && git add -A && git commit -m "Regenerate: …" && git push origin main
```

On push, [`.github/workflows/publish.yml`](.github/workflows/publish.yml) checks that `dist.md5` matches
`module/dist.js`, compares it with the `dist.md5` inside the latest npm release, and when they
differ: bumps the patch version, builds `dist/`, smoke-tests every entry point (including
`setCatalog()`), publishes, and commits the bump back as `[#] Release x.y.z [skip ci]`.
`dist.md5` is the module's hash with the baked currency rates removed, so a daily rate change
alone never publishes. Re-running the workflow is safe, and only `main` publishes: a manual run
on another branch skips the job. If the commit-back fails after a publish, nothing breaks: the
version comes from npm, so the next run sees the same `dist.md5` and does nothing; git's
`package.json` / `.version` just lag until the next release.

Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers) (OIDC): no
`NPM_TOKEN`. The trusted-publisher entry on npmjs.com is bound to the path
`.github/workflows/publish.yml` — renaming or moving that file breaks publishing until the
entry is updated. The commit-back uses the workflow's `GITHUB_TOKEN` (`contents: write`), so
`main` must accept pushes from `github-actions[bot]`.
