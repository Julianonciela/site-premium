// usage: node render.cjs <916|169> stills t1,t2,...   |   node render.cjs <916|169> out.mp4 [fps]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
(async () => {
  const [fmt, mode, arg] = process.argv.slice(2);
  const wide = fmt === '169', W = wide ? 1920 : 1080, H = wide ? 1080 : 1920;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.error('PAGE ERROR', e.message));
  await p.goto('file://' + path.join(__dirname, 'index.html') + (wide ? '?f=169' : ''), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  if (mode === 'stills') {
    for (const t of arg.split(',').map(Number)) {
      await p.evaluate(t => render(t), t);
      await p.screenshot({ path: path.join(process.env.OUT || '.', `s${fmt}-${t}.jpg`), type: 'jpeg', quality: 80 });
    }
  } else if (mode === 'sfx') {
    console.log(JSON.stringify(await p.evaluate(() => ({ sfx: SFX, dur: DURATION }))));
  } else {
    const fps = Number(arg || 30), dur = await p.evaluate(() => DURATION), n = Math.round(dur * fps);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '19', '-preset', 'medium', mode], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) { await p.evaluate(t => render(t), i / fps); ff.stdin.write(await p.screenshot({ type: 'jpeg', quality: 92 })); }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
})();
