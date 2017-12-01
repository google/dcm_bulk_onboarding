# **DCM Bulk Onboarding Tool**

An example tool to perform bulk tasks to onboard DCM accounts using DCM API.

## OVERVIEW

This AppScript-based tool lets you use a Google Spreadsheet to perform bulk
boarding tasks including - Bulk Create Subaccounts - Bulk Create
AdvertiserGroups - Bulk Create Advertisers - Bulk update Advertiser Floodlight
Config ID

Additional helper tasks for these bulk creations include - Get User Role
Permissions List - Get All Advertisers

It uses DCM APIs to pull and push data to DCM.

The same result could be achieved by manually creating each entities through the
DCM UI, but the tool leverages the APIs and Spreadsheet functionalities to
automate the most manual steps.

In order to use this tool you need to have valid access to the **DoubleClick
Campaign Manager APIs** through your Google Account, and you will need to enable
that API in a Google Cloud Project so that you can generate authenticate the
tool (see the corresponding step of Initial Setup section below).

## INITIAL SETUP

*   Create a new [Google Spreadsheet](https://sheets.google.com) and open its
    script editor (from _Tools > Script Editor_)
    -   Copy the code from code.js and utils.js in two corresponding code.gs,
        utilities.gs files in your AppScript project
    -   Enable DCM API _Resources > Advanced Google Services_ and enable the
        _DCM/DFA Reporting and Trafficking API (v2.8)_
    -   Click on _Google API Console link_ at the bottom of _Advanced Google
        Services_ window to open the Google Cloud Platform project, select
        _Library_ from the left hand menu, then search and enable the DCM API in
        the project
*   Close the script editor and spreadsheet tabs both (this is necessary so the
    custom functions appear)
*   Re-open the Go back to the Spreadsheet, click on the _DCM Functions_ menu
    and select _Setup Sheets_ for the initial tabs and header rows setup (wait
    for the script to finish)
*   Remove any tab not needed (aside from the ones created by script)
*   Input the DCM Profile ID in the setup tab (i.e. at cell C5) then select
    _Data_ from the sheet menu and select _Named Ranges...._ to set the title
    _DCMProfileID_ and value _Setup!C5_

## USAGE

*   As general rules
    *   Only manually edit columns with green headers.
    *   Columns with blue headers will be auto-populated.
    *   Columns with a header* means it's required, otherwise optional
*   **Get User Role Permissions List** Get all user role permissions populated
    in _UserRoePermissions_ tab (this tab is for read-only purpose, so do not
    edit it). Then select "Get User Role Permissions List" from DCM Functions
    menu.
*   **Bulk Create Subaccounts** Fill out the tab Subaccounts with names
    permission IDs (could be retried with "Get User Role Permissions List"
    function from last step), then select "Bulk Create Subaccounts" from DCM
    Functions menu.
*   **Bulk Create Advertiser Groups** Fill out the tab AdvertiserGroups then
    select "Bulk Create Advertiser Groups" from DCM Functions menu.
*   **Bulk Create Advertisers** Fill out the tab Advertisers then select "Bulk
    Create Advertisers" from DCM Functions menu.
*   **Get All Advertisers** Retrieve all advertisers into
    "FloodlightConfigShareAdvertisers" tab by selecting "Get All Advertisers"
    from the DCM Functions menu.
*   **Share Advertisers Floodlight Configuration** Share advertisers floodlight
    configuration IDs by modifying "Floodlight Configuration ID" column in
    FloodlightConfigShareAdvertisers tab (note: only keep the rows of
    advertisers that you intend to update).
