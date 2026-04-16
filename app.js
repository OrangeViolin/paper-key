// 纸上键 Web Demo v0.2
// - 40+ 款音色（合成）
// - 真实素材优先：assets/{id}/1.mp3 存在则用真实样本
// - 猫叫升级为多段 FM 合成

const SOUNDS = [
  // ① 经典机械键盘
  { id: 'hhkb',      name: 'HHKB 静电容', icon: '⌨', free: true },
  { id: 'blue',      name: '青轴 click',  icon: '🔵', free: true },
  { id: 'brown',     name: '茶轴',        icon: '🟤', free: true },
  { id: 'red',       name: '红轴',        icon: '🔴', free: true },
  { id: 'topre',     name: 'Topre 胶碗',  icon: '⚪', free: true },
  // ② 东方意境
  { id: 'muyu',      name: '木鱼',        icon: '🪵', free: true },
  { id: 'xuan',      name: '毛笔宣纸',    icon: '🖌', free: false },
  { id: 'qin',       name: '古琴',        icon: '🎋', free: false },
  { id: 'qing',      name: '磬',          icon: '🔔', free: false },
  { id: 'zhujian',   name: '竹简翻页',    icon: '📜', free: false },
  // ③ 节气
  { id: 'qingming',  name: '清明雨',      icon: '🌧', free: true },
  { id: 'dongzhi',   name: '冬至雪',      icon: '❄', free: false },
  { id: 'lichun',    name: '立春春雷',    icon: '⛈', free: false },
  // ④ 老物件
  { id: 'typewriter',name: '打字机',      icon: '📜', free: true },
  { id: 'abacus',    name: '算盘',        icon: '🧮', free: false },
  { id: 'nokia',     name: '诺基亚 3310', icon: '📱', free: false },
  { id: 'cash',      name: '收银机',      icon: '💰', free: false },
  // ⑤ 自然
  { id: 'drop',      name: '水滴',        icon: '💧', free: true },
  { id: 'bubble',    name: '气泡',        icon: '🫧', free: false },
  { id: 'wave',      name: '浪花',        icon: '🌊', free: false },
  // ⑥ 🐾 动物（搞怪核心）
  { id: 'cat',       name: '猫叫 喵',     icon: '🐱', free: false },
  { id: 'kitten',    name: '奶猫 呼噜',   icon: '🐈', free: false },
  { id: 'dog',       name: '狗吠 汪',     icon: '🐶', free: false },
  { id: 'bird',      name: '鸟鸣',        icon: '🐦', free: false },
  { id: 'chicken',   name: '咯咯哒',      icon: '🐔', free: false },
  { id: 'cow',       name: '奶牛哞',      icon: '🐄', free: false },
  { id: 'sheep',     name: '羊咩',        icon: '🐑', free: false },
  { id: 'frog',      name: '青蛙呱',      icon: '🐸', free: false },
  // ⑦ 😈 恶搞
  { id: 'fart',      name: '屁声',        icon: '💨', free: false },
  { id: 'burp',      name: '打嗝',        icon: '🫧', free: false },
  { id: 'sigh',      name: '叹气',        icon: '😮‍💨', free: false },
  { id: 'tongue',    name: '弹舌',        icon: '👅', free: false },
  // ⑧ ⚔ 武侠二次元
  { id: 'sword',     name: '拔剑',        icon: '⚔', free: false },
  { id: 'swish',     name: '刀光',        icon: '🗡', free: false },
  { id: 'pop',       name: '啵~',         icon: '💖', free: false },
  { id: 'sparkle',   name: '闪亮',        icon: '✨', free: false },
  // ⑨ 🎮 游戏
  { id: 'coin',      name: '马里奥金币',  icon: '🪙', free: false },
  { id: 'laser',     name: '激光',        icon: '🔫', free: false },
  { id: 'jump',      name: '跳跃',        icon: '🆙', free: false },
  { id: 'coin2',     name: '塞尔达宝箱',  icon: '📦', free: false },
  // ⑩ ⚡ 赛博
  { id: 'glitch',    name: '故障音',      icon: '⚡', free: false },
  { id: 'hologram',  name: '全息',        icon: '✨', free: false },
  { id: 'matrix',    name: 'Matrix 雨',   icon: '🟩', free: false },
  // ⑪ 🏢 日常
  { id: 'elevator',  name: '电梯叮',      icon: '🛗', free: false },
  { id: 'microwave', name: '微波炉叮',    icon: '🔔', free: false },
  { id: 'horn',      name: '汽车喇叭',    icon: '🚗', free: false },
  { id: 'stapler',   name: '订书机',      icon: '📎', free: false },
  // ⑫ 🍟 吃喝
  { id: 'chew',      name: '吃薯片',      icon: '🍟', free: false },
  { id: 'sip',       name: '喝水咕咚',    icon: '🥤', free: false },
  { id: 'canopen',   name: '开易拉罐',    icon: '🥫', free: false },
];

