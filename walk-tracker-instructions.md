# Constellation Walks: project instructions

A single-file web app (`walk-tracker.html`) that turns every walk into a star. Walks are connected into a constellation, and each walk gets a glowing route and a photocard.

## The idea

You walk with a tracking app on your iPhone (the screen can be locked). Afterwards you export the walk as a GPX file and import it here. Each walk becomes:

1. A **route**, drawn as a glowing path
2. A **star** in that month's constellation, connected to the previous walk
3. A **photocard**: your photo with the route drawn inside it

## Pages

| Tab | What it holds |
|---|---|
| Home | Monthly constellation on top, then the walks of that month with Import and Add by hand. The route and stats appear in a popup card when you tap a star or a walk in the list |
| Photocards | Stack of cards, one per walk, with the route drawn inside each image |
| Progress | This month's goal, current and best streak, and the year in review |
| Settings | Three labelled groups: You (name, avatar, appearance), Walking (stride length, monthly goal), Data (Apple Health import, backup and restore). Test walks sit in a collapsed row at the bottom |

The header has an avatar button on the left (opens Settings) and a greeting with your name on the right. The navbar is a floating pill with a sliding highlight, sized like the iPhone default tab bar (49 pt tabs, 25 pt icons). There are four tabs: Home, Photocards, Progress, Settings. Tabs show only their icon; the name appears only on the selected tab.

## Design decisions

- **Route style:** stylized glowing path, no street map. It works anywhere and suits the constellation look.
- **Photocard:** the card is your photo, and the route is drawn inside the image.
- **Theme:** a dotted-gradient background (square halftone dots shaped into puffy clouds: dots grow in the dense core and shrink at the soft edges, and the clouds thin out toward the top), in light and dark versions. Settings has Auto, Light, and Dark. The dark version is a true black theme (pure black background, neutral greys, white and warm gold accents, no blue).
- **Data:** saved in the browser on your device. Walks live in localStorage, photos in IndexedDB. Clearing browser data erases both.

## Logging a walk

1. **Import GPX (main way):** track the walk in an app that works with the screen locked (Strava, AllTrails, or an Apple Watch Outdoor Walk), export a `.gpx` file, then tap **Import walk** and pick one or more files from the Files app.
2. **Add by hand:** tap **Add by hand** and enter the distance, when you finished, and optionally the minutes walked. A hand-added walk has a star and a card but no route.
3. **Test walk:** in Settings, **Add test walk** creates a made-up walk with a route so you can try the app. **Remove test walks** deletes them.

From a GPX file the app reads:

