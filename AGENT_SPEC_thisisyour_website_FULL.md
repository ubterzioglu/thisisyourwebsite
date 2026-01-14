
# AGENT_SPEC — thisisyour.website
## Personal Website Quote Builder + Premium Lead Engine

THIS IS THE SINGLE SOURCE OF TRUTH.
DO NOT SIMPLIFY.
DO NOT OMIT.
DO NOT INTERPRET.
FOLLOW VERBATIM.

---

## 0) VISION

thisisyour.website is a premium, Gen‑Z friendly, conversion‑first system that:
- helps users understand what kind of personal website they need,
- removes uncertainty in under 2 minutes,
- generates a human‑readable project summary,
- produces high‑intent leads,
- replies within 24 hours with a tailored offer.

The system is intentionally:
- lightweight
- fast
- SEO + GEO optimized
- technology‑agnostic

---

## 1) TECHNOLOGY PARAMETERIZATION (MANDATORY)

### Runtime Parameters

TECH_STACK = jsx-next | vanilla  
DEPLOY_TARGET = vercel | netlify | static  
FORM_DELIVERY = email | api  
BRAND_MODE = surprise-me | user-provided-palette  

### Non‑negotiable Output

Regardless of parameters, the agent MUST deliver:
- Landing page
- 20-step wizard
- Editable summary page
- Submission success screen
- Email delivery (Phase 1)
- SEO + GEO compliance
- Mobile‑first UX
- Fast load, minimal JS

---

## 2) LANDING PAGE

### Visual Direction
- White dominant background
- Modern typography
- Spacious layout
- Subtle gradients or accents
- Micro-interactions only

If BRAND_MODE=surprise-me:
- Choose 1 bold accent color
- Choose 1 warm secondary color
- Define neutral grayscale
- Justify palette in comments

### Sections (Order is fixed)

1. Hero
   - Clear benefit-driven headline
   - “2 minutes”, “no commitment” reassurance
   - Primary CTA: Get your quote
   - Secondary CTA: See how it works

2. How It Works
   - Answer questions
   - Review summary
   - Get offer in 24h

3. What You Get
   - Personal website
   - SEO ready
   - Mobile-first
   - Clean and modern

4. Trust Signals
   - Reply within 24h
   - No spam

5. FAQ (schema-ready)

---

## 3) WIZARD SYSTEM

### Global UX Rules
- One question per screen
- Progress indicator (1/20)
- Back / Next
- Required fields visible
- Autosave answers
- Keyboard accessible

---

## 4) THE 20 QUESTIONS (CONTRACT)

Q1 Project Goal (single)
Q2 Domain owned (yes/no)
Q3 Website type (single)
Q4 Pages (multi)
Q5 Content readiness (single)
Q6 Copywriting help (yes/no)
Q7 Languages (multi)
Q8 Visual style (single)
Q9 Color preference (single)
Q10 Typography vibe (single)
Q11 Logo need (single)
Q12 Images (multi)
Q13 Features (multi)
Q14 Integrations (multi optional)
Q15 Mobile priority (single)
Q16 Deadline (single)
Q17 Maintenance (single)
Q18 Hosting (single)
Q19 Contact email (required)
Q20 Additional notes (long text)

Agent MUST implement exactly these 20.

---

## 5) PREMIUM CONVERSION FEATURES

### A) Instant Preview Templates
- Triggered by Q8
- Show 2–3 abstract template cards
- Selection influences summary only

<!-- UBT TODO: replace abstract previews with real templates later -->

### B) Real‑Time Complexity Meter
- Sticky indicator
- Updates live
- Shows Basic / Standard / Pro / Custom
- Optional non-binding price range

<!-- UBT TODO: decide if prices are public -->

### C) AI Content Starter Pack
Triggered if:
- Q5 = Not ready
- OR Q6 = Yes

Generate:
- About Me draft
- Services bullets
- 5 hero headline ideas

Read-only preview.
Included in summary + email.

<!-- UBT TODO: define which pricing tier includes this -->

### D) Multi‑Channel Contact
After email:
- Preferred contact method
- Email mandatory
- WhatsApp / Telegram optional

<!-- UBT TODO: confirm supported channels -->

### E) Social Proof Signals
- “Average response <24h”
- Optional request counter

<!-- UBT TODO: start static, later real analytics -->

---

## 6) SUMMARY PAGE

### Structure
1. Goals
2. Pages
3. Visual direction
4. Content status
5. Features
6. Timeline
7. Maintenance
8. Contact preference
9. Additional notes

### Behavior
- Fully editable
- Instant updates

---

## 7) EFFORT SCORE

Base = 10

Add:
- Multi-page +10
- Blog +12
- Copywriting +8
- Extra language +6
- Premium logo +6
- Stock/AI images +4
- Each feature +1 (max 10)
- ASAP deadline +6
- Maintenance +5

Labels:
- 10–18 Basic
- 19–30 Standard
- 31–45 Pro
- 46+ Custom

Used for:
- Live meter
- Summary headline
- Email subject

---

## 8) EMAIL DELIVERY

Subject:
New Quote Request — thisisyour.website — {Complexity}

Body:
- Contact info
- Complexity + score
- Visual choices
- Generated drafts
- Full answers
- Timestamp

Tone: professional, scannable.

---

## 9) SEO + GEO

SEO:
- Semantic HTML
- Meta tags
- OG/Twitter
- Sitemap + robots.txt

GEO:
- Clear service description
- Bullet deliverables
- Process steps
- FAQ schema
- Internal links

---

## 10) IMPLEMENTATION

### Vanilla
- HTML / CSS / JS
- Netlify Forms or Formspree

### JSX / Next
- App Router
- Client wizard
- Serverless email
- Metadata API

---

## 11) QUALITY GATES

- Lighthouse good
- Mobile UX excellent
- No heavy libs
- No dark patterns

---

## 12) DELIVERABLES

Agent must output:
1. Full codebase
2. README
3. SEO/GEO checklist
4. Extensibility notes

END OF DOCUMENT.
