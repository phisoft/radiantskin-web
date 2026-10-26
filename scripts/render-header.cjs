// Run after editing js/header.js: node scripts/render-header.cjs
// Check only (exit 1 if stale): node scripts/render-header.cjs --check
// Publish navigation in the initial HTML so crawlers need no JavaScript.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const source = fs.readFileSync(path.join(base, 'js/header.js'), 'utf8');
const files = ['', 'product', 'treatment'].flatMap(dir =>
    fs.readdirSync(path.join(base, dir))
        .filter(name => name.endsWith('.html'))
        .map(name => path.join(dir, name))
);
const pending = [];
for (const file of files) {
    const filename = path.join(base, file);
    const html = fs.readFileSync(filename, 'utf8');
    if (!html.includes('id="site-header"')) continue;
    const pattern = /(<div id="site-header" data-root="([^"]*)" data-active="([^"]*)">)[\s\S]*?<\/div>(?=\s*(?:<!-- Shared Header|<!-- Static header end -->))/;
    const match = html.match(pattern);
    if (!match) throw new Error(`Missing header boundary in ${file}`);
    const host = {
        innerHTML: '',
        getAttribute: name => name === 'data-root' ? match[2] : match[3],
        querySelector: () => null,
        querySelectorAll: () => []
    };
    vm.runInNewContext(source, {
        document: { getElementById: () => host, readyState: 'complete' }
    });
    const header = host.innerHTML.replace(
        new RegExp(`class="nav-item nav-link" data-nav="${match[3]}"`),
        `class="nav-item nav-link active" data-nav="${match[3]}"`
    );
    const result = html.replace(pattern, () => `${match[1]}\n${header}\n</div>`);
    if (result !== html) pending.push([filename, result]);
}

if (checkOnly) {
    if (pending.length) {
        console.error(`Header is stale in ${pending.length} page(s):`);
        for (const [filename] of pending) console.error(`  ${path.relative(base, filename)}`);
        console.error('Run: node scripts/render-header.cjs');
        process.exitCode = 1;
    } else {
        console.log('Header is up to date.');
    }
} else {
    for (const [filename, result] of pending) fs.writeFileSync(filename, result);
    console.log(`Rendered navigation in ${pending.length} pages.`);
}
