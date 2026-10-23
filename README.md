# Thiệp cưới online · Bảo Phi & Thúy Linh

A static, single-page wedding invitation. Plain HTML, CSS and JS with no build step. It deploys to GitHub Pages, Netlify or Vercel as is.

```
index.html                 page skeleton (no copy to edit here, except the <head> meta tags)
config.js                  ALL content: names, dates, venues, photos, music, RSVP URL, VI/EN text
assets/css/style.css       design (colour and font tokens at the top, in :root)
assets/js/main.js          page logic: language, cover, events, countdown, gift, RSVP
assets/js/album.js         self-contained gallery + full-screen viewer
assets/js/sketches.js      hand-drawn line illustrations for the programme and gift section
assets/images/             hero.webp, og-preview.jpg, favicon.svg
assets/images/album/       album photos
assets/music/              background.mp3
assets/fonts/              optional self-hosted fonts (see "Fonts")
apps-script/Code.gs        Google Apps Script that writes RSVPs to a Google Sheet
```

Preview locally: run the command below in the project folder, then open http://localhost:8080.

```bash
python3 -m http.server 8080
```

Add `?lang=en` to the URL to open the English version directly.

---

## 1. Edit content

Every editable value is in `config.js`. Placeholders are marked `// TODO`.

| What | Where in `config.js` |
|---|---|
| Names, full names, son/daughter order, monogram letters | `couple` |
| Parents' names and addresses (Nhà trai / Nhà gái) | `family` |
| The reception: time, lunar date, venue, address, map link, dress code | `events` (one card; more objects add more cards, and the RSVP then asks which ones) |
| Evening programme: time, title, note, sketch | `program` (`[]` hides the section) |
| RSVP deadline and Apps Script URL | `rsvp` |
| Story milestones (`[]` hides the section) | `story` |
| Bank details and QR images (`[]` hides the section) | `gifts` |
| Every label, button and message in both languages | `text.vi` and `text.en` |
| Hashtag, default language, petals on/off | top level and `effects` |

Notes:
- Times use the Vietnam offset, e.g. `'2026-12-20T18:00:00+07:00'`. The page always shows Vietnam time, wherever the guest is.
- Lunar dates (`lunar`) are typed by hand. Check them against a lịch âm before printing the link.
- Map link: open the venue in Google Maps, tap Share, copy the link into `mapUrl`.
- Also update the `<title>`, `description` and `og:` tags at the top of `index.html`. Link previews read those tags before any JavaScript runs.

## 2. Photos

### Hero photo
Put the file in `assets/images/` and set `photos.hero: 'assets/images/hero.webp'`. An empty value shows the designed placeholder. A broken path also falls back to the placeholder. The frame is an arch at 3:4, so use a portrait photo.

### Album
1. Drop the file into `assets/images/album/`.
2. Add one line to `photos.album`:

```js
{ src: 'assets/images/album/01.webp', orientation: 'portrait', caption: { vi: 'Đà Lạt, 2023', en: 'Da Lat, 2023' } },
```

- `orientation` is `'portrait'` (3:4 tile) or `'landscape'` (3:2 tile, full row).
- Two portraits in a row share a row. A portrait on its own is centred.
- `caption` is optional (`null`). It shows in the full-screen viewer.
- The album handles 1 to about 30 photos. Order in the array is the order on the page.
- While `album` is empty, 8 placeholder tiles appear using `placeholderLayout`. A photo that fails to load turns into a placeholder.
- Redesigning the gallery touches only `assets/js/album.js` and the `.album` / `.lightbox` rules in `style.css`.

### Image prep guide

| Image | Size | Format | Target weight |
|---|---|---|---|
| Album photo | 1600 px on the long edge | WebP, quality 75 to 80 | 150 to 300 KB |
| Hero photo | 1200 × 1600 (3:4) | WebP, quality 80 | under 300 KB |
| Link preview `og-preview.jpg` | exactly 1200 × 630 | JPG (Zalo and Facebook handle JPG best) | under 300 KB |
| Bank QR | 600 × 600 | PNG or WebP | under 80 KB |

Compress with https://squoosh.app: drop the image, choose WebP, set the long edge under "Resize", download. Album images load lazily, so only the first screen counts toward the initial load.

## 3. Sketches

The programme and gift section use line drawings from `assets/js/sketches.js`: `lanterns`, `tea`, `cake`, `toast`, `scooter`, `envelope`. Each item in `program` picks one with `sketch:`. The strokes draw themselves when the block scrolls into view. To use an illustrator's artwork, replace a function's return value in `sketches.js` with SVG strokes (`fill="none"`, `stroke="currentColor"`); the draw-on effect works on any path.

## 3b. Opening curtain

