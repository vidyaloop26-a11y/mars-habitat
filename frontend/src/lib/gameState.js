// sessionStorage-backed state for Mars Habitat Engineering.
// All keys are prefixed `mhe_`.

import { CHARACTER_LIST } from "@/data/characters";
import { dmForSolStart } from "@/data/dmTriggers";

const K = {
  name: "mhe_intern_name",
  vars: "mhe_variables",
  log: "mhe_chat_log",
  feed: "mhe_feed",
  feedLastSeen: "mhe_feed_last_seen",
  dms: "mhe_dms",
  sceneIdx: "mhe_scene_idx",
  phase: "mhe_phase",
  status: "mhe_habitat_status",
  currentDay: "mhe_current_day",
  reflectionPrefix: "mhe_reflection_", // append day number
  decisionsPrefix: "mhe_decisions_",   // append day number
};

export const DEFAULT_VARS = {
  leadership: 50,
  engineering: 50,
  science: 50,
  power: 50,
  habitat_integrity: 50,
  crew_morale: 50,
  trust_elena: 50,
  trust_arjun: 50,
  trust_meera: 50,
  trust_leo: 50,
};

const STAT_KEYS = ["leadership", "engineering", "science", "power", "habitat_integrity", "crew_morale"];
const TRUST_KEYS = ["trust_elena", "trust_arjun", "trust_meera", "trust_leo"];

function readJSON(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export const gameState = {
  keys: K,
  statKeys: STAT_KEYS,
  trustKeys: TRUST_KEYS,

  getName: () => sessionStorage.getItem(K.name) || "",
  setName: (n) => sessionStorage.setItem(K.name, n),

  getCurrentDay: () => Number(sessionStorage.getItem(K.currentDay) || 1),
  setCurrentDay: (d) => sessionStorage.setItem(K.currentDay, String(d)),

  getVars: () => readJSON(K.vars, { ...DEFAULT_VARS }),
  setVars: (v) => writeJSON(K.vars, v),
  applyEffects(effects) {
    const cur = this.getVars();
    for (const key of Object.keys(effects)) {
      const next = (cur[key] ?? 50) + effects[key];
      cur[key] = Math.max(0, Math.min(100, next));
    }
    // Leadership: quiet drift — every decision nudges leadership +1
    cur.leadership = Math.max(0, Math.min(100, (cur.leadership ?? 50) + 1));
    this.setVars(cur);
    return cur;
  },

  getLog: () => readJSON(K.log, []),
  setLog: (log) => writeJSON(K.log, log),
  pushLog(entry) {
    const log = this.getLog();
    log.push({ ...entry, ts: Date.now() });
    this.setLog(log);
    return log;
  },

  // Habitat Dashboard feed with unread tracking.
  getFeed: () => readJSON(K.feed, []),
  pushFeed(item) {
    const feed = readJSON(K.feed, []);
    const key = `${item.category}|${item.headline}|${item.time}|${item.sol}`;
    if (feed.some((f) => `${f.category}|${f.headline}|${f.time}|${f.sol}` === key)) return feed;
    feed.unshift({ ...item, receivedAt: Date.now() });
    writeJSON(K.feed, feed);
    return feed;
  },
  getFeedUnreadCount() {
    const feed = readJSON(K.feed, []);
    const lastSeen = Number(sessionStorage.getItem(K.feedLastSeen) || 0);
    return feed.filter((f) => (f.receivedAt || 0) > lastSeen).length;
  },
  markFeedRead() {
    sessionStorage.setItem(K.feedLastSeen, String(Date.now()));
  },

  getDMs: () => readJSON(K.dms, { elena: [], arjun: [], meera: [], leo: [] }),
  pushDM(character, text) {
    const dms = this.getDMs();
    dms[character] = dms[character] || [];
    if (dms[character].some((m) => m.text === text)) return dms;
    dms[character].push({ text, unread: true, ts: Date.now() });
    writeJSON(K.dms, dms);
    return dms;
  },
  markRead(character) {
    const dms = this.getDMs();
    dms[character] = (dms[character] || []).map((m) => ({ ...m, unread: false }));
    writeJSON(K.dms, dms);
    return dms;
  },
  unreadCount() {
    const dms = this.getDMs();
    return Object.values(dms).reduce((n, arr) => n + arr.filter((m) => m.unread).length, 0);
  },

  getSceneIdx: () => Number(sessionStorage.getItem(K.sceneIdx) || 0),
  setSceneIdx: (i) => sessionStorage.setItem(K.sceneIdx, String(i)),

  getPhase: () => sessionStorage.getItem(K.phase) || "playing",
  setPhase: (p) => sessionStorage.setItem(K.phase, p),

  getStatus: () => sessionStorage.getItem(K.status) || "NOMINAL",
  setStatus: (s) => sessionStorage.setItem(K.status, s),

  getDecisions(day) {
    return readJSON(K.decisionsPrefix + (day || this.getCurrentDay()), {});
  },
  recordDecision(decisionId, optionId) {
    const day = this.getCurrentDay();
    const key = K.decisionsPrefix + day;
    const d = readJSON(key, {});
    d[decisionId] = optionId;
    writeJSON(key, d);
    return d;
  },

  getReflection: (day) => readJSON(K.reflectionPrefix + (day || 1), {}),
  saveReflection(day, answers) {
    writeJSON(K.reflectionPrefix + day, answers);
  },

  // Transition to a new day. Carries vars/feed/DMs forward; resets per-scene state.
  // Fires one trust-gated DM per crew member at the start of every Sol.
  startDay(dayNum) {
    this.setCurrentDay(dayNum);
    this.setSceneIdx(0);
    this.setPhase("playing");
    this.setLog([]);

    const vars = this.getVars();
    CHARACTER_LIST.forEach((id) => {
      const text = dmForSolStart(id, dayNum, vars[`trust_${id}`]);
      if (text) this.pushDM(id, text);
    });
  },

  resetAll() {
    // Remove all `mhe_` keys.
    const toDelete = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith("mhe_")) toDelete.push(k);
    }
    toDelete.forEach((k) => sessionStorage.removeItem(k));
  },
};
