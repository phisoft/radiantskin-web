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