- **Distance:** summed from the cleaned GPS points
- **Time walked and finish time:** finish time is the last point timestamp (without timestamps, it falls back to the file's save date). Time walked is moving time: speed is judged over windows of at least 10 s and a window counts only if faster than 1 km/h, so auto-pauses and standing still are left out. If nothing counts as moving, it falls back to elapsed time
- **Route:** a cleaned and simplified copy of the path, kept small for storage (see GPS cleanup below)
- **Steps:** estimated as distance divided by your stride length (Settings, default 75 cm)

Importing the same walk twice is ignored.

## Constellation rules

- One star per walk.
- Stars in the same month are connected in the order walked.
- Star size and glow scale with distance.
- Each month is its own constellation, with arrows to browse months.
- Tapping a star opens a popup card with the walk's route and stats (close it with the × button, by tapping outside it, by dragging its top edge down, or with Esc; Delete this walk is inside it; the ‹ › arrows, a sideways swipe, or the arrow keys flip between the stars of that month without closing it), with a transition: the dashed ring glides to the star, light travels down its connections to the linked stars, a spark flies into the route card, and the route draws from that spark. Reduced-motion settings skip it.
- A star keeps its position, so the shape does not shuffle when you add walks.

## Photocards

- The newest walk is on top, with two more peeking out behind it.
- Swipe the top card left or right, or use the arrow buttons.
- **Add photo** accepts one or several photos, up to 6 per card. **Remove photo** deletes the one showing. With more than one photo, tap the bars at the top to flip between them.
- A card without a photo uses a night-sky background.
- Photos are shrunk to about 900 pixels before saving. They are stored in IndexedDB, so the old ~5 MB limit no longer applies. If the device itself has no room, the app tells you.
- Deleting a walk also deletes its photos.

## Known limits

- Browsers cannot read a phone's pedometer, so steps are estimates.
- A web app cannot track GPS when the phone screen is locked. That is why walks are tracked elsewhere and imported.
- Real street maps are not used, by design.
- Data lives only on the device and browser where you use the app. Backups are still manual (the reminder only nudges).

## Build stages

| Stage | Content | Status |
|---|---|---|
| 1 | Night-sky shell, sliding navbar, header, Settings | Done |
| 2 | GPX import, glowing route, distance, steps, time, finish time | Done |
| 3 | Monthly constellation | Done |
| 4 | Stacked photocards with the route inside the image, add and remove photos | Done |
| 5 | Add by hand, test walks, final polish | Done |

## Running it

- Open `walk-tracker.html` in a browser, or host the file on any static host (for example GitHub Pages).
- On iPhone, open it in Safari and use Share, then **Add to Home Screen** for an app-like launch.
- The font loads from Google Fonts. Without internet the app still works with a system font.

## Search (added)

- A round search button sits beside the floating navbar, separate from it. Tap it (or press `/` or Ctrl/Cmd+K) to open the search panel.
- Search by month (`nov`), weekday (`monday`), day, year, distance (`6.5`, `5 km`, `>5km`, `<3km`), `today`, `yesterday`, `week`, `month`, `photo`, `manual`, `test`. Words combine with AND.
- Tap a result to jump to that walk's month and open its card. Arrow keys move through results; Enter opens the first.

## Backup and restore (added)

Settings has **Export backup** (one JSON file with all walks and photos) and **Restore backup** (merges; walks already present are skipped; profile is restored only on a fresh install). It also shows roughly how full browser storage is.

## Logic fixes in this version

- A star's position is now stable: x from the day of the month, y from the walk's id, size from distance (all independent of other walks).
- Deleting a walk offers **Undo**. Failed saves (import, restore) now tell you and roll back.
- Saved data is validated on load, so a corrupted entry can no longer break the app.
- Import selects the newest imported walk. Swiping photocards no longer rebuilds Home. Future-dated hand entries are rejected.
- Text inputs are 16 px so iPhone Safari does not zoom in on focus.
- Removed an unused starfield routine that would have erased the dotted background if it had ever started.

## Sketched routes for hand-added walks (added)

Add by hand has a checkbox, **Add a sketched route (not real GPS)**, on by default. When on, the walk gets a decorative glowing route, stable for that walk, and its popup says "sketched route". Turn it off to keep a hand-added walk blank. Search finds them with `sketch`.

## Card and button polish (added)

- **Cards:** soft glass with a thin top highlight and a layered shadow; same treatment on the popup, search panel, navbar and search button. Dark mode has slightly stronger borders.
- **Buttons:** pill-shaped with a press-down effect. Primary (Import walks, Save walk) is solid; Cancel is quiet; Delete this walk has a soft red tint. Import, Add by hand and Add photo carry small icons.
- **Walk list:** rows have a chevron and a clearer selected state.
- All styling lives in the last CSS block ("polish"), so it is easy to tweak or remove.

## Edit a walk (added)

Open a walk (tap its star or list row) and tap **Edit**. You can change distance, finish time and minutes walked. Hand-added walks can also switch their sketched route on or off. The walk keeps its id, so re-importing the same GPX file is still ignored.

## Photo storage in IndexedDB (added)

- Photos are saved in an IndexedDB database (`cw-photos`, one entry per walk id). The walk list in localStorage no longer carries photos, so it stays small.
- **Migration:** on first load, photos already inside localStorage are copied to IndexedDB, and only after every copy succeeds are they removed from localStorage.
- **Fallback:** if IndexedDB is unavailable (some private modes), photos stay in localStorage as before.
- Deleting a walk deletes its photos, and Undo puts them back. Remove test walks clears theirs. Export backup still includes photos, and Restore writes them to IndexedDB.
- Add photo and Export backup ask you to wait a moment if photos are still loading at startup.

## Backup reminder (added)

A card at the top of Home asks for a backup when either:
- there is no backup yet and you have 3 or more real (non-test) walks, or
- the last backup is 14 or more days old and walks or photos have changed since.

**Back up now** downloads the backup file. **Remind me in a week** hides the card for 7 days. Settings shows the last backup date and how many photos are stored.

## Stats (added)

A **year in review** card sits on the Progress tab: total km, steps, km per walk, longest walk, best month, average pace (min per km), and a bar per month. Arrows switch between years that have walks. Test walks are counted, and the card says so. Pace counts only walks with a recorded time, and GPX and Apple Health imports both use moving time. Walks imported before task 8 keep their old time (it included pauses); re-import is ignored as a duplicate, so delete and re-import one to refresh it.

## Progress tab, monthly goal and streaks (moved)

- Home is now only the constellation and the walks list. The goal, streaks and year in review live on their own **Progress** tab (third tab in the navbar). The old Walks/Progress switch on Home is gone.
- **This month:** km walked against your goal with a progress bar, km to go and days left, then your current and best streak.
- **Year in review:** the stats described above.
- **Monthly goal:** set it in Settings under Walking (km, 0 turns it off), or tap **Set a monthly goal** on the Progress tab, which opens Settings with the field focused. It always tracks the real current month.
- **Streaks:** a streak is consecutive calendar days with at least one walk. The current streak stays alive if your last walk was yesterday, and resets after a full day without one. Test walks count, like in the stats.

## Apple Health import (added)

- **How:** on iPhone, Health, tap your picture, **Export All Health Data**, share `export.zip` to Files. Then Settings, **Import Apple Health export** (or the **Apple Health** button on Home) and pick the zip. A bare `export.xml` also works, but then there are no routes.
- **What it reads:** walking and hiking workouts from `export.xml` (distance from the workout, or from its distance statistics). Other workout types are ignored. Routes come from `workout-routes/*.gpx` in the zip, matched through each workout's route reference.
- **Time:** uses Apple's active duration, so pauses are not counted (this also covers the moving-time part of task 8 for these walks).
- **Range:** after scanning, a picker offers last 30 days, 3 months, 12 months or everything, with a walk count for each. It defaults to the biggest range of 300 walks or fewer. Walks with routes take more storage; if storage fills up, the import rolls back and says so.
- **Duplicates:** a walk is skipped if its id already exists (same route file imported as GPX before), or if an existing walk finished within 3 minutes with a similar distance.
- **Privacy:** the file is read in the browser. Nothing is uploaded. Large exports are streamed, not loaded into memory.
- **Limits:** needs a browser with `DecompressionStream` (Safari 16.4 or newer, current Chrome). Imported walks are tagged `hk`; search finds them with `health` or `apple`. A walk with no route says "No route was recorded for this walk."

## Layout tidy-up (added)

- **Home list:** shows only the walks of the month the constellation is on (it follows the ‹ › arrows). Older months are reached with the arrows or Search. The button row is one line: Import, Add by hand. Apple Health import lives only in Settings.
- **Settings:** six separate cards became labelled groups (You, Walking, Data) with thin dividers inside each card. Test walks are collapsed by default. Apple Health help text is shorter.
- **Rule for future work:** keep one primary action per screen, no wrapping button rows, and put rarely used tools in Settings or a collapsed row. CSS for this is the last block, "tidy".

## Share a photocard (added)

- A round share button sits at the bottom right of the top photocard on the Photocards tab.
- It draws the card to a 1080 x 1440 PNG: the photo showing (cropped to fill) or the night-sky background, the glowing route, the distance, date and steps. Hand-added walks without a route get no route line.
- On iPhone it opens the native share sheet (Messages, Instagram, Save Image, and so on). Where sharing files is not supported it downloads the PNG instead (file name `walk-YYYY-MM-DD.png`). In the artifact viewer downloads are blocked, so use the hosted or local file.
- The image always uses the white-to-gold route colours, even in light mode.

## GPS cleanup and route simplification (added)

Applies to every GPX import (and to the route files inside an Apple Health import). Code: `cleanPts` and `simplifyIdx` next to `parseGPX`.

- **Cleanup:** a point is dropped if it implies more than 12 m/s from the last kept point, or has a time that goes backwards. It is also dropped if it is a lone spike (goes out and straight back), or sits within 3 m of the last kept point (standing-still jitter). If 5 points in a row look like jumps, the track is assumed to have really moved and the cleanup restarts from there, so a bad first point cannot wipe out a walk.
- **Distance, time and route** all come from the cleaned points, so a spike no longer adds kilometres or squashes the route into a corner of the card.
- **Simplification:** Ramer-Douglas-Peucker replaces "every Nth point". Corners are kept and straight stretches are thinned. The tolerance starts at 0.3% of the route size and grows until at most 160 points remain.
- **Duplicates:** the walk id still uses the raw, uncleaned distance, so re-importing a file that was imported before this update is still ignored. The walk is not rebuilt (delete and re-import it to get the cleaned version).
- Walks already saved keep their old routes and distances.
- If cleanup would leave fewer than 2 points, the raw points are used.

## Offline use and install (added)

- **Files:** `walk-tracker.html`, `sw.js`, `manifest.webmanifest` and the four icons must sit in the same folder on an **https** host (GitHub Pages works) or on localhost. Opened from a file, or inside the artifact viewer, there is no service worker; the app works online as before and Settings says so.
- **Head tags:** the page links the manifest, `apple-touch-icon.png` and `icon-192.png`, and has the iOS standalone tags (title "Walks").
- **Service worker:** registered on load only where it can work. Pages are network first, so a new version arrives on the next online open and the cached copy is used offline. Fonts, icons and the manifest are cached first and refreshed in the background. The cache is named `cw-v3`; **bump this number in `sw.js` whenever the cached file list changes**.
- **Feedback:** a one-time toast "Ready to use offline" the first time it is cached, and a toast "You're offline. Everything still works." when the connection drops.
- **Settings, Data:** an "Offline and install" row shows the current state and the install steps.
- **Important on iPhone:** the app installed to the Home Screen gets its own storage, separate from Safari. Export a backup in Safari first, then Restore backup in the installed app.
- **Tested:** in headless Chromium on localhost the worker installed, the app files were cached, and the page reloaded offline. Not tested on a real iPhone.

## Miles option (added)

- **Where:** Settings, Walking, **Distance unit**: Kilometres or Miles. Default is kilometres. The choice is saved in the profile and included in backups (restored only on a fresh install, like the name).
- **How it works:** walks are always stored in km. Only what you see and type is converted, so switching back and forth never changes a walk. Code: `uN`, `dv`, `fd`, `fdu` next to `save()`.
- **What changes:** every distance (constellation, popup, walk list, photocard, shared image, year in review, goal) and the pace card (min per mi). Steps are unchanged (they use stride length in cm).
- **Monthly goal:** stored in km internally; the Settings field shows and accepts the chosen unit (decimals allowed, e.g. 25 or 12.5).
- **Add / edit by hand:** the distance field uses the chosen unit. Editing a walk and leaving the distance untouched keeps its exact stored value, so only changing the number changes it. Limit is 0.1 to 200 km (124 mi).
- **Search:** `5` or `>3` use the chosen unit; add `km` or `mi` (`5km`, `>3mi`, `5 miles`) to force one. The chips and placeholder follow the unit.
- Apple Health distances were already converted to km on import, so they work as before.

## Walk notes and tags (added)

- **Where:** open a walk and tap **Edit** (or **Add by hand**). The sheet has an optional **Note** (up to 280 characters) and **Tags** (comma separated, up to 5). Tags you already use appear as tap-to-add chips under the field.
- **Tags:** saved lowercase, letters, digits and hyphens only, up to 20 characters ("City Park" becomes `city-park`). Works for GPX, Apple Health, test and hand-added walks.
- **Shown:** the note and tags appear in the walk popup under the finish time. Search results show a walk's tags and a "note" marker.
- **Search:** `#dog` or `dog` finds a tag; any word in a note is searchable; `tagged` and `note` find walks that have one. The three most-used tags get chips in the search panel.
- **Backup:** notes and tags are part of the walk, so they are included in Export backup and brought back by Restore backup. Notes are plain text and are escaped when shown.
- Code: `tagList`, `parseTags`, `esc` before `clean`; CSS under "notes and tags" at the end of the stylesheet.

## Accessibility fixes (added)

- **Tabs:** the floating navbar is a proper `tablist`. Each tab has `role="tab"`, `aria-selected`, `aria-controls`, and only the active tab is in the tab order. Views are `tabpanel`s with matching `aria-labelledby` and `aria-hidden` when inactive. Arrow keys, Home and End move between tabs when a tab has focus.
- **Dialogs:** Add/edit sheet, Apple Health sheet, walk popup and search panel all use `aria-modal="true"` and `aria-labelledby` (or an explicit label). Focus is trapped inside the open dialog (Tab / Shift+Tab cycle). Opening remembers the previous focus; closing restores it. Escape closes whichever overlay is open (sheet, Health, popup, or search).
- **Labels:** constellation stars announce date and distance; walk list rows have full `aria-label`s and `aria-current` on the selected one; route SVGs keep `role="img"`; decorative tab and search icons are `aria-hidden`.
- **Segments:** Appearance and Distance unit groups are `role="group"` with `aria-pressed` on each option.
- **Live regions:** the constellation caption uses `aria-live="polite"` so month or selection changes are announced; toast already uses `role="status"`.
- **Focus:** stars show a visible focus ring on the core when focused via keyboard; existing `:focus-visible` outlines on buttons and fields are unchanged.
- **Service worker:** cache bumped to `cw-v4` so offline installs pick up the update.
- Reduced-motion support was already in place and is unchanged.

## Roadmap

Built one task at a time. Each finished task is published to the live artifact and delivered as a new zip. `manifest.webmanifest`, `sw.js` and the icons ship in the zip and must be hosted next to `walk-tracker.html` (see Offline use and install).

| # | Task | Status |
|---|---|---|
| 1 | Edit a walk | Done |
| 2 | Photo storage in IndexedDB (no more 5 MB limit) | Done |
| 3 | Backup reminder | Done |
| 4 | Stats (year totals, longest walk, best month, pace) | Done |
| 5 | Monthly goal and streaks | Done |
| 6 | Apple Health export import | Done |
| 7 | Share a photocard as an image | Done |
| 8 | Moving time (ignore pauses) | Done |
| 9 | GPS cleanup and better route simplification | Done |
| 10 | Offline use and home-screen install | Done |
| 11 | Accessibility fixes | Done |
| 12 | Miles option | Done |
| 13 | Walk notes and tags | Done |

## Live version

- Live artifact: https://claude.ai/artifact/GKQAPPbDZgbkEHacSpEeXe
- Last updated: 2026-11-25 (accessibility fixes).
- Workflow: after every edit to `walk-tracker.html`, the live artifact is updated in the same step (same link) and this section is refreshed.
- Earlier artifact links could no longer be opened (this happened again on 2026-11-25, and once more at the miles update), so this is a new link. In the artifact viewer, Export backup cannot download a file (the viewer blocks downloads); use the local file or a hosted copy for backups.
- Note: data is stored per browser, so the live page and a local copy of the file keep separate walks. Use Export and Restore backup to move between them.
