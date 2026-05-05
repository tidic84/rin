const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "banlist.json");

function load() {
    try {
        const raw = fs.readFileSync(FILE, "utf8");
        const data = JSON.parse(raw);
        if (!Array.isArray(data.words)) data.words = [];
        if (typeof data.muteDuration !== "number") data.muteDuration = 30000;
        return data;
    } catch {
        const fresh = { muteDuration: 30000, words: [] };
        save(fresh);
        return fresh;
    }
}

function save(data) {
    fs.writeFileSync(FILE, JSON.stringify(data, null, 4));
}

function normalize(word) {
    return word
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim();
}

function add(word) {
    const data = load();
    const normalized = normalize(word);
    if (!normalized) return { ok: false, reason: "empty" };
    if (data.words.includes(normalized)) return { ok: false, reason: "exists" };
    data.words.push(normalized);
    save(data);
    return { ok: true, word: normalized };
}

function remove(word) {
    const data = load();
    const normalized = normalize(word);
    const idx = data.words.indexOf(normalized);
    if (idx === -1) return { ok: false, reason: "missing" };
    data.words.splice(idx, 1);
    save(data);
    return { ok: true, word: normalized };
}

function list() {
    return load().words.slice();
}

function getMuteDuration() {
    return load().muteDuration;
}

function setMuteDuration(ms) {
    const data = load();
    data.muteDuration = ms;
    save(data);
    return ms;
}

function findMatch(content) {
    if (!content) return null;
    const data = load();
    if (data.words.length === 0) return null;
    const haystack = normalize(content);
    const tokens = haystack.split(/[^a-z0-9]+/).filter(Boolean);
    const tokenSet = new Set(tokens);
    for (const banned of data.words) {
        if (tokenSet.has(banned)) return banned;
        if (banned.includes(" ") && haystack.includes(banned)) return banned;
    }
    return null;
}

module.exports = {
    load,
    save,
    add,
    remove,
    list,
    getMuteDuration,
    setMuteDuration,
    findMatch,
    normalize,
};
