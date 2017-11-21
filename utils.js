var DCMProfileID = 'DCMProfileID';
var AUTO_POP_HEADER_COLOR = '#a4c2f4';
var AUTO_POP_CELL_COLOR = 'lightgray';

/**
 * fetch the DCM User profileid set in Setup tab
 * @return {string} DCM User profile ID.
 */
function _fetchProfileId() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMProfileID);
  return range.getValue();
}


/**
 * Find and clear, or create a new sheet named after the input argument.
 * @param {string} sheetName The name of the sheet which should be initialized.
 * @param {boolean} lock To lock the sheet after initialization or not
 * @return {object} A handle to a sheet.
 */
function initializeSheet_(sheetName, lock) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (sheet == null) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  if (lock) {
    sheet.protect().setWarningOnly(true);
  }
  return sheet;
}

/**
 * Function to track internal usage
 */
function _megadashTracking() {
  var url = "https://megadash.googleplex.com/tracking/5215380526858240";
  var response = UrlFetchApp.fetch(url);
  console.log(response.getContentText());
}

/**
 * Function to track all (internal/external) usage
 * @param {string} page tracked
 */
function sendGA(page) {
  var cid = Utilities.base64EncodeWebSafe(Utilities.computeDigest(
      Utilities.DigestAlgorithm.SHA_256,
      SpreadsheetApp.getActiveSpreadsheet().getSheetId()));
  try {
    var data = {
      'v': '1',
      'tid': 'UA-108224588-1',
      'z': Math.floor(Math.random()*10E7),
      't':'pageview',
      'dl': SpreadsheetApp.getActiveSpreadsheet().getUrl() + '/' + page,
      'cid': cid
    };
    var payload = Object.keys(data).map(
      function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }
    ).join('&');
    var options = {
      'method' : 'POST',
      'payload' : payload
    };
    UrlFetchApp.fetch('http://www.google-analytics.com/collect', options);
  } catch (err) {
    Logger.log(err);
  }
}