const state = {
  audioCtx: null,
  currentSound: 'hhkb',
  charCount: 0,
  combo: 0,
  lastKeyTime: 0,
  keyTimes: [],
  focusTimer: null,
  focusEnd: 0,
  sampleCache: {},       // 真实素材缓存
  sampleAvailable: {},   // 每个 id 是否有真实素材（true/false/undefined=未探测）
};

const ensureAudio = () => {
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
  return state.audioCtx;
};

// ===== 真实素材加载器 =====
// 约定：assets/{id}/1.mp3, 2.mp3, ... 存在则随机播放之。
// 没有素材就自动降级到合成。
const probeSample = async (id) => {
  if (state.sampleAvailable[id] !== undefined) return state.sampleAvailable[id];
  const urls = [1, 2, 3].map(i => `../assets/${id}/${i}.mp3`);
  const found = [];
  for (const url of urls) {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      if (r.ok) found.push(url);
    } catch (_) {}
  }
  if (found.length) {
    state.sampleCache[id] = await Promise.all(found.map(async (u) => {
      const ab = await (await fetch(u)).arrayBuffer();
      return await state.audioCtx.decodeAudioData(ab);
    }));
    state.sampleAvailable[id] = true;
  } else {
    state.sampleAvailable[id] = false;
  }
  return state.sampleAvailable[id];
};

const playSample = (ctx, id, t) => {
  const buffers = state.sampleCache[id];
  if (!buffers || !buffers.length) return false;
  const src = ctx.createBufferSource();
  src.buffer = buffers[Math.floor(Math.random() * buffers.length)];
  const g = ctx.createGain(); g.gain.value = 0.8;
  src.connect(g).connect(ctx.destination);
  src.start(t);
  return true;
};

// ===== 合成工具 =====
const noiseBuf = (ctx, dur, envPower = 3) => {
  const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, envPower);
  }
  return buf;
};
const noiseSrc = (ctx, dur, envPower) => {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf(ctx, dur, envPower); return s;
};
const gainEnv = (ctx, t, peak, dur, attack = 0) => {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack + 0.002);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  return g;
};

