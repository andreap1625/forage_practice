# Kudos Feature — Project Specifications
**Product:** Datacom Internal Web App
**Feature:** Peer Recognition (Kudos)
**Version:** 1.0
**Status:** Approved
**Last updated:** May 2026

---

## 1. Overview

The Kudos feature allows Datacom employees to send short, public messages of appreciation to their colleagues. All kudos appear in a shared team feed visible on the main dashboard. A moderation layer managed by team managers and admins ensures content appropriateness before and after publication.

---

## 2. User Stories

| # | As a… | I want to… | So that… |
|---|--------|------------|----------|
| 1 | Employee | Select a colleague from a list and send them a kudos | I can publicly recognize their work |
| 2 | Employee | Choose a tone emoji for my kudos | My message carries the right energy |
| 3 | Employee | Write a short appreciation message (up to 200 characters) | I can be specific about what they did well |
| 4 | Employee | See all recently submitted kudos in a public feed | I can celebrate the team's achievements |
| 5 | Employee | Like a kudos in the feed | I can amplify recognition I agree with |
| 6 | Employee | Report a kudos I find inappropriate | I can flag content for moderator review |
| 7 | Manager / Admin | Review flagged kudos in a moderation queue | I can approve or remove problematic content |
| 8 | Manager / Admin | Search and filter all kudos by status | I can audit the full history of recognition |
| 9 | Manager / Admin | Manage a keyword filter list | I can automatically flag sensitive language |
| 10 | Manager / Admin | Toggle moderation rules on or off | I can adapt the policy without a code change |

---

## 3. Features

### 3.1 Give Kudos Form

- **Recipient selector** — dropdown listing all team members with their name and role
- **Tone picker** — 6 emoji options: 🚀 Crushing it, 💡 Brilliant idea, 🤝 Team player, 🎯 On target, 🌟 Star work, 💪 Resilient
- **Message field** — free text, minimum 10 characters, maximum 200 characters, with live character counter
- **Submit button** — disabled until recipient, tone, and a valid message are all provided; activates in Datacom red when ready
- **Toast notification** — confirmation banner shown for 2.8 seconds after successful submission

### 3.2 Public Kudos Feed

- Displays all kudos in reverse-chronological order (newest first)
- Each card shows: sender, recipient, tone emoji, message, timestamp, and a like button
- New kudos submitted in the current session receive a **NEW** ribbon badge
- Like / unlike toggle per kudo (heart reaction)
- Live kudos count badge in the feed header
- Empty state message when no kudos exist yet
- Scrollable, max height 490px with custom scrollbar

### 3.3 Moderation Panel (Managers & Admins only)

#### 3.3.1 Review Queue
- Lists all kudos with status `flagged` (hidden from the public feed)
- Each entry shows the flag reason: **keyword match** or **user reports** (with count)
- Moderator actions: **Approve** (restores visibility) or **Remove** (deletes permanently)
- Summary stats: pending review count, approved today, removed in last 7 days, average review time

#### 3.3.2 All Kudos
- Full searchable list of every kudo regardless of status
- Filter by status: All / Visible / Hidden / Flagged
- Inline keyword highlighting on any matching terms
- Moderator can manually **Hide** or **Restore** any individual kudo

#### 3.3.3 Keyword Filters
- Displays all active blocked keywords/phrases as removable tags
- Add new keywords via text input (Enter key or Add button)
- Real-time preview of existing kudos that match current keyword list, with highlights
- Keyword matching is case-insensitive

#### 3.3.4 Rules & Settings
- Toggle-based configuration for all moderation behaviours (no code change needed)
- See Section 5 for the full rules list

---

## 4. Moderation Policy

| Decision | Value |
|----------|-------|
| Moderation model | Post-publish (kudos go live immediately, then reviewed if flagged) |
| Auto-hide trigger | Keyword match OR reaching the report threshold |
| Visibility when flagged | **Hidden** from public feed until reviewed |
| Who can moderate | Team managers + admins |
| Author notification | Configurable via rule toggle (default: ON) |

---

## 5. Moderation Rules

| Rule | Default | Description |
|------|---------|-------------|
| Auto-hide on user report | **ON** | Hides a kudo once it receives 2+ reports; queued for moderator review |
| Keyword auto-flag | **ON** | Flags kudos matching the keyword list; moderator reviews before restoring |
| Manager approval for cross-team kudos | OFF | Kudos sent outside sender's direct team require manager sign-off |
| Notify author when hidden | **ON** | Sends the author an in-app notification with the reason their kudo was hidden |
| Repeat offender auto-review | OFF | All kudos from users with 3+ removed posts in 30 days go to the queue automatically |

---

## 6. Design & Branding

### 6.1 Colour Palette (Datacom Brand)

