"""Synthesize the explainer's sound effects and lay them on a timeline.
usage: python3 sfx.py cues.json out.wav   (cues.json = {"sfx": [[name, t], ...], "dur": seconds})"""
import json, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def env(n, a=0.005, r=0.2):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / r)
    return e

def lowpass(x, k):  # one-pole, k in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc += k * (v - acc); y[i] = acc
    return y

def tone(f, dur, r, harm=((1, 1),)):
    n = int(dur * SR); t = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * f * m * t) for m, a in harm)
    return s * env(n, 0.003, r)

def pop():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 900 * np.exp(-t * 18) + 280
    return 0.55 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.002, 0.035)

def tap():
    n = int(0.09 * SR)
    click = lowpass(rng.standard_normal(n), 0.35) * env(n, 0.0005, 0.008)
    thump = np.sin(2 * np.pi * 140 * np.arange(n) / SR) * env(n, 0.001, 0.03)
    return 0.8 * click + 0.6 * thump

def chime():
    a = tone(1318.5, 1.6, 0.55, ((1, 1), (2.01, 0.25), (3.0, 0.1)))
    b = tone(1975.5, 1.4, 0.45, ((1, 1), (2.0, 0.2)))
    out = np.zeros(int(1.7 * SR)); out[:len(a)] += 0.35 * a; d = int(0.09 * SR); out[d:d + len(b)] += 0.3 * b
    return out

def ding():
    return 0.4 * tone(1567.98, 1.2, 0.35, ((1, 1), (2.0, 0.3), (3.01, 0.12)))

def whoosh(dur=0.7):
    n = int(dur * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    k = 0.02 + 0.25 * np.sin(np.pi * t / dur) ** 2
    y = np.empty(n); acc = 0.0
    for i in range(n):
        acc += k[i] * (nz[i] - acc); y[i] = acc
    return 0.9 * y * np.sin(np.pi * t / dur) ** 2

def swish():
    return 0.7 * whoosh(0.3)

def fall():
    out = whoosh(0.6) * 0.5
    n = int(0.07 * SR); d = int(0.75 * SR)
    pad = np.zeros(d + n); pad[:len(out)] += out
    pad[d:d + n] += 0.4 * lowpass(rng.standard_normal(n), 0.2) * env(n, 0.001, 0.02)
    return pad

def draw(dur=1.4):  # pencil on paper: band-limited noise with stroke rhythm
    n = int(dur * SR); t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    hp = nz - lowpass(nz, 0.08)
    strokes = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 3.1 * t + 0.6 * np.sin(2 * np.pi * 0.9 * t)))
    fade = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.25)
    return 0.12 * hp * strokes * fade

def ring():  # soft marimba-like two-note ring, twice
    note = lambda f: tone(f, 0.35, 0.12, ((1, 1), (4.0, 0.25)))
    out = np.zeros(int(1.4 * SR))
    for k, (f, at) in enumerate([(987.8, 0), (1318.5, 0.14), (987.8, 0.5), (1318.5, 0.64)]):
        s = note(f); i = int(at * SR); out[i:i + len(s)] += 0.35 * s
    return out

LIB = dict(pop=pop, tap=tap, chime=chime, ding=ding, whoosh=whoosh, swish=swish, fall=fall, draw=draw, ring=ring)

cues = json.load(open(sys.argv[1]))
total = np.zeros(int((cues['dur'] + 2) * SR))
for name, at in cues['sfx']:
    s = LIB[name](); i = int(at * SR); total[i:i + len(s)] += s[:len(total) - i]
total = np.clip(total, -1, 1)
with wave.open(sys.argv[2], 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((total * 32000).astype('<i2').tobytes())
print('sfx ok', len(cues['sfx']), 'cues')
