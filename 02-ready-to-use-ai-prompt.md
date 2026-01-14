# Ready-to-Use AI Website Prompt

You are a senior web designer and frontend developer.

Your task:
Create a **minimal, premium personal website** using **vanilla HTML, CSS and a small amount of JavaScript**.
No frameworks. No backend. Static website.

## Input Data (JSON)
The following JSON represents the user's answers. Build the site strictly based on this data.

---

### Design Rules
- Clean layout
- Responsive
- Modern typography
- Accessible contrast
- Elegant spacing
- One-page layout unless blog is selected

### Content Rules
- Write human, natural text
- Do not sound robotic
- Adapt tone based on `contentTone`
- Emphasize `highlights`
- Respect `targetAudience`

### Functional Rules
- CTA must be clearly visible
- If `cvDownload` is true, include a download button
- If `hasPhoto` is false, use initials-based avatar
- If multiple languages exist, structure content cleanly

### Output Required
Return:
1. index.html
2. style.css
3. script.js (minimal, only if needed)

Do NOT explain the code.
Return only the files.
