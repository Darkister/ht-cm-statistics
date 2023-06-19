/** Trigger to check that dps.reports are entered into the correct space and to automatically run writeDataIntoSpreadsheet when the input is valid
 *  @param {*} e
 */
function editTrigger(e) {
  var targetCol = 2,
    inputIsValid = false,
    inputIsEmpty = false,
    values = e.range.getValues();

  Logger.log(values);

  // simple logic to validate the input
  for (var i = 0; i < values.length; i++) {
    if (values[i][0].toString().includes("https://dps.report/")) {
      inputIsValid = true;
    } else {
      if (values[i][0].toString() == "") {
        inputIsEmpty = true;
      } else {
        inputIsValid = false;
        break;
      }
    }
  }

  if (
    e &&
    e.range &&
    e.range.getRow() &&
    e.range.getColumn() === targetCol &&
    e.range.getSheet().getName() === "Logs"
  ) {
    if (inputIsValid) {
      writeDataIntoSpreadsheet(e.range.getRow());
    } else if (inputIsEmpty) {
      var range = logSheet.getRange(
        e.range.getRow(),
        e.range.getColumn() - 1,
        1,
        25
      );
      range.clearContent();
    } else {
      var cell = logSheet.getRange(e.range.getRow(), e.range.getColumn() + 1);
      cell.setValue(
        "Wrong records found, check the entries or contact an admin"
      );
    }
    var amountOfPlayers = fillAllPlayersAccName(),
      amountOfDays = fillFailedPhases();
    updateStatisticsLayout(amountOfPlayers, amountOfDays);
    mechanicsSheet.getRange(41, 1, 1, 1).setValues([["Available!"]]);
  }
}

/** create basic layout for the full spreadsheet
 *
 */
function createFullLayout() {
  createStatisticsLayout();
  createSetupLayout();
  createLogsLayout();
  createMechanicsLayout();
  createSettingsLayout();
}