The cover is two CSS fabric drapes. On "Mở thiệp" they gather to a tie-back (1.7 s), the hero fades in behind them, then they slide off (1.1 s). Timings and the tie-back shape are in the "Cover: fabric curtain" block of `assets/js/main.js`. With reduced motion turned on, the cover fades out instead.

## 3c. Music

Put an MP3 at `assets/music/background.mp3` (or change `music.src`). Keep it under about 3 MB: 128 kbps, trimmed to 2 to 3 minutes. It loops. It starts when the guest taps "Mở thiệp", because browsers block sound before a tap. If the file is missing, the music button hides itself. Set `music.autoplayOnOpen: false` to start muted with the button shown. Use music you have the right to play.

## 4. RSVP → Google Sheets

### Set up the sheet and script
1. Create a new Google Sheet, for example "RSVP Đám cưới".
2. Optional: rename the first tab to `RSVP` and add these headers in row 1: `Thời gian | Họ tên | Tham dự | Số người | Nghi lễ | Khách của | Ăn uống | Lời nhắn`. The script creates the tab and headers itself if they are missing.
3. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste all of `apps-script/Code.gs`. Save.
4. **Deploy → New deployment**. Click the gear, choose **Web app**.
   - Description: `RSVP`
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, then **Authorize access** and allow it with your Google account. Google shows an "unverified app" warning because the script is yours: click Advanced → Go to project.
6. Copy the **Web app URL** (it ends in `/exec`).
7. Paste it into `config.js`:

```js
rsvp: { endpoint: 'https://script.google.com/macros/s/AKfy.../exec', ... }
```

8. Test: open the `/exec` URL in a browser. It should say `RSVP endpoint is running.` Then submit the form on the site and check that a row appears.

While `endpoint` is empty, the form runs in preview mode: it shows the thank-you screen and saves nothing. A small note under the button says so.

**After editing `Code.gs`**, deploy again with **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the same URL. "New deployment" creates a new URL.

### How the request works
The form sends a URL-encoded POST to the `/exec` URL. That is a "simple" request, so the browser sends no CORS preflight. Apps Script reads the fields from `e.parameter` and replies with JSON. The page shows an error with a retry option when the network fails or the script returns an error.

Spam protection: a hidden `hp_check` field (honeypot, `display: none` so browser autofill skips it). Bots that fill it get a fake success and nothing is stored. The script also strips leading `= + - @` so text cannot become a spreadsheet formula.

### Duplicates
Guests may submit more than once, for example to change their answer. Every submission is a new row. To find the latest answer per guest:
- Sort by `Họ tên`, then `Thời gian`. The last row of each person is the current answer.
- The form asks for no phone number, so two guests with the same name look like one guest. Read their messages and `Khách của` to tell them apart.
- To count only latest answers, add a sheet with this formula in A1:

```
=LET(d, SORT(FILTER(RSVP!A2:H, RSVP!B2:B<>""), 1, FALSE), SORTN(d, 9^9, 2, LOWER(TRIM(INDEX(d,,2))), TRUE))
```

It sorts newest first, then keeps the first row for each name. Sum column D of that sheet for the head count.

## 5. Deploy

The site is static. Fill in your real domain in the `og:url` and `og:image` tags first: link previews need an absolute `https://` image URL.

- **GitHub Pages**: push the folder to a repository. Settings → Pages → Source: `Deploy from a branch`, branch `main`, folder `/ (root)`. The URL is `https://<user>.github.io/<repo>/`.
- **Netlify**: drag the folder onto https://app.netlify.com/drop, or connect the repository with no build command and publish directory `.`.
- **Vercel**: `vercel` in the folder, or import the repository with framework preset "Other" and no build command.

### Link preview refresh
Zalo and Facebook cache previews. After changing `og-preview.jpg`, use https://developers.facebook.com/tools/debug/ and click "Scrape Again". For Zalo, add a query to the shared link, for example `?v=2`, to force a fresh preview.

## 6. Fonts

Fonts come from Google Fonts, all with Vietnamese support:
- Cormorant Garamond for headings and names
- Great Vibes for the script names
- Be Vietnam Pro for body text
- Noto Serif TC for the 囍 glyph only (downloaded as a single-character subset)

To self-host, download the WOFF2 files (for example from https://gwfh.mranftl.com), put them in `assets/fonts/`, replace the two Google Fonts `<link>` tags with `@font-face` rules, and keep the font names unchanged.

## 7. Checks before sending the link

- Replace every `// TODO` in `config.js`. The `og:` tags in `index.html` point to https://phi-linh.xyz.
- Open the link from Zalo, Messenger and iOS Safari on a real phone.
- Submit one test RSVP, then delete the test row from the sheet.
- Paste the link into a Zalo chat with yourself to check the preview card.
