---
version: alpha
name: Muse de Marée
description: A champagne brand that records the sea's time — sea-aged in Korea's Namhae at 30 m. Editorial minimalism with an Ocean Glass register.
colors:
  primary: "#312E2A"
  secondary: "#B89868"
  tertiary: "#CCAD7B"
  neutral: "#E8E5E1"
  background: "#E8E5E1"
  abyssal-black: "#0A0908"
  inkwell-navy: "#0D0B09"
  tidal-charcoal: "#141110"
  circle-bg: "#0A0D12"
  limestone: "#C4BFBB"
  tidal-sand: "#E8E5E1"
  damp-sand: "#DDDAD5"
  warm-ivory: "#ECEAE6"
  handmade-paper: "#E3E0DC"
  bone-paper: "#F5F1E8"
  ink: "#312E2A"
  seafoam-white: "#F1EFEB"
  brass: "#CCAD7B"
  brass-muted: "#B89868"
  placeholder-mute: "#9B9388"
  data-temp: "#E8C8A0"
  data-current: "#A8C4B8"
  data-direction: "#B8A8C4"
  data-wave-height: "#8CB8D0"
  data-wave-period: "#C4B8A0"
  data-pressure: "#D0A8A8"
typography:
  display-lg:
    fontFamily: Cormorant Garamond
    fontSize: 64px
    fontWeight: "300"
    lineHeight: 68px
    letterSpacing: -0.01em
  display-md:
    fontFamily: Cormorant Garamond
    fontSize: 40px
    fontWeight: "300"
    lineHeight: 46px
    letterSpacing: -0.01em
  title-cuvee:
    fontFamily: Cormorant Garamond
    fontSize: 22px
    fontWeight: "400"
    lineHeight: 26px
  body-lg:
    fontFamily: Noto Sans KR
    fontSize: 18px
    fontWeight: "300"
    lineHeight: 34px
  body-md:
    fontFamily: Noto Sans KR
    fontSize: 16px
    fontWeight: "300"
    lineHeight: 28px
  eyebrow:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 14px
    letterSpacing: 0.22em
  label-mono:
    fontFamily: DM Mono
    fontSize: 10px
    fontWeight: "400"
    lineHeight: 12px
    letterSpacing: 0.2em
  signature:
    fontFamily: Mrs Saint Delafield
    fontSize: 22px
    fontWeight: "400"
    lineHeight: 24px
rounded:
  DEFAULT: 0px
  sm: 2px
  pill: 100px
  full: 9999px
spacing:
  unit: 8px
  tight: 12px
  field-gap: 14px
  card-gap: 24px
  block: 56px
  section: 120px
components:
  cta-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.seafoam-white}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.DEFAULT}"
    padding: 18px 28px
  cta-secondary:
    textColor: "{colors.ink}"
    typography: "{typography.label-mono}"
    rounded: "{rounded.DEFAULT}"
  input-underline:
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.DEFAULT}"
    padding: 0 0 14px
  field-label:
    textColor: "{colors.brass-muted}"
    typography: "{typography.label-mono}"
  eyebrow-label:
    textColor: "{colors.brass}"
    typography: "{typography.eyebrow}"
  card-paper:
    backgroundColor: "{colors.limestone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
    padding: "{spacing.card-gap}"
  card-paper-elevated:
    backgroundColor: "{colors.limestone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.DEFAULT}"
  glass-label:
    backgroundColor: rgba(206, 199, 187, 0.30)
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
  data-node:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
  footer-dark:
    backgroundColor: "{colors.tidal-charcoal}"
    textColor: "{colors.seafoam-white}"
---

## Overview

**Editorial Minimalism × Ocean Glass.** Muse de Marée records the sea's time — champagne born in Champagne, sea-aged 30 m deep in Korea's Namhae. The visual identity is quiet, archival, and maritime, built on a deliberate duality of deep inky **ocean grounds** and pale **shore grounds** (weathered limestone, tidal sand, handmade paper). The register reads like a contemporary broadsheet crossed with a tide log: generous whitespace, print-like restraint, and **data treated as a footnote**, never a hero. One warm metallic accent — aged brass — carries every moment of emphasis. The emotional target is calm, mineral, and considered; heritage is implied through consistency, not ornament. Mood words: *tidal, mineral, inky, sun-bleached, archival.*

## Colors

The palette is a high-contrast neutral system split between dark sea and pale shore, with a single brass accent doing all the persuading.