| Token | Hex | Usage |
|-------|-----|-------|
| Red (primary) | `#E4002B` | CTA buttons, active states, accents, flagged borders |
| Red Dark | `#B50022` | Hover states on red elements |
| Red Light | `#FCEEF1` | Backgrounds for red-tinted UI (avatars, badges) |
| Black | `#1A1A1A` | Top bar, feed header, primary text |
| Grey 90 | `#2D2D2D` | Secondary dark surfaces |
| Grey 60 | `#666666` | Secondary text, labels |
| Grey 30 | `#B3B3B3` | Placeholder text, timestamps, inactive icons |
| Grey 10 | `#F2F2F2` | Card backgrounds, inputs |
| Grey 05 | `#F8F8F8` | Page background |
| White | `#FFFFFF` | Card surfaces |
| Green | `#00875A` | "Visible" status, approve actions |
| Green BG | `#E3F5EE` | Backgrounds for green-tinted UI |
| Amber | `#B45300` | "Hidden" status, keyword highlights |
| Amber BG | `#FFF3E0` | Backgrounds for amber-tinted UI |

### 6.2 Typography
- **Font family:** `'Segoe UI', system-ui, sans-serif`
- **Heading:** 28px / 700 weight
- **Card titles:** 13px / 600 weight / uppercase / 0.04em letter-spacing
- **Body text:** 14px / 400 weight
- **Labels & badges:** 11–12px / 600 weight

### 6.3 Layout
- Max content width: **1100px**, centered with `2rem` horizontal padding
- Two-column grid on the main Kudos page: form (1fr) + feed (1.6fr)
- Top navigation bar: 56px height, black background
- Hero banner: dark gradient (black → grey → deep red) with decorative circles

### 6.4 Component Styles
- **Border radius:** 8px (inputs, buttons), 10px (feed cards), 12px (main cards)
- **Box shadow:** `0 1px 4px rgba(0,0,0,0.06)` on cards
- **Flagged cards:** left border `3px solid #E4002B`
- **Toggle switch:** red when ON, grey when OFF, white pill indicator

---

## 7. File Structure

```
src/
├── KudosFeed.jsx         # Kudos form + public feed (employee view)
├── ModerationPanel.jsx   # Full moderation UI (manager/admin view)
└── App.jsx               # Root — imports and renders both components
```

### 7.1 App.jsx integration

```jsx
import KudosFeed from './KudosFeed';
import ModerationPanel from './ModerationPanel';

function App() {
  return (
    <div>
      <KudosFeed />
      <hr style={{ margin: "2rem 0", border: "none", borderTop: "0.5px solid #E0E0E0" }} />
      <ModerationPanel />
    </div>
  );
}

export default App;
```

---

## 8. Data Models

### Kudo object
```js
{
  id:       number,       // unique identifier (Date.now() for client-generated)
  from:     Person,       // sender
  to:       Person,       // recipient
  emoji:    string,       // tone emoji character
  msg:      string,       // message body (10–200 chars)
  status:   "visible" | "flagged" | "hidden",
  reason:   "keyword" | "report" | null,
  reports:  number,       // count of user reports received
  time:     string,       // display timestamp (e.g. "2h ago")
  likes:    number,
  liked:    boolean,      // current user's like state
}
```

### Person object
```js
{
  name:     string,   // full display name
  initials: string,   // 2-character avatar label
  color:    string,   // avatar background hex
  text:     string,   // avatar text hex
  role:     string,   // job title / department
}
```

---

## 9. Validation Rules

| Field | Rule |
|-------|------|
| Recipient | Required — must select from list |
| Tone emoji | Required — must select one of the 6 options |
| Message | Required — minimum 10 characters, maximum 200 characters |
| Submit button | Disabled until all three fields pass validation |
| Keyword input | Trimmed, lowercased, deduplicated before saving |

---

## 10. Backend Integration Notes

The current implementation uses in-memory state (React `useState`). For production, replace with:

| Action | Endpoint (suggested) |
|--------|----------------------|
| Load kudos feed | `GET /api/kudos?limit=20&status=visible` |
| Submit a kudo | `POST /api/kudos` |
| Like / unlike | `PATCH /api/kudos/:id/like` |
| Report a kudo | `POST /api/kudos/:id/report` |
| Load moderation queue | `GET /api/kudos?status=flagged` |
| Approve a kudo | `PATCH /api/kudos/:id` `{ status: "visible" }` |
| Remove a kudo | `DELETE /api/kudos/:id` |
| Get keyword list | `GET /api/moderation/keywords` |
| Update keyword list | `PUT /api/moderation/keywords` |
| Get/update rules | `GET/PUT /api/moderation/rules` |
| Load all users | `GET /api/users` |

Authentication: use the session token of the logged-in user to populate the `from` field automatically and to gate access to the moderation panel by role (`manager` or `admin`).

---

## 11. Open Decisions

| # | Question | Recommendation |
|---|----------|----------------|
| 1 | What is the exact report threshold to auto-hide? | Currently hardcoded at **2 reports** — consider making it a configurable rule setting |
| 2 | Should authors see a specific reason or a generic "your kudo was reviewed" message? | Specific reason is more respectful; confirm with HR/legal |
| 3 | Do managers moderate kudos from their own direct reports? | Conflict of interest risk — recommend routing those to admins only |
| 4 | Should kudos have an expiry / archive policy? | Not in scope for v1 — revisit at v1.1 |
| 5 | Real-time feed updates? | Not in v1 — polling every 30s or manual refresh is acceptable initially |
