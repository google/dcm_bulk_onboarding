function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('DCM Functions')
      .addItem('Get User Role Permissions List', 'getUserRolePermissions')
      .addItem('Bulk Create Subaccounts', 'bulkCreateSubaccounts')
      .addItem('Bulk Create AdvertiserGroups', 'bulkCreateAdvertiserGroups')
      .addItem('Bulk Create Advertisers', 'bulkCreateAdvertisers')
      .addSeparator()
      .addItem('Get All Advertisers', 'getAllAdvertisers')
      .addItem('Bulk Update Advertiser Floodlight Config ID', 'bulkUpdateAdvertiserFC')
      .addToUi();
};

function getUserRolePermissions() {
  _megadashTracking();
  sendGA("getUserRolePermissions");
  const profile_id = _fetchProfileId();
  var permissionList = DoubleClickCampaigns.UserRolePermissions.list(profile_id).userRolePermissions;
  var sheet = initializeSheet_('UserRolePermissions', true);

  // setup header row
  sheet.getRange('A1').setValue("ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("Name").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("PermissionGroupID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Availability").setBackground(AUTO_POP_HEADER_COLOR);

  for (var i = 0; i < permissionList.length; ++i) {
    var currentObject = permissionList[i];
    var rowNum = i+2;
    sheet.getRange("A" + rowNum).setNumberFormat('@').setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum).setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@').setValue(currentObject.permissionGroupId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum).setValue(currentObject.availability).setBackground(AUTO_POP_CELL_COLOR);
  }
}

function getAllAdvertisers() {
  _megadashTracking();
  sendGA("getAllAdvertisers");
  const profile_id = _fetchProfileId();
  var advertisersList = DoubleClickCampaigns.Advertisers.list(profile_id).advertisers;
  var sheet = initializeSheet_('FloodlightConfigShareAdvertisers', false);

  // setup header row
  sheet.getRange('A1').setValue("ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('B1').setValue("Name").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('C1').setValue("Account ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('D1').setValue("Subaccount ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('E1').setValue("Advertiser Group ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('F1').setValue("Floodlight Configuration ID").setBackground(AUTO_POP_HEADER_COLOR);
  sheet.getRange('G1').setValue("Status").setBackground(AUTO_POP_HEADER_COLOR);


  for (var i = 0; i < advertisersList.length; ++i) {
    var currentObject = advertisersList[i];
    var rowNum = i+2;
    sheet.getRange("A" + rowNum).setNumberFormat('@').setValue(currentObject.id).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("B" + rowNum).setValue(currentObject.name).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + rowNum).setNumberFormat('@').setValue(currentObject.accountId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + rowNum).setValue(currentObject.subaccountId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("E" + rowNum).setNumberFormat('@').setValue(currentObject.advertiserGroupId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("F" + rowNum).setNumberFormat('@').setValue(currentObject.floodlightConfigurationId);
    sheet.getRange("G" + rowNum).setNumberFormat('@').setValue(currentObject.status).setBackground(AUTO_POP_CELL_COLOR);
  }
}


function bulkCreateSubaccounts() {
  _megadashTracking();
  sendGA("bulkCreateSubaccounts");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Subaccounts");

  // This represents ALL the data
  var range = sheet.getDataRange();
  var values = range.getValues();

  const profile_id = _fetchProfileId();

  // build request body resources
  for (var i = 1; i < values.length; ++i) {
    var currentRow = i + 1;
    var currentSubaccount = values[i];
    var name = currentSubaccount[0];
    var permissions = (currentSubaccount[1]).split(',').map(function(i){ return parseInt(i, 10);});

    var subaccountResource = {
      "kind": "dfareporting#subaccount",
      "name": name,
      "availablePermissionIds": permissions
    };

    var newSubaccount = DoubleClickCampaigns.Subaccounts.insert(subaccountResource, profile_id);
    sheet.getRange("C" + currentRow).setValue(newSubaccount.accountId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("D" + currentRow).setValue(newSubaccount.id).setBackground(AUTO_POP_CELL_COLOR);

  }
}

function bulkCreateAdvertiserGroups() {
  _megadashTracking();
  sendGA("bulkCreateAdvertiserGroups");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("AdvertiserGroups");

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

    var newAdvertiserGroup = DoubleClickCampaigns.AdvertiserGroups.insert(advertiserGroupResource, profile_id);
    sheet.getRange("B" + currentRow).setValue(newAdvertiserGroup.accountId).setBackground(AUTO_POP_CELL_COLOR);
    sheet.getRange("C" + currentRow).setValue(newAdvertiserGroup.id).setBackground(AUTO_POP_CELL_COLOR);
  }
}



function bulkCreateAdvertisers() {
  _megadashTracking();
  sendGA("bulkCreateAdvertisers");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Advertisers");

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

    var newAdvertiser = DoubleClickCampaigns.Advertisers.insert(advertiserResource, profile_id);
    sheet.getRange("D" + currentRow).setValue(newAdvertiser.id).setBackground(AUTO_POP_CELL_COLOR);
  }
}


function bulkUpdateAdvertiserFC() {
  _megadashTracking();
  sendGA("bulkUpdateAdvertiserFC");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("FloodlightConfigShareAdvertisers");

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
      DoubleClickCampaigns.Advertisers.patch({"floodlightConfigurationId": floodlight_config_id}, profile_id, id);
    }
  }
}


