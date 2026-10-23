/**
 * RSVP receiver for the wedding invitation.
 * Appends one row per submission to the "RSVP" sheet. Every submission is kept,
 * so a guest who changes their answer appears twice: the newest row wins.
 *
 * Setup: see README.md, section "RSVP -> Google Sheets".
 */

var SHEET_NAME = 'RSVP';
// Leave empty when this script was opened from the sheet (Extensions -> Apps Script).
// For a standalone script, paste the sheet ID: the long part of its URL between /d/ and /edit.
var SPREADSHEET_ID = '';
// Column titles, written with \u escapes so copy-paste cannot garble the Vietnamese letters:
var HEADERS = ['Th\u1eddi gian', 'H\u1ecd t\u00ean', 'Tham d\u1ef1', 'S\u1ed1 ng\u01b0\u1eddi', 'Nghi l\u1ec5', 'Kh\u00e1ch c\u1ee7a', '\u0102n u\u1ed1ng', 'L\u1eddi nh\u1eafn'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var p = (e && e.parameter) || {};

    // Honeypot: hidden from people, bots tend to fill it.
    if (p.hp_check || p.website) return json({ result: 'success' });

    var name = clean(p.name, 80);
    if (name.length < 2) return json({ result: 'error', error: 'name required' });

    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      name,
      clean(p.attending, 10),
      clean(p.guests, 4),
      clean(p.events, 200),
      clean(p.side, 20),
      clean(p.dietary, 200),
      clean(p.message, 1000)
    ]);
    return json({ result: 'success' });
  } catch (err) {
    return json({ result: 'error', error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the /exec URL in a browser shows this: a quick way to check the deployment.
function doGet() {
  return json({ result: 'ok', message: 'RSVP endpoint is running.' });
}

function getSheet() {
  var ss = SPREADSHEET_ID ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: open this script from the sheet, or set SPREADSHEET_ID');
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  var header = sheet.getRange(1, 1, 1, HEADERS.length);
  // Writes the titles into row 1 when the sheet is new, and repairs them if they differ.
  if (header.getValues()[0].join('|') !== HEADERS.join('|')) {
    header.setValues([HEADERS]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Strips leading = + - @ so a guest cannot inject a spreadsheet formula.
function clean(v, max) {
  return String(v == null ? '' : v).trim().slice(0, max).replace(/^[=+\-@]+/, '');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
