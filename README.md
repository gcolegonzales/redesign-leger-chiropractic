# Leger Chiropractic — website redesign concept

A modern, single-page website concept for **Leger Chiropractic** — Dr. James Leger, D.C., in Prairieville, Louisiana. Built as an unsolicited design demo to show what a refreshed, 2026-ready site could look like.

## Why a redesign

The current site ([legerchiropractic.com](https://www.legerchiropractic.com/)) is a frozen ChiroMatrix template that reads as abandoned rather than actively run:

- A **dated image carousel** and generic **demo stock photography** date the look to roughly 2017.
- Content is **thin and templated** — the "testimonials" even reference a "Dr. Anderson," not Dr. Leger, a leftover from the template.
- No real photos of the doctor or office; a **pixelated logo banner** stands in.
- The layout is a stock frozen template with no clear conversion path.

For a welcoming, family-focused practice actively taking new patients (with a *free* first consultation), the site badly undersells the care behind the door. This concept fixes that.

## What this concept does — an objective upgrade

- **Warm clinical editorial** brand: deep pine green, warm sand/bone paper, and a terracotta-clay accent — calm, trustworthy, and distinctly *not* the old template.
- **Varied, editorial layouts** rather than a grid of look-alike cards: an asymmetric hero with a real-photo frame, numbered editorial "what we help with" rows, a split techniques band, a real 7-step first-visit **timeline**, and a 3-phase care progression.
- **All real practice data**, pulled from their live site:
  - Real services: back/neck pain, headaches, muscular tightness, spinal conditions, family & pediatric care.
  - The **actual first-visit process** (welcome → consultation → exam → X-rays → report of findings → treatment → wellness plan).
  - The **three phases of care** (Relief → Corrective → Wellness).
  - The **three real techniques** (Diversified, Gonstead, Activator).
  - **Real office hours**, address (17540 Airline Hwy, Ste F), and the **free new-patient consultation** offer.
  - Dr. Leger's real credential: Cleveland Chiropractic College, 1999; 25+ years serving Ascension Parish.
- **Money feature:** a real **"Request an appointment"** form (name, phone, email, reason, new/existing) plus **click-to-call** the real office number, **(225) 313-6996**, in the header, hero, contact, and CTA band.
- **Polished motion:** shrink-on-scroll header with animated nav underlines, a real mobile menu, and `IntersectionObserver` scroll reveals — all respecting `prefers-reduced-motion`.
- Responsive and mobile-first (360px → widescreen), accessible and semantic.

## Photos

The live site ships only generic template stock — **no real photo of Dr. Leger or the office could be pulled**. Those slots use a tasteful designed placeholder (marked `<!-- IMG-NEEDED -->`) and are wired to show real images the moment they're added. See **`assets/photos/DROP-PHOTOS-HERE.md`** — drop in `doctor.jpg`, `office.jpg`, and `adjustment.jpg` and they appear automatically.

## How to view

Open `index.html` in any modern browser (double-click it) — no build step, no dependencies, works offline.

## Tech

Plain HTML, CSS, and vanilla JavaScript. Inline SVG and CSS gradients only — no external images, frameworks, or CDNs (one optional Google Fonts link).

---

*Unsolicited redesign concept prepared as a pitch. Business name, address, phone, hours, services, and credentials are real, pulled from the practice's public site. It is not the practice's official website.*
