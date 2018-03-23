/***********************************************************************
Copyright 2017 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Note that these code samples being shared are not official Google
products and are not formally supported.
************************************************************************/

// Global variables/configurations
var DCMProfileID = 'DCMProfileID';
var AUTO_POP_HEADER_COLOR = '#a4c2f4';
var USER_INPUT_HEADER_COLOR = '#b6d7a8';
var AUTO_POP_CELL_COLOR = 'lightgray';


// Sheet names
var SETUP_SHEET = "Setup";
var USER_ROLE_PERM_SHEET = "UserRolePermissions";
var SUBACCOUNTS_SHEET = "Subaccounts";
var ADV_GROUP_SHEET = "AdvertiserGroups";
var ADV_SHEET = "Advertisers";
var FL_CONFIG_SHARE_SHEET = "FloodlightConfigShareAdvertisers";

/**
 * fetch the DCM User profileid set in Setup tab
 * @return {string} DCM User profile ID.
 */
function _fetchProfileId() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var range = ss.getRangeByName(DCMProfileID);
  if (!range) {
    SpreadsheetApp.getUi().alert('User Profile ID cannot be null');
  }
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

/**
 * Initialize all tabs and their header rows
 */
function setupTabs() {
  _setupSetupSheet();
  _setupUserRolePermissionsSheet();
  _setupSubaccountsSheet();
  _setupAdvertiserGroupsSheet();
  _setupAdvertisersSheet();
  _setupFlConfigShareSheet();
}

/**
 * Initialize the Setup sheet and its header row
 * @return {object} A handle to the sheet.
*/
function _setupSetupSheet() {
  var sheet = initializeSheet_(SETUP_SHEET, false);

  sheet.getRange('B5').setValue("User Profile ID")
                      .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C5').setBackground(USER_INPUT_HEADER_COLOR);

  sheet.getRange("B5:C5").setFontWeight("bold").setWrap(true);
  return sheet;

}

/**
 * Initialize the UserRolePermissions sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupUserRolePermissionsSheet() {
  var sheet = initializeSheet_(USER_ROLE_PERM_SHEET, true);

  sheet.getRange('A1').setValue("ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("Name").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("PermissionGroupID")
                      .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Availability")
                      .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:D1").setFontWeight("bold").setWrap(true);
  return sheet;
}

/**
 * Initialize the Subaccounts sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupSubaccountsSheet() {
  var sheet = initializeSheet_(SUBACCOUNTS_SHEET, false);

  sheet.getRange('A1').setValue("Name*").setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1').setValue("Available Permission Ids (comma separated)*")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('C1').setValue("Account ID (do not edit; auto-filling)")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Subaccount ID (do not edit; auto-filling)")
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:D1").setFontWeight("bold").setWrap(true);
  return sheet;

}

/**
 * Initialize the AdvertiserGroups sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAdvertiserGroupsSheet() {
  var sheet = initializeSheet_(ADV_GROUP_SHEET, false);

  sheet.getRange('A1').setValue("Name*").setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1').setValue("Account ID (do not edit; auto-filling)")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("ID (do not edit; auto-filling)")
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:C1").setFontWeight("bold").setWrap(true);
  return sheet;
}

/**
 * Initialize the Advertisers sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupAdvertisersSheet() {
  var sheet = initializeSheet_(ADV_SHEET, false);

  sheet.getRange('A1').setValue("Advertiser Name*")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('B1').setValue("Subaccount ID (optional))");
  sheet.getRange('C1').setValue("Advertiser Group ID (optional)");
  sheet.getRange('D1').setValue("Advertiser ID (auto-populated; do not edit)")
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:D1").setFontWeight("bold").setWrap(true);
  return sheet;

}

/**
 * Initialize the FloodlightConfigShareAdvertisers sheet and its header row
 * @return {object} A handle to the sheet.
 */
function _setupFlConfigShareSheet() {
  var sheet = initializeSheet_(FL_CONFIG_SHARE_SHEET, false);

  sheet.getRange('A1').setValue("ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("Name").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("Account ID")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Subaccount ID")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('E1').setValue("Advertiser Group ID")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('F1').setValue("Floodlight Configuration ID")
       .setBackground(USER_INPUT_HEADER_COLOR);
  sheet.getRange('G1').setValue("Status")
       .setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('H1').setValue("Updated (auto-populated; do not edit)")
       .setBackground(AUTO_POP_HEADER_COLOR);

  sheet.getRange("A1:H1").setFontWeight("bold").setWrap(true);
  return sheet;
}