// ===== 合成器 =====
const synths = {
  hhkb: (ctx, t, isSpace) => {
    const n = noiseSrc(ctx, 0.05, 3);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = isSpace ? 800 : 2000; f.Q.value = 2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.08);
  },
  blue: (ctx, t, isSpace) => {
    synths.hhkb(ctx, t, isSpace);
    const o = ctx.createOscillator(); o.frequency.value = isSpace ? 1500 : 3500;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.15, t + 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    o.connect(g).connect(ctx.destination); o.start(t + 0.01); o.stop(t + 0.05);
  },
  brown: (ctx, t, isSpace) => {
    const n = noiseSrc(ctx, 0.08, 2);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = isSpace ? 1200 : 2500;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.1);
  },
  red: (ctx, t, isSpace) => {
    const n = noiseSrc(ctx, 0.04, 4);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = isSpace ? 900 : 1800;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.06);
  },
  topre: (ctx, t, isSpace) => {
    const n = noiseSrc(ctx, 0.06, 2.5);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = isSpace ? 600 : 1400;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.45, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.09);
  },

  muyu: (ctx, t, isSpace) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    const base = isSpace ? 180 : 280;
    o.frequency.setValueAtTime(base * 1.5, t); o.frequency.exponentialRampToValueAtTime(base, t + 0.02);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.25);
  },
  xuan: (ctx, t, isSpace) => {
    const dur = isSpace ? 0.18 : 0.12;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const env = Math.sin((i / d.length) * Math.PI);
      d[i] = (Math.random() * 2 - 1) * env * 0.5;
    }
    const n = ctx.createBufferSource(); n.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1500;
    const g = ctx.createGain(); g.gain.value = 0.25;
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + dur);
  },
  qin: (ctx, t) => {
    const pentatonic = [220, 247, 277, 330, 370];
    const o = ctx.createOscillator(); o.type = 'triangle';
    o.frequency.value = pentatonic[Math.floor(Math.random() * pentatonic.length)];
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.01, t); g.gain.exponentialRampToValueAtTime(0.4, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 1.3);
  },
  qing: (ctx, t) => {
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    [880, 880 * 2.7].forEach(f => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      o.connect(g); o.start(t); o.stop(t + 1.5);
    });
    g.connect(ctx.destination);
  },
  zhujian: (ctx, t) => {
    const n = noiseSrc(ctx, 0.25, 1);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3500; f.Q.value = 1;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.05);
    g.gain.linearRampToValueAtTime(0.001, t + 0.25);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.25);
  },

  qingming: (ctx, t) => {
    const n = noiseSrc(ctx, 0.15, 1);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 3;
    const g = ctx.createGain(); g.gain.value = 0.5;
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.15);
  },
  dongzhi: (ctx, t) => {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.sin(i * 0.5) * 0.4;
    const n = ctx.createBufferSource(); n.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500;
    const g = ctx.createGain(); g.gain.value = 0.6;
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.1);
  },
  lichun: (ctx, t) => {
    const n = noiseSrc(ctx, 0.6, 0.5);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 200;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.6);
  },

  typewriter: (ctx, t, isSpace, isEnter) => {
    if (isEnter) {
      const o = ctx.createOscillator(); o.frequency.value = 1760; o.type = 'sine';
      const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.6);
      return;
    }
    synths.brown(ctx, t, isSpace);
    const o = ctx.createOscillator(); o.frequency.value = 220 + Math.random() * 60; o.type = 'square';
    const g = ctx.createGain(); g.gain.setValueAtTime(0.08, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.05);
  },
  abacus: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.value = 300 + Math.random() * 200;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.08);
  },
  nokia: (ctx, t) => {
    const freqs = [1760, 1318];
    freqs.forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, t + i * 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.04);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.05); o.stop(t + i * 0.05 + 0.05);
    });
  },
  cash: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = 1200;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
    // 算盘珠响
    synths.abacus(ctx, t + 0.05);
  },

  drop: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(1200, t); o.frequency.exponentialRampToValueAtTime(200, t + 0.15);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
  },
  bubble: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(200, t); o.frequency.exponentialRampToValueAtTime(1500, t + 0.12);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.15);
  },
  wave: (ctx, t) => {
    const n = noiseSrc(ctx, 0.4, 0.5);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 400; f.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.3, t + 0.1);
    g.gain.linearRampToValueAtTime(0.001, t + 0.4);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.4);
  },

  // ===== 动物（重点打磨）=====
  // 猫叫 "喵"：两段 FM 合成 + 共振峰
  cat: (ctx, t) => {
    const dur = 0.35;
    const base = 550 + Math.random() * 80; // 基频小范围随机
    // 主振荡器
    const carrier = ctx.createOscillator(); carrier.type = 'sawtooth';
    const mod = ctx.createOscillator(); mod.frequency.value = 7; // 颤音
    const modGain = ctx.createGain(); modGain.gain.value = 25;
    mod.connect(modGain).connect(carrier.frequency);
    // "mi-ao" 频率曲线：上升 → 高点 → 下降
    carrier.frequency.setValueAtTime(base * 0.7, t);
    carrier.frequency.linearRampToValueAtTime(base * 1.3, t + 0.12);
    carrier.frequency.linearRampToValueAtTime(base * 0.8, t + dur);
    // 共振峰滤波（模拟元音）
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 900; f1.Q.value = 8;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1800; f2.Q.value = 10;
    const mix = ctx.createGain(); mix.gain.value = 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.45, t + 0.05);
    g.gain.linearRampToValueAtTime(0.35, t + 0.2);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    carrier.connect(f1).connect(mix);
    carrier.connect(f2).connect(mix);
    mix.connect(g).connect(ctx.destination);
    carrier.start(t); carrier.stop(t + dur + 0.05);
    mod.start(t); mod.stop(t + dur + 0.05);
  },
  kitten: (ctx, t) => {
    // 奶猫呼噜：低频粗糙振动
    const n = noiseSrc(ctx, 0.5, 0);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 200;
    const trem = ctx.createOscillator(); trem.frequency.value = 25;
    const tremG = ctx.createGain(); tremG.gain.value = 0.3;
    const g = ctx.createGain(); g.gain.value = 0.5;
    trem.connect(tremG).connect(g.gain);
    n.connect(f).connect(g).connect(ctx.destination);
    n.start(t); n.stop(t + 0.5); trem.start(t); trem.stop(t + 0.5);
  },
  dog: (ctx, t) => {
    // 狗吠：快速两声 "汪汪"
    const bark = (when) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth';
      o.frequency.setValueAtTime(250, when);
      o.frequency.linearRampToValueAtTime(180, when + 0.1);
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 800; f.Q.value = 5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, when);
      g.gain.linearRampToValueAtTime(0.5, when + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
      o.connect(f).connect(g).connect(ctx.destination);
      o.start(when); o.stop(when + 0.13);
    };
    bark(t);
  },
  bird: (ctx, t) => {
    // 鸟鸣：快速颤动的高频
    const o = ctx.createOscillator(); o.type = 'sine';
    const base = 2200 + Math.random() * 400;
    o.frequency.setValueAtTime(base, t);
    o.frequency.linearRampToValueAtTime(base * 1.3, t + 0.04);
    o.frequency.linearRampToValueAtTime(base, t + 0.08);
    o.frequency.linearRampToValueAtTime(base * 1.2, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.15);
  },
  chicken: (ctx, t) => {
    // 咯咯哒：三段阶梯
    [800, 700, 600].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fq;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 5;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.3, t + i * 0.08); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.07);
      o.connect(f).connect(g).connect(ctx.destination);
      o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.08);
    });
  },
  cow: (ctx, t) => {
    // 哞：低频长音
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(150, t);
    o.frequency.linearRampToValueAtTime(110, t + 0.4);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.4, t + 0.1);
    g.gain.linearRampToValueAtTime(0.001, t + 0.5);
    o.connect(f).connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.5);
  },
  sheep: (ctx, t) => {
    // 羊咩：颤抖的中频
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 380;
    const vib = ctx.createOscillator(); vib.frequency.value = 12;
    const vibG = ctx.createGain(); vibG.gain.value = 15;
    vib.connect(vibG).connect(o.frequency);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 700; f.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.35, t + 0.05);
    g.gain.linearRampToValueAtTime(0.001, t + 0.4);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.4); vib.start(t); vib.stop(t + 0.4);
  },
  frog: (ctx, t) => {
    // 青蛙呱：粗糙低频脉冲
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(180, t);
    o.frequency.linearRampToValueAtTime(130, t + 0.15);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(f).connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
  },

  // ===== 恶搞 =====
  fart: (ctx, t) => {
    const dur = 0.25 + Math.random() * 0.15;
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(80 + Math.random() * 40, t);
    o.frequency.linearRampToValueAtTime(50, t + dur);
    const wobble = ctx.createOscillator(); wobble.frequency.value = 20 + Math.random() * 30;
    const wobG = ctx.createGain(); wobG.gain.value = 15;
    wobble.connect(wobG).connect(o.frequency);
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 300;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(f).connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur); wobble.start(t); wobble.stop(t + dur);
  },
  burp: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(120, t);
    o.frequency.linearRampToValueAtTime(80, t + 0.15);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 300; f.Q.value = 4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.45, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(f).connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.16);
  },
  sigh: (ctx, t) => {
    const n = noiseSrc(ctx, 0.4, 0.5);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 2;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.25, t + 0.1);
    g.gain.linearRampToValueAtTime(0.001, t + 0.4);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.4);
  },
  tongue: (ctx, t) => {
    synths.hhkb(ctx, t, false);
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(2000, t); o.frequency.exponentialRampToValueAtTime(500, t + 0.05);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.06);
  },

  // ===== 武侠二次元 =====
  sword: (ctx, t) => {
    const n = noiseSrc(ctx, 0.3, 0.8);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 4000; f.Q.value = 4;
    f.frequency.linearRampToValueAtTime(8000, t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.35, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.3);
  },
  swish: (ctx, t) => {
    const n = noiseSrc(ctx, 0.12, 1);
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.12);
  },
  pop: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(300, t); o.frequency.exponentialRampToValueAtTime(2000, t + 0.03);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.08);
  },
  sparkle: (ctx, t) => {
    [2637, 3136, 3951].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, t + i * 0.04); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.15);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.04); o.stop(t + i * 0.04 + 0.15);
    });
  },

  // ===== 游戏 =====
  coin: (ctx, t) => {
    [988, 1319].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, t + i * 0.06); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.08);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.06); o.stop(t + i * 0.06 + 0.08);
    });
  },
  laser: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(200, t + 0.1);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.1);
  },
  jump: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.setValueAtTime(300, t); o.frequency.linearRampToValueAtTime(900, t + 0.15);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.2, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.15);
  },
  coin2: (ctx, t) => {
    // 塞尔达宝箱的经典上行
    [523, 659, 784, 1047].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.15, t + i * 0.1); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.15);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.15);
    });
  },

  // ===== 赛博 =====
  glitch: (ctx, t) => {
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator();
      o.type = ['square', 'sawtooth', 'triangle'][i];
      o.frequency.value = 300 + Math.random() * 2000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.1, t + i * 0.01); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.01 + 0.03);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.01); o.stop(t + i * 0.01 + 0.03);
    }
  },
  hologram: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sine';
    const base = 800 + Math.random() * 400;
    o.frequency.setValueAtTime(base, t); o.frequency.linearRampToValueAtTime(base * 1.5, t + 0.08);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.2);
  },
  matrix: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.value = 100 + Math.random() * 400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.15, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.06);
  },

  // ===== 日常 =====
  elevator: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = 1568;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.5);
  },
  microwave: (ctx, t) => {
    [1200, 1400, 1200].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.2, t + i * 0.15); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.15 + 0.12);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.13);
    });
  },
  horn: (ctx, t) => {
    const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 400;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t); g.gain.linearRampToValueAtTime(0.4, t + 0.02);
    g.gain.linearRampToValueAtTime(0.001, t + 0.3);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.3);
  },
  stapler: (ctx, t) => {
    synths.red(ctx, t, false);
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.value = 800; const g = ctx.createGain();
    g.gain.setValueAtTime(0.12, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    o.connect(g).connect(ctx.destination); o.start(t + 0.02); o.stop(t + 0.06);
  },

  // ===== 吃喝 =====
  chew: (ctx, t) => {
    const n = noiseSrc(ctx, 0.12, 1.5);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2500; f.Q.value = 2;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.4, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t); n.stop(t + 0.13);
  },
  sip: (ctx, t) => {
    // 咕咚：三段低频
    [150, 120, 100].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.4, t + i * 0.08); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.08);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.08); o.stop(t + i * 0.08 + 0.08);
    });
  },
  canopen: (ctx, t) => {
    // 咔哒 + 嘶嘶气泡
    synths.blue(ctx, t, false);
    const n = noiseSrc(ctx, 0.5, 0.3);
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 3000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t + 0.05); g.gain.linearRampToValueAtTime(0.2, t + 0.1);
    g.gain.linearRampToValueAtTime(0.001, t + 0.5);
    n.connect(f).connect(g).connect(ctx.destination); n.start(t + 0.05); n.stop(t + 0.5);
  },
};

