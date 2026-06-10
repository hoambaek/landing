#!/usr/bin/env node
/**
 * J1950(jj.ttf) 글리프 검증 유틸
 *
 * 용도: J1950 서체로 렌더되는 카피에 폰트에 없는 한글 글리프가 섞이는 것을 방지.
 * 사용:
 *   node scripts/check-glyphs.mjs "검사할 문자열"   — 문자열 직접 검사
 *   node scripts/check-glyphs.mjs --scan            — src/ 내 font-jj 사용 추정 카피 상수 스캔
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const FONT_PATH = new URL("../public/jj.ttf", import.meta.url).pathname;

/* ── 최소 TTF cmap 파서 (format 4 / 12) ── */
function loadCmap(path) {
  const buf = readFileSync(path);
  const numTables = buf.readUInt16BE(4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    if (buf.toString("ascii", rec, rec + 4) === "cmap") {
      cmapOffset = buf.readUInt32BE(rec + 8);
      break;
    }
  }
  if (cmapOffset < 0) throw new Error("cmap 테이블 없음");

  const subtableCount = buf.readUInt16BE(cmapOffset + 2);
  let best = null; // {format, offset} — format 12 > 4 우선
  for (let i = 0; i < subtableCount; i++) {
    const rec = cmapOffset + 4 + i * 8;
    const platformID = buf.readUInt16BE(rec);
    const encodingID = buf.readUInt16BE(rec + 2);
    const offset = cmapOffset + buf.readUInt32BE(rec + 4);
    const format = buf.readUInt16BE(offset);
    const isUnicode =
      platformID === 0 || (platformID === 3 && (encodingID === 1 || encodingID === 10));
    if (!isUnicode) continue;
    if (format === 12) best = { format, offset };
    else if (format === 4 && (!best || best.format !== 12)) best = { format, offset };
  }
  if (!best) throw new Error("유니코드 cmap 서브테이블 없음");

  // glyph ID까지 계산해 .notdef(0) 매핑은 누락으로 처리
  const codepoints = new Set();
  if (best.format === 4) {
    const o = best.offset;
    const segCountX2 = buf.readUInt16BE(o + 6);
    const segCount = segCountX2 / 2;
    const endBase = o + 14;
    const startBase = endBase + segCountX2 + 2;
    const deltaBase = startBase + segCountX2;
    const rangeBase = deltaBase + segCountX2;
    for (let s = 0; s < segCount; s++) {
      const end = buf.readUInt16BE(endBase + s * 2);
      const start = buf.readUInt16BE(startBase + s * 2);
      const idDelta = buf.readInt16BE(deltaBase + s * 2);
      const idRangeOffset = buf.readUInt16BE(rangeBase + s * 2);
      if (start === 0xffff) continue;
      for (let c = start; c <= end; c++) {
        let glyph;
        if (idRangeOffset === 0) {
          glyph = (c + idDelta) & 0xffff;
        } else {
          const addr = rangeBase + s * 2 + idRangeOffset + (c - start) * 2;
          if (addr + 1 >= buf.length) continue;
          glyph = buf.readUInt16BE(addr);
          if (glyph !== 0) glyph = (glyph + idDelta) & 0xffff;
        }
        if (glyph !== 0) codepoints.add(c);
      }
    }
  } else {
    const o = best.offset;
    const nGroups = buf.readUInt32BE(o + 12);
    for (let g = 0; g < nGroups; g++) {
      const rec = o + 16 + g * 12;
      const start = buf.readUInt32BE(rec);
      const end = buf.readUInt32BE(rec + 4);
      const startGlyph = buf.readUInt32BE(rec + 8);
      for (let c = start; c <= end; c++) {
        if (startGlyph + (c - start) !== 0) codepoints.add(c);
      }
    }
  }
  return codepoints;
}

function missingChars(text, cmap) {
  const missing = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp <= 0x20) continue; // 공백·제어문자 제외
    if (!cmap.has(cp)) missing.add(ch);
  }
  return [...missing];
}

/* ── src/ 스캔: J1950 카피가 들어갈 수 있는 한글 문자열 리터럴 전수 검사 ── */
function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (/\.(tsx?|css)$/.test(name)) files.push(p);
  }
  return files;
}

const cmap = loadCmap(FONT_PATH);
const args = process.argv.slice(2);

if (args[0] === "--scan") {
  const root = new URL("../src", import.meta.url).pathname;
  let bad = 0;
  for (const file of walk(root)) {
    const text = readFileSync(file, "utf8");
    // font-jj 사용 파일만 검사 (클래스/변수 참조 존재 시)
    if (!/font-jj/.test(text)) continue;
    const lines = text.split("\n");
    lines.forEach((line, i) => {
      const hangul = line.match(/[가-힣]+/g);
      if (!hangul) return;
      const miss = missingChars(hangul.join(""), cmap);
      if (miss.length) {
        bad++;
        console.log(`${file.replace(root, "src")}:${i + 1}  누락 글리프: ${miss.join(" ")}`);
        console.log(`  > ${line.trim().slice(0, 80)}`);
      }
    });
  }
  if (bad === 0) console.log("✓ J1950 사용 파일 내 누락 글리프 없음");
  process.exit(bad ? 1 : 0);
} else if (args[0]) {
  const miss = missingChars(args.join(" "), cmap);
  if (miss.length) {
    console.log(`✗ 누락 글리프 (${miss.length}): ${miss.join(" ")}`);
    process.exit(1);
  }
  console.log("✓ 모든 글리프 존재");
} else {
  console.log('사용법: node scripts/check-glyphs.mjs "문자열"  |  --scan');
}
