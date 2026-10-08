# Search indexing

The public homepage, robots.txt, and sitemap were reachable on 1 October 2026.
The homepage returned HTTP 200 without an X-Robots-Tag restriction. The apex
domain redirected to the canonical www domain. robots.txt allows crawling.
These checks do not reveal Google's actual indexing status or crawl history.

## Publish and request indexing

1. Deploy this repository's changes using the existing GitHub Pages workflow.
2. In https://search.google.com/search-console, add the domain property
   `myradiantskin.com.my` and verify ownership using Google's supplied DNS TXT
   record. Use an existing verified property if available. Do not invent a
   verification token or remove existing DNS records.
3. Submit `https://www.myradiantskin.com.my/sitemap.xml` in Sitemaps.
4. Inspect `https://www.myradiantskin.com.my/`, run Test Live URL, and request
   indexing. Inspect the treatments and skin-products pages as well.
5. Check the Page indexing report for the actual exclusion reason. For a crawl
   failure, inspect Cloudflare security events and ensure legitimate verified
   search crawlers can access the site without a challenge.
6. Recheck after Google processes the request. Submission does not guarantee
   indexing or ranking; code changes cannot force a listing.

Google guidance:
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/webmasters/answer/7474347

## Maintain crawler-visible navigation

The shared header is rendered into each HTML page and remains usable without
JavaScript. After editing `js/header.js`, run:

```sh
node scripts/render-header.cjs
```

Commit the generated HTML alongside the header changes. Keep canonical URLs and
sitemap entries aligned with published pages. Update sitemap lastmod dates only
when their corresponding content actually changes. The message confirmation
page intentionally stays noindex and outside the sitemap.

## Hosting redirect fixes (8 October 2026)

Live checks found HTTP returning 200 and the apex domain redirecting every
page to the www homepage, dropping the path. GitHub Pages reports
`https_enforced: false`; enabling it was rejected with
`The certificate does not exist yet`. No hosting setting was changed.

Apply the following in Cloudflare for the `myradiantskin.com.my` zone:

1. Replace the existing apex-to-homepage redirect with a Single Redirect.
   Use this custom filter expression:
   ```text
   (http.host eq "myradiantskin.com.my") or
   (http.host eq "www.myradiantskin.com.my" and not ssl)
   ```
2. Set the target type to Dynamic and the target expression to:
   ```text
   concat("https://www.myradiantskin.com.my", http.request.uri.path)
   ```
3. Set status to 301 and enable Preserve query string. Ensure this rule takes
   precedence over any conflicting existing apex redirect, including Page
   Rules or Bulk Redirects. Keep unrelated rules intact.
4. Verify both hosts have proxied DNS records. Do not change the origin TLS
   mode merely to fix these edge redirects.

Expected results:

| Request | Response |
| --- | --- |
| `http://www.myradiantskin.com.my/treatments.html?ref=test` | 301 to `https://www.myradiantskin.com.my/treatments.html?ref=test` |
| `https://myradiantskin.com.my/treatments.html?ref=test` | 301 to `https://www.myradiantskin.com.my/treatments.html?ref=test` |
| `http://myradiantskin.com.my/treatments.html?ref=test` | 301 to `https://www.myradiantskin.com.my/treatments.html?ref=test` |
| `https://www.myradiantskin.com.my/treatments.html?ref=test` | 200, no redirect loop |

Check the homepage and a product page as well. The www HTTPS robots.txt and
sitemap.xml must still return 200. These fixes require Cloudflare account
access; HTML, `.htaccess`, and `_redirects` files cannot configure redirects
for this GitHub Pages deployment.

Reference: https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/