// 彩蛋
const eggs = {
  sighBig: (ctx, t) => synths.sigh(ctx, t),
  chime: (ctx, t) => {
    [523, 659, 784].forEach((fq, i) => {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.2, t + i * 0.1); g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.5);
      o.connect(g).connect(ctx.destination); o.start(t + i * 0.1); o.stop(t + i * 0.1 + 0.5);
    });
  },
};

const showToast = (msg) => {
  const t = document.querySelector('.toast') || (() => {
    const el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); return el;
  })();
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1600);
};

const renderSounds = () => {
  const grid = document.getElementById('soundGrid');
  grid.innerHTML = SOUNDS.map(s => `
    <div class="sound-card ${s.id === state.currentSound ? 'active' : ''} ${s.free ? '' : 'locked'}"
         data-id="${s.id}" data-free="${s.free}">
      <span class="icon">${s.icon}</span>${s.name}
    </div>
  `).join('');
  grid.querySelectorAll('.sound-card').forEach(el => {
    el.onclick = async () => {
      const id = el.dataset.id;
      const free = el.dataset.free === 'true';
      if (!free) showToast('该音色 ¥3 · Demo 已解锁试听');
      state.currentSound = id;
      document.getElementById('currentSound').textContent = SOUNDS.find(s => s.id === id).name;
      renderSounds();
      const ctx = ensureAudio();
      // 优先检测真实素材
      await probeSample(id);
      if (!playSample(ctx, id, ctx.currentTime)) {
        (synths[id] || synths.hhkb)(ctx, ctx.currentTime, false, false);
      }
    };
  });
};

