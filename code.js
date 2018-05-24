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

/**
 * Setup custom menu for the sheet
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DCM Functions')

      .addItem('Setup Sheets', 'setupTabs')
      .addSeparator()
      .addItem('Get User Role Permissions List', 'getUserRolePermissions')
      .addItem('Bulk Create Subaccounts', 'bulkCreateSubaccounts')
      .addItem('Bulk Create AdvertiserGroups', 'bulkCreateAdvertiserGroups')
      .addItem('Bulk Create Advertisers', 'bulkCreateAdvertisers')
      .addSeparator()
      .addItem('Get All Advertisers', 'getAllAdvertisers')
      .addItem('Bulk Update Advertiser Floodlight Config ID',
               'bulkUpdateAdvertiserFC')
      .addToUi();
}

/**
 * Use DCM API to get a list of all user role permissions and print it out on
 * the sheet
 */
function getUserRolePermissions() {
  var sheet = _setupUserRolePermissionsSheet();

  const profile_id = _fetchProfileId();
  var permissionList = DoubleClickCampaigns.UserRolePermissions
                                           .list(profile_id)
                                           .userRolePermissions;

  for (var i = 0; i < permissionList.length; ++i) {
    var currentObject = permissionList[i];
    var rowNum = i+2;
    sheet.getRange("A" + rowNum).setNumberFormat('@')
         .setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum)
         .setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@')
         .setValue(currentObject.permissionGroupId)
         .setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum)
         .setValue(currentObject.availability)
         .setBackground(AUTO_POP_CELL_COLOR);
  }
}

/**
 * Use DCM API to get a list of all advertisers for sharing advertisers
 * through floodlight configurations, print it out on the sheet
 */
function getAllAdvertisers() {
  const profile_id = _fetchProfileId();
  var advertisersList = DoubleClickCampaigns.Advertisers
                                            .list(profile_id).advertisers;

  var sheet = _setupFlConfigShareSheet();

  for (var i = 0; i < advertisersList.length; ++i) {
    var currentObject = advertisersList[i];
    var rowNum = i+2;
    sheet.getRange("A" + rowNum).setNumberFormat('@')
         .setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum)
         .setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@')
         .setValue(currentObject.accountId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum).setValue(currentObject.subaccountId)
         .setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("E" + rowNum).setNumberFormat('@')
         .setValue(currentObject.advertiserGroupId)
         .setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("F" + rowNum).setNumberFormat('@')
         .setValue(currentObject.floodlightConfigurationId);
    sheet.getRange("G" + rowNum).setNumberFormat('@')
         .setValue(currentObject.status).setBackground(AUTO_POP_CELL_COLOR);
  }
}

/**
 * Read subaccount information from sheet and use DCM API to bulk create them
 * in the DCM account
 */
function bulkCreateSubaccounts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SUBACCOUNTS_SHEET);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentSubaccount = values[i];
    var name = currentSubaccount[0];
    var permissions = (currentSubaccount[1]).split(',')
        .map(function(i){ return parseInt(i, 10);});

    var subaccountResource = {
      "kind": "dfareporting#subaccount",
      "name": name,
      "availablePermissionIds": permissions
    };

    var newSubaccount = DoubleClickCampaigns.Subaccounts
                                            .insert(subaccountResource,
                                                    profile_id);
    sheet.getRange("C" + currentRow).setValue(newSubaccount.accountId)
         .setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + currentRow).setValue(newSubaccount.id)
         .setBackground(AUTO_POP_CELL_COLOR);

  }
}

/**
 * Read advertiser groups information from sheet and use DCM API to bulk
 * create them in the DCM account
 */
function bulkCreateAdvertiserGroups() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ADV_GROUP_SHEET);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentAdvertiserGroup = values[i];
    var advGroup_name = currentAdvertiserGroup[0];

    var advertiserGroupResource = {
      "kind": "dfareporting#advertiserGroup",
      "name": advGroup_name
    };

    var newAdvertiserGroup = DoubleClickCampaigns.AdvertiserGroups.insert(
                                                    advertiserGroupResource,
                                                    profile_id);
    sheet.getRange("B" + currentRow)
         .setValue(newAdvertiserGroup.accountId)
         .setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + currentRow)
         .setValue(newAdvertiserGroup.id)
         .setBackground(AUTO_POP_CELL_COLOR);
  }
}


/**
 * Read advertisers information from sheet and use DCM API to bulk create them
 * in the DCM account
 */
function bulkCreateAdvertisers() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(ADV_SHEET);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentAdvertiser = values[i];
    var adv_name = currentAdvertiser[0];
    var adv_subaccount_id = currentAdvertiser[1];
    var adv_group_id = currentAdvertiser[2]; // optional field

    var advertiserResource = {
        "kind": "dfareporting#advertiser",
        "name": adv_name
    };

    // advertiser group is optional
    if (adv_group_id !== "") {
      advertiserResource.advertiserGroupId = adv_group_id;
    }

    // subaccount is optional
    if (adv_subaccount_id !== "") {
      advertiserResource.subaccountId = adv_subaccount_id;
    }

    var newAdvertiser = DoubleClickCampaigns.Advertisers
                                            .insert(advertiserResource,
                                                    profile_id);
    sheet.getRange("D" + currentRow)
         .setValue(newAdvertiser.id).setBackground(AUTO_POP_CELL_COLOR);
  }
}

/**
 * Read advertisers floodlight configuration ID from sheet and use DCM API to
 * bulk update them in the DCM account
 */
function bulkUpdateAdvertiserFC() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(FL_CONFIG_SHARE_SHEET);

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentAdvertiser = values[i];
    var id = currentAdvertiser[0];
    var floodlight_config_id = currentAdvertiser[5];

    if (floodlight_config_id !== "" && floodlight_config_id !== id) {
      var response = DoubleClickCampaigns.Advertisers.patch(
          {"floodlightConfigurationId": floodlight_config_id}, profile_id, id);
      if (response.floodlightConfigurationId === floodlight_config_id) {
        sheet.getRange("H" + currentRow).setValue("Updated")
             .setBackground(AUTO_POP_CELL_COLOR);
      }
    }
  }
}
