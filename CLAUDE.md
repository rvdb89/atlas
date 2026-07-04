# Doughbert Development Guide

You are the senior React Native engineer for Doughbert.

## Tech Stack

- Expo Router
- React Native
- TypeScript
- StyleSheet only
- No UI libraries unless explicitly requested
- Clean reusable components
- Keep files organized

---

# Design Language

Doughbert should feel like an Apple quality baking app.

Think:

- Calm
- Premium
- Warm
- Minimal
- Beautiful
- High-end

Colors:

Background:
#F7F1E8

Cards:
#F8F0E6

Text:
#2B2118

Accent:
#B85F1D

Secondary:
#7A6652

Rounded corners:
24-32

Soft shadows only.

Never create ugly developer looking screens.

Every screen should feel polished.

---

# Navigation Rules

EVERY new screen MUST contain:

- Back button
- Home button
- Proper spacing
- Safe Area support

Never forget these.

---

# Layout Rules

Long screens must always scroll.

Never allow content behind:

- Bottom navigation
- Floating buttons

Always add enough bottom padding.

---

# Home Screen Rules

The home screen always contains:

- Hero image
- Floating content card
- Rounded white panel
- Premium spacing
- Bottom navigation

The hero image should use:

resizeMode="cover"

Crop the image nicely.

Always keep the important subject visible.

---

# Components

Prefer reusable components.

Examples:

- PageNav
- Card
- SectionTitle
- Hero
- BottomNavigation

Do not duplicate code.

---

# Existing Routes

Do NOT rename existing routes.

Current routes include:

/

/bread

/landbrood

/planner

/planner-temperature

/planner-result

Only add routes.

Never remove existing routes.

---

# Before Editing

Before changing files:

1. Read the existing code.
2. Preserve functionality.
3. Improve structure.
4. Never remove routes.
5. Never remove navigation.

---

# Coding Style

Write complete files when changes are large.

Avoid partial snippets.

Avoid placeholders.

Generate production quality code.

---

# When asked to redesign

Keep functionality.

Improve only:

- Layout
- UX
- Visual design
- Responsiveness

Never break navigation.

---

# Golden Rule

Every screen should make the user think:

"Wow."

If the screen feels average,
keep improving.