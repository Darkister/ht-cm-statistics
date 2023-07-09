/** Trigger to change the Players to view in Setup and Co
 *  @param {*} e
 */
function editPlayersToViewTrigger(e) {
  if (
    e &&
    e.range &&
    e.range.getRow() === 3 &&
    e.range.getColumn() === 3 &&
    e.range.getSheet().getName() === "Settings"
  ) {
    var playersToView = settingsSheet.getRange(3, 3).getValue();

    updateSetupLayout(playersToView);

    SpreadsheetApp.getActiveSpreadsheet().toast(
      "Players to view is set to " +
        playersToView +
        ". Setup and Co will be updated.",
      "Updated Players to view",
      5
    );
  }
}

/** Trigger to check that dps.reports are entered into the correct space and to automatically run writeDataIntoSpreadsheet when the input is valid
 *  @param {*} e
 */
function editTrigger(e) {
  var inputIsValid = false,
    inputIsEmpty = false,
    value = e.range.getValue(),
    statusCell = settingsSheet.getRange(13, 3),
    formatedLogs,
    filteredLogs;

  Logger.log(value);

  // simple logic to validate the input
  if (value.includes("https://dps.report/")) {
    inputIsValid = true;
  } else {
    if (value == "") {
      inputIsEmpty = true;
    } else {
      inputIsValid = false;
    }
  }

  if (
    e &&
    e.range &&
    e.range.getRow() == 4 &&
    e.range.getColumn() == 3 &&
    e.range.getSheet().getName() === "Settings" &&
    !inputIsEmpty
  ) {
    if (inputIsValid) {
      statusCell.setValue("Calculating Logs");
      formatedLogs = formatLogs(value);
      Logger.log(formatedLogs);
      filteredLogs = preFilterLogs(formatedLogs);
      if (filteredLogs.length > 0) {
        writeDataIntoSpreadsheet(filteredLogs);
        repairSettingsLayout();
        statusCell.setValue("Calculation complete");
      } else {
        repairSettingsLayout();
        statusCell.setValue("Nothing to Do, Check the Info Box");
      }
    } else {
      statusCell.setValue(
        "Wrong records found, check the entries or contact an admin"
      );
    }
    var amountOfPlayers = fillAllPlayersAccName(),
      amountOfDays = fillFailedPhases();
    updateStatisticsLayout(amountOfPlayers, amountOfDays);
    mechanicSheet.getRange(41, 1, 1, 1).setValues([["Available!"]]);
  }
}

/**
 *
 */
function formatLogs(logsInput) {
  var logsHelper;

  if (occurrences(logsInput, "https://dps.report/") > 1) {
    logsHelper = logsInput.replace(/(\r\n|\r|\n)/g, " ").split(" ");
    logs = new Array(logsHelper.length);
    for (var i = 0; i < logsHelper.length; i++) {
      logs[i] = logsHelper[i];
    }
  } else {
    logs = new Array(1);
    logs[0] = logsInput;
  }
  var infoRange = settingsSheet.getRange(3, 8, 11, 4),
    infoValue = infoRange.getValues();

  infoValue[0][0] = "Received Logs: " + logs;
  infoRange.setValues(infoValue);
  return logs;
}

/**
 *
 */
function preFilterLogs(logsInput) {
  var calculatedLogs,
    outfilteredLogs = new Array(),
    leftLogs = new Array();
  try {
    calculatedLogs = logSheet
      .getRange(2, 2, logSheet.getLastRow() - 1, 1)
      .getValues();
    Logger.log(calculatedLogs);
    for (i = 0; i < logsInput.length; i++) {
      if (calculatedLogs.some((arr) => arr.includes(logsInput[i]))) {
        outfilteredLogs.push(logsInput[i]);
      } else {
        leftLogs.push(logsInput[i]);
      }
    }
  } catch {
    Logger.log("Logs are empty, Continue with fresh data");
    for (i = 0; i < logsInput.length; i++) {
      leftLogs.push(logsInput[i]);
    }
  }

  var infoRange = settingsSheet.getRange(3, 8, 11, 4),
    infoValue = infoRange.getValues();

  if (outfilteredLogs.length == 0) {
    infoValue[0][0] = "Continue with this logs:\n" + leftLogs;
  } else if (leftLogs.length == 0) {
    infoValue[0][0] =
      "This Logs already inside the Spreadsheet and will be ignored:\n" +
      outfilteredLogs;
  } else {
    infoValue[0][0] =
      "This Logs already inside the Spreadsheet and will be ignored:\n" +
      outfilteredLogs +
      "\nContinue with this logs:\n" +
      leftLogs;
  }
  infoRange.setValues(infoValue);
  return leftLogs;
}
