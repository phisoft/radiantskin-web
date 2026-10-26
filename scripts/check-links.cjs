// Run with: node scripts/check-links.cjs
// Fails when a local link, image, script or stylesheet is missing,
// or when an in-page #anchor has no matching id on the target page.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const base = path.resolve(__dirname, '..');
const pages = [
    ...fs.readdirSync(base).filter((name) => name.endsWith('.html')).map((name) => name),
    ...['product', 'treatment'].flatMap((dir) =>
        fs.readdirSync(path.join(base, dir))
            .filter((name) => name.endsWith('.html'))
            .map((name) => path.join(dir, name))
    )
].sort();

const idCache = new Map();
const idsOf = (file) => {
    if (!idCache.has(file)) {
        const html = fs.readFileSync(path.join(base, file), 'utf8');
        idCache.set(file, new Set([...html.matchAll(/\b(?:id|name)="([^"]+)"/g)].map((m) => m[1])));
    }
    return idCache.get(file);
};

const missing = [];
const external = /^(?:[a-z]+:|\/\/)/i;

function resolve(ref, from) {
    const url = new URL(ref, `https://site.invalid/${from}`);
    const file = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    return { file, hash: url.hash.slice(1) };
}

function checkRef(ref, from, kind) {
    ref = ref.trim();
    if (!ref || ref === '#' || external.test(ref) || ref.startsWith('data:')) return;
    const { file, hash } = resolve(ref, from);
    if (!fs.existsSync(path.join(base, file))) {
        missing.push(`${from}: ${kind} "${ref}" -> missing file ${file}`);
        return;
    }
    if (hash && file.endsWith('.html') && !idsOf(file).has(decodeURIComponent(hash))) {
        missing.push(`${from}: ${kind} "${ref}" -> missing #${decodeURIComponent(hash)} in ${file}`);
    }
}

for (const file of pages) {
    const html = fs.readFileSync(path.join(base, file), 'utf8');
    for (const m of html.matchAll(/\b(?:href|src)="([^"]*)"/g)) checkRef(m[1], file, 'link');
    for (const m of html.matchAll(/url\(([^)]+)\)/g)) {
        checkRef(m[1].replace(/^['"]|['"]$/g, ''), file, 'url');
    }
}

for (const file of fs.readdirSync(path.join(base, 'css')).filter((n) => n.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(base, 'css', file), 'utf8');
    for (const m of css.matchAll(/url\(([^)]+)\)/g)) {
        checkRef(m[1].replace(/^['"]|['"]$/g, ''), path.join('css', file), 'url');
    }
}

if (missing.length) {
    console.error(`Found ${missing.length} broken local reference(s):`);
    for (const line of missing) console.error(`  ${line}`);
    process.exitCode = 1;
} else {
    console.log(`Checked ${pages.length} pages; all local references resolve.`);
}