document.addEventListener('keydown', (e) => {
  const ctx = ensureAudio();
  const now = ctx.currentTime;
  const isSpace = e.code === 'Space';
  const isEnter = e.code === 'Enter';
  const isBackspace = e.code === 'Backspace';
  if (['Control', 'Meta', 'Alt', 'Shift', 'CapsLock', 'Tab'].includes(e.key)) return;

  if (isBackspace) {
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    o.frequency.setValueAtTime(300, now); o.frequency.exponentialRampToValueAtTime(100, now + 0.08);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.15, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    o.connect(g).connect(ctx.destination); o.start(now); o.stop(now + 0.08);
  } else {
    const id = state.currentSound;
    if (!playSample(ctx, id, now)) {
      (synths[id] || synths.hhkb)(ctx, now, isSpace, isEnter);
    }
  }

  const dt = performance.now() - state.lastKeyTime;
  state.combo = dt < 800 ? state.combo + 1 : 1;
  state.lastKeyTime = performance.now();

  if (state.combo === 10) { eggs.sighBig(ctx, now + 0.05); showToast('⌇ 啊—— 你打得好快'); }
  if (state.combo === 50) { eggs.chime(ctx, now + 0.05); showToast('⚔ 键盘侠出征！'); }
  if (state.combo === 100) showToast('🔥 连击 100 · 解锁「狂热模式」');

  if (e.key.length === 1) {
    state.charCount++;
    document.getElementById('charCount').textContent = state.charCount;
    state.keyTimes.push(performance.now());
    state.keyTimes = state.keyTimes.filter(t => performance.now() - t < 60000);
    document.getElementById('wpm').textContent = Math.round(state.keyTimes.length / 5);
  }
  document.getElementById('combo').textContent = state.combo;
});

