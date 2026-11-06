const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  for (const f of [1, 2, 3]) { await p.goto('file://' + path.join(__dirname, 'frames.html') + '?frame=' + f, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: path.join(__dirname, `frame-${f}.jpg`), type: 'jpeg', quality: 88 }); }
  await b.close(); })();
