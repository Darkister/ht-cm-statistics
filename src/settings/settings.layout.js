/** create basic layout for the tab Setup
 *
 */
function createSettingsLayout() {
  if (settingsSheet == null) {
    ss.insertSheet("Settings", 1);
    settingsSheet = ss.getSheetByName("Settings");
  }

  var settingsRange = settingsSheet.getRange(1, 1, 14, 8),
    settingsValue = settingsRange.getValues(),
    enterLogRange = settingsSheet.getRange(4, 3, 8, 4),
    infoRange = settingsSheet.getRange(3, 8, 11, 4),
    amountOfPlayersToValidate = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ],
    maxRows = settingsSheet.getMaxRows(),
    maxColumns = settingsSheet.getMaxColumns();

  settingsValue[1][1] = "Players to view";
  var amountOfPlayersToValidateCell = settingsSheet.getRange("C2"),
    rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(amountOfPlayersToValidate, true)
      .setHelpText("Only the Values in the Drop-Down are allowed.")
      .setAllowInvalid(false)
      .build();

  amountOfPlayersToValidateCell.setDataValidation(rule);

  if (settingsValue[1][2] == "") {
    settingsValue[1][2] = 10;
  }

  settingsValue[3][1] = "Enter Logs here:";
  enterLogRange
    .merge()
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    )
    .setBackground(lightGray);
  settingsSheet.getRange(4, 3).setVerticalAlignment("top");

  settingsValue[1][7] = "Info:";
  infoRange
    .merge()
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    )
    .setBackground(lightGray)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP);
  settingsSheet.getRange(3, 8).setVerticalAlignment("top");

  settingsValue[12][1] = "Status:";
  settingsValue[12][2] = "Add Logs to Start :)";

  settingsRange.setValues(settingsValue);

  if (maxRows > 14) {
    settingsSheet.deleteRows(14, maxRows - 14);
  }
  if (maxColumns > 12) {
    settingsSheet.deleteColumns(12, maxColumns - 12);
  }

  settingsSheet.getRange(2, 2, 1, 2).setFontWeight("bold");
  settingsSheet.getRange(2, 8, 1, 1).setFontWeight("bold");
  settingsSheet.getRange(4, 2, 1, 1).setFontWeight("bold");
  settingsSheet.getRange(13, 2, 1, 1).setFontWeight("bold");
  settingsSheet.autoResizeColumns(2, 1);

  // add Protection to the sheet, that only the owner can edit
  var settingsProtection = settingsSheet.protect(),
    me = Session.getEffectiveUser();

  settingsProtection
    .removeEditors(settingsProtection.getEditors())
    .setUnprotectedRanges([amountOfPlayersToValidateCell, enterLogRange])
    .setDescription("Protect whole sheet expect the Cell to enter Logs")
    .addEditor(me);
}

function repairSettingsLayout() {
  var enterLogRange = settingsSheet.getRange(4, 3, 8, 4);
  enterLogRange
    .merge()
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID,
    )
    .setBackground(lightGray)
    .clearContent();
  settingsSheet.getRange(4, 3).setVerticalAlignment("top");
}