document.getElementById('zenMode').onchange = (e) => {
  if (e.target.checked) {
    const m = new Date().getMonth() + 1;
    state.currentSound = m >= 10 || m <= 2 ? 'dongzhi' : 'qingming';
    document.getElementById('currentSound').textContent = SOUNDS.find(s => s.id === state.currentSound).name;
    showToast('禅意模式 · 节气音色已匹配');
    renderSounds();
  }
};

document.getElementById('focusMode').onchange = (e) => {
  const timer = document.getElementById('timer');
  if (e.target.checked) {
    timer.classList.remove('hidden');
    state.focusEnd = Date.now() + 25 * 60 * 1000;
    state.focusTimer = setInterval(() => {
      const left = state.focusEnd - Date.now();
      if (left <= 0) {
        clearInterval(state.focusTimer);
        timer.textContent = '专注完成 · 磬';
        eggs.chime(ensureAudio(), ensureAudio().currentTime);
        return;
      }
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      timer.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    }, 500);
  } else {
    clearInterval(state.focusTimer);
    timer.classList.add('hidden');
  }
};

renderSounds();

// 收款码弹窗
const qrModal = document.getElementById('qrModal');
document.getElementById('btnWechat')?.addEventListener('click', () => qrModal.hidden = false);
document.getElementById('qrClose')?.addEventListener('click', () => qrModal.hidden = true);
qrModal?.querySelector('.qr-mask')?.addEventListener('click', () => qrModal.hidden = true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') qrModal.hidden = true; });

// 赞助卡片点击 → 也弹收款码
document.querySelectorAll('.support-card').forEach(el => {
  el.addEventListener('click', () => qrModal.hidden = false);
});

console.log(`%c纸上键 v0.2 · ${SOUNDS.length} 款音色 · 真实素材可放 assets/{id}/1.mp3`, 'color:#1A3328;font-weight:600');
