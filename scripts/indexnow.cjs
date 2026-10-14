#!/usr/bin/env node
/*
 * Submit every URL in sitemap.xml to IndexNow.
 * IndexNow is shared by Bing, Yandex, Seznam and Naver.
 *
 * Usage:
 *   node scripts/indexnow.cjs             # submit
 *   node scripts/indexnow.cjs --dry-run   # print payload, do not send
 *
 * Prerequisite: the key file <key>.txt (32 hex chars) must sit in the
 * repository root and be publicly reachable at
 *   https://<HOST>/<key>.txt
 * before the first run. Deploy the key file first.
 *
 * Re-run after deploying new or changed pages. IndexNow returns HTTP 200/202
 * on acceptance, which confirms receipt only -- not indexing.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const base = path.resolve(__dirname, '..');
const HOST = 'www.myradiantskin.com.my';
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DRY_RUN = process.argv.includes('--dry-run');

function readKey() {
    const explicit = (process.env.INDEXNOW_KEY || '').trim();
    if (explicit) return explicit;
    const file = fs.readdirSync(base).find((name) => /^[a-f0-9]{32}\.txt$/.test(name));
    if (!file) {
        throw new Error('No IndexNow key file (<32 hex chars>.txt) found in the repo root.');
    }
    const key = fs.readFileSync(path.join(base, file), 'utf8').trim();
    if (!/^[a-f0-9]{32}$/.test(key)) {
        throw new Error(`${file} does not contain a valid 32-character hex key.`);
    }
    return key;
}

function sitemapUrls() {
    const xml = fs.readFileSync(path.join(base, 'sitemap.xml'), 'utf8');
    return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

async function main() {
    const key = readKey();
    const urlList = sitemapUrls();
    if (urlList.length === 0) throw new Error('No <loc> entries found in sitemap.xml.');

    const payload = {
        host: HOST,
        key,
        keyLocation: `https://${HOST}/${key}.txt`,
        urlList
    };

    if (DRY_RUN) {
        console.log('Dry run - would POST to', ENDPOINT);
        console.log(JSON.stringify(payload, null, 2));
        return;
    }

    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
    });
    const body = await res.text();
    console.log(`Submitted ${urlList.length} URLs to IndexNow -> HTTP ${res.status} ${res.statusText}`);
    if (body) console.log(body);
    if (res.status !== 200 && res.status !== 202) process.exitCode = 1;
}

main().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
});