- **Ink (#312E2A):** "Driftwood Ink" — primary text and dark CTAs on light grounds.
- **Seafoam White (#F1EFEB):** Text and marks on dark grounds.
- **Tidal Sand (#E8E5E1) / Limestone (#C4BFBB):** The two everyday light grounds — sand for pages, limestone for muted cards. Warm Ivory, Handmade Paper, and Bone Paper are warmer paper variants for editorial and partner surfaces.
- **Tidal Charcoal (#141110) / Abyssal Black (#0A0908):** Dark grounds for hero and footer; never pure black, always slightly warm.
- **Brass (#CCAD7B):** The sole accent — eyebrows, hairlines, active states. Brass Muted (#B89868) for small mono labels.
- **Data secondaries:** Sunlit Sand, Sea-Glass Green, Tideline Lilac, Shallow Blue, Kelp Beige, Coral Dust — low-chroma, used *only* for ocean data readouts, never for chrome.

## Typography

A four-voice system; pair deliberately, never substitute.

- **Display — Cormorant Garamond (Light):** Large editorial headings and French cuvée names. Light weight only, tight tracking at scale. Carries the elegance.
- **Body — Noto Sans KR:** Korean + Latin body at 16–18 px, weight 300, with generous line-height. Weight 400 only for emphasis.
- **Label / eyebrow / data — DM Mono:** UPPERCASE, small (10–12 px), wide tracking (0.2–0.22em), in brass or muted ink. The "instrument log" voice for section eyebrows, field labels, coordinates, and stats.
- **Signature — Mrs Saint Delafield:** Cursive, reserved for the brand line ("Written by the Sea"). Used once, sparingly.

Contrast comes from pairing heavy light-serif display against tiny tracked mono labels. Numbers stay quiet ("30m · 11.4°C"), set in mono, never enlarged for drama.

## Layout & Spacing

A content-driven editorial layout, not a rigid grid. Whitespace is a feature.

- **Rhythm:** An 8px base unit governs spacing; sections breathe with large vertical margins (~120px).
- **Asymmetry & scale contrast:** A large serif headline sits beside a small muted mono caption; placement follows content, not a 12-column straitjacket.
- **Cadence:** Alternate **full-bleed maritime imagery** with calm type-only blocks. Forms use a centered letter column on a warm ground.
- **Negative space:** Wide outer margins keep the composition airy and gallery-like.

## Elevation & Depth

Depth is mostly flat; elevation is rare and soft.

- **Default is flat.** Information lives directly on the surface — avoid boxing everything.
- **Paper lift:** When a panel must rise, use a single warm, diffused shadow only — `0 14px 34px rgba(49,46,42,0.12)` at rest, `0 20px 44px rgba(49,46,42,0.18)` when elevated. Never hard, dark, or high-contrast.
- **Ocean Glass:** Floating data chips and HUD labels use `backdrop-filter: blur(16px)` over a translucent limestone tint `rgba(206,199,187,0.30)` with a faint brass border `rgba(160,140,110,0.35)`.

## Shapes

The shape language is sharp and editorial.

- **Predominantly squared:** Default radius is `0` for a print/broadsheet feel; `2px` only on the rare small chip.
- **Circles for data:** Full-round nodes mark data points and timeline beats.
- **Pills are rare:** `100px` pills appear only as deliberate exceptions, never as a default button shape.
- **Hairlines:** Dividers are thin rules in brass or 8–12% ink.

## Components

### Calls to Action

Primary CTAs are a **solid dark block** (Ink) with a Seafoam White label set in tracked DM Mono, plus a thin `›` chevron, and **sharp corners**. Secondary CTAs are transparent with a 1px **Brass** hairline border. No gradients, no glow.

### Inputs & Forms

Inputs are **underline only** — transparent background, no box, a single bottom hairline. The label sits above in DM Mono (Brass Muted, tracked 0.2em); input text is Noto Sans 16px weight 300 in Ink; placeholder is muted (#9B9388). Focus removes the outline and brightens the rule.

### Cards & Surfaces

Cards keep sharp corners and prefer information on the surface over heavy containers. When elevated, they use the warm soft shadow only. Glass labels use the Ocean Glass treatment for floating data.

### Eyebrows & Data

Section eyebrows are short tracked mono strings in Brass. Stats and coordinates render quietly in DM Mono; one intense brass moment per view, everything else neutral.

## Do's and Don'ts

- **Do** let a single brass accent carry all emphasis; keep everything else neutral.
- **Do** render numbers and data quietly in mono — data is a footnote, not a headline.
- **Do** use sharp, squared edges and wide whitespace; lift surfaces only with warm, soft shadows.
- **Don't** use heavy or dark drop shadows, gradients, or glow — they break the matte, mineral calm.
- **Don't** enlarge numbers for drama or stack multiple accent colors.
- **Don't** lean on "luxury/exclusive/timeless" visual clichés or manufactured-scarcity ornament; restraint is the luxury.
