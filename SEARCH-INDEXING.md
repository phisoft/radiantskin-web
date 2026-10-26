# Search indexing

Status as of 8 October 2026.

**Crawlability is clean; the site is not yet indexed.** robots.txt allows
crawling, sitemap.xml is valid (31 URLs, all HTTP 200), every indexable page has
a correct canonical and no `noindex`/`X-Robots-Tag`, and the malformed apex
redirect that produced `http://https://...` is fixed (see "Redirect blocker"
below). Bing, Brave, DuckDuckGo and Mojeek currently return no results for the
domain. Google could not be checked from the development network (bot
interstitial), but the same technical conditions apply. The remaining work is
submission and verification, not code.

## Verified 8 October 2026

- `https://www.myradiantskin.com.my/robots.txt` -> 200, `Allow: /`, sitemap
  declared.
- `https://www.myradiantskin.com.my/sitemap.xml` -> 200, valid XML, 31 `<loc>`.
- All 31 sitemap URLs -> 200, canonical present, no `noindex`, no
  `X-Robots-Tag`.
- Unknown paths -> 404.
- Apex and HTTP requests resolve in a single 301 to the canonical www HTTPS URL.
- Cloudflare is not challenging crawlers: Bot Fight Mode `false`,
  `crawler_protection: disabled`, security level `medium`; a Googlebot user
  agent receives 200 on all pages.

## Publish and request indexing (pending - needs owner accounts)

1. Deploy this repository's changes.
2. Google Search Console: add the domain property `myradiantskin.com.my` and
   verify ownership. DNS verification (a TXT record) is preferred; an HTML
   `<meta name="google-site-verification">` tag also works. The zone currently
   has **no TXT records**, so this has not been done.
3. Submit `https://www.myradiantskin.com.my/sitemap.xml` in Sitemaps.
4. Inspect `https://www.myradiantskin.com.my/`, run Test Live URL, and request
   indexing. Inspect the `medi-facials.html` and `skincare.html` pages as well.
5. Bing Webmaster Tools: verify the site and submit the same sitemap, and/or use
   IndexNow (below).
6. Recheck after the engines process the request. Submission does not guarantee
   indexing or ranking; code changes cannot force a listing.

Google guidance:
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/webmasters/answer/7474347

Bing guidance:
- https://www.bing.com/webmasters/help/getting-started-checklist-66a806de
- https://www.indexnow.org/documentation

## IndexNow (Bing / Yandex / Seznam / Naver)

`scripts/indexnow.cjs` submits every URL in `sitemap.xml` to IndexNow. The key
file `<key>.txt` (32 hex characters) lives in the repository root and must be
deployed before the first submission; the key is then served at
`https://www.myradiantskin.com.my/<key>.txt`.

```sh
node scripts/indexnow.cjs --dry-run   # preview the payload
node scripts/indexnow.cjs             # submit
```

Re-run after deploying new or changed pages. IndexNow returns HTTP 200/202 on
acceptance, which confirms receipt only - not indexing.

## Maintain crawler-visible navigation

The shared header is rendered into each HTML page and remains usable without
JavaScript. After editing `js/header.js`, run:

```sh
node scripts/render-header.cjs
```

Commit the generated HTML alongside the header changes. Before deploying, run
the checks:

```sh
npm run check
# same as:
node scripts/check-links.cjs
node scripts/render-header.cjs --check
```

`check-links.cjs` fails on missing local files or dead `#anchor` links;
`render-header.cjs --check` fails when a page's committed header differs from
`js/header.js`. Keep canonical URLs and sitemap entries aligned with published
pages. Update sitemap lastmod dates only when their corresponding content
actually changes.

## Redirect blocker - resolved (8 October 2026)

Root cause: the apex DNS record points to an origin running Nginx Proxy Manager.
Its Redirection Host for `myradiantskin.com.my` stored the forward domain as
`https://www.myradiantskin.com.my` while the forward scheme was `$scheme`, so the
generated nginx line was:

```nginx
return 301 $scheme://https://www.myradiantskin.com.my$request_uri;
```

which returned `Location: http://https://www.myradiantskin.com.my/...` - an
invalid URL, and the likely cause of any crawl errors.

Fix applied at the origin (Nginx Proxy Manager, `redirection_host` id 7, database
`/opt/nginxproxymanager/data/database.sqlite`):

- `forward_scheme` -> `https`
- `forward_domain_name` -> `www.myradiantskin.com.my`
- regenerated `nginx/redirection_host/7.conf` and reloaded nginx.

Result: `http://myradiantskin.com.my/<path>` -> `301 https://www.myradiantskin.com.my/<path>`.

Belt-and-braces edge rule: a Cloudflare Single Redirect in the
`http_request_dynamic_redirect` ruleset also matches
`(http.host eq "myradiantskin.com.my")` and redirects to
`concat("https://www.myradiantskin.com.my", http.request.uri.path)`, preserving
the query string. It resolves apex requests at the edge without an origin
round-trip.

Legacy URL redirects: two more edge rules keep the paths renamed in PRs #35/#37
working - `/treatments.html` 301s to `/medi-facials.html` and
`/skin-products.html` 301s to `/skincare.html`, preserving the query string, so
pre-rename links never 404.

Expected results:

| Request | Response |
| --- | --- |
| `http://www.myradiantskin.com.my/medi-facials.html?ref=test` | 301 to `https://www.myradiantskin.com.my/medi-facials.html?ref=test` |
| `https://myradiantskin.com.my/medi-facials.html?ref=test` | 301 to `https://www.myradiantskin.com.my/medi-facials.html?ref=test` |
| `http://myradiantskin.com.my/medi-facials.html?ref=test` | 301 to `https://www.myradiantskin.com.my/medi-facials.html?ref=test` |
| `https://www.myradiantskin.com.my/medi-facials.html?ref=test` | 200, no redirect loop |
| `https://www.myradiantskin.com.my/treatments.html?ref=test` | 301 to `https://www.myradiantskin.com.my/medi-facials.html?ref=test` |
| `https://www.myradiantskin.com.my/skin-products.html` | 301 to `https://www.myradiantskin.com.my/skincare.html` |

Notes:

- Cloudflare SSL mode for the zone is `Flexible`; the origin serves the apex
  redirect over HTTP. This is not an indexing blocker, but moving to
  `Full (strict)` would require a certificate for the apex at the origin.
- GitHub Pages reports `https_enforced: false`; enabling it was rejected with
  `The certificate does not exist yet`. No hosting setting was changed.

Reference: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/
