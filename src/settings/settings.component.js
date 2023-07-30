/** Checks github for the latest version
 * @return {String} returns an information for the User, that he uses the latest version or not
 * @customfunction
 */
function checkForNewerVersion() {
  var opt = {
      contentType: "application/json",
      muteHttpExceptions: true,
    },
    data = UrlFetchApp.fetch(
      "https://api.github.com/repos/Darkister/ht-cm-statistics/releases/latest",
      opt,
    );
  data = JSON.parse(data.getContentText());

  Logger.log(data.tag_name);
  if (data.tag_name == scriptVersion) {
    return "You are using the latest Version :)";
  } else {
    return "A newer Version is available!";
  }
}

/** Trigger to change the Players to view in Setup and Co
 *  @param {*} e
 */
function editPlayersToViewTrigger(e) {
  if (
    e &&
    e.range &&
    e.range.getRow() === 2 &&
    e.range.getColumn() === 3 &&
    e.range.getSheet().getName() === "Settings"
  ) {
    var playersToView = settingsSheet.getRange(2, 3).getValue(),
      statusCell = settingsSheet.getRange(13, 3);

    updateSetupLayout(playersToView);
    rebuildMechanics(playersToView);

    statusCell.setValue(
      "Updated Players to view to " + playersToView.toString(),
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
    playersToView = settingsSheet.getRange(2, 3).getValue(),
    players = staticSheet.getRange(2, 2, playersToView, 1).getValues(),
    infoRange = settingsSheet.getRange(3, 8, 11, 4),
    infoValue = infoRange.getValues(),
    filteredLogs;

  if (value == "") {
    inputIsEmpty = true;
  }
  if (
    e &&
    e.range &&
    e.range.getRow() == 4 &&
    e.range.getColumn() == 3 &&
    e.range.getSheet().getName() === "Settings" &&
    !inputIsEmpty
  ) {
    // simple logic to validate the input
    if (value.includes("https://dps.report/")) {
      inputIsValid = true;
    } else {
      inputIsValid = false;
    }

    if (!playersToView || players.filter((e) => e[0]).length != playersToView) {
      infoValue[0][0] =
        "Players in Setup & Co don't match amount of players to view, fill missing players and try again";
      infoRange.setValues(infoValue);
      console.log(players);
    } else {
      if (inputIsValid) {
        statusCell.setValue("Calculating Logs");
        formatedLogs = formatLogs(value);
        filteredLogs = preFilterLogs(formatedLogs);
        Logger.log(filteredLogs);
        if (filteredLogs.length > 0) {
          writeDataIntoSpreadsheet(filteredLogs);
          statisticsSheet
            .getRange(9, 7, statisticsSheet.getMaxRows() - 9, 15)
            .clear();
          repairSettingsLayout();
          rebuildFilter();
          statusCell.setValue("Calculation complete");
        } else {
          repairSettingsLayout();
          statusCell.setValue("Nothing to Do, Check the Info Box");
        }
      } else {
        statusCell.setValue(
          "Wrong records found, check the entries or contact an admin/developer",
        );
      }
      mechanicSheet.getRange(41, 1, 1, 1).setValues([["Available!"]]);
    }
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

  var clearLogs = logs.filter(
    (value) => !(value == [] || value == "" || value == {}),
  );
  infoValue[0][0] = "Received Logs: " + clearLogs;
  infoRange.setValues(infoValue);
  return clearLogs;
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
