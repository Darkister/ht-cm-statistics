/** create basic layout for the tab Logs
 *
 */
function createLogsLayout() {
  if (logSheet == null) {
    ss.insertSheet("Logs", 2);
    logSheet = ss.getSheetByName("Logs");
  }
  var logRange = logSheet.getRange(1, 1, 1, 28),
    logValue = logRange.getValues();

  logValue[0][0] = "Date";
  logValue[0][1] = "Log";
  logValue[0][2] = "Duration";
  logValue[0][3] = "endPhase";
  logValue[0][4] = "Rest HP";
  logValue[0][5] = "isValid?";
  logValue[0][6] = "First Death";
  logValue[0][7] = "Players Accountname";

  logValue[0][17] = "failed on green";
  logValue[0][18] = "Recieved Void debuff";
  logValue[0][19] = "Hit by Jormag Breath";
  logValue[0][20] = "Hit by Primordus Slam";
  logValue[0][21] = "Hit by Crystal Barrage";
  logValue[0][22] = "Hit by Mordremoth Shockwave";
  logValue[0][23] = "Hit by Whirlpool";
  logValue[0][24] = "Hit by Soo-Won Tsunami";
  logValue[0][25] = "Hit by Soo-Won Claw";
  logValue[0][26] = "Recieved Debilitated debuff";
  logValue[0][27] = "all Player down on First Death";

  logSheet.getRange(1, 7, 1, 10).mergeAcross();
  logSheet
    .getRange(2, 1, logSheet.getMaxRows() - 1, 1)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setFontWeight("bold");
  logSheet
    .getRange(2, 3, logSheet.getMaxRows() - 1, 21)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  logSheet
    .getRange(2, 5, logSheet.getMaxRows() - 1, 1)
    .setNumberFormat("#0.00%");
  logRange
    .setValues(logValue)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_THICK,
    );

  var filter = logSheet.getFilter();
  if (!filter) {
    logRange.createFilter();
  }

  logSheet
    .setColumnWidths(1, 1, 80)
    .setColumnWidths(2, 1, 300)
    .setColumnWidths(3, 1, 105)
    .setColumnWidths(4, 1, 85)
    .autoResizeColumns(5, 2)
    .setColumnWidths(7, 1, 150)
    .setColumnWidths(8, 10, 25)
    .autoResizeColumns(18, 6)
    .setFrozenRows(1);
  logSheet.hideColumns(6, 1);
  logSheet.hideColumns(8, 10);
  logSheet.hideColumns(19, 6);
  logSheet.hideColumns(27);
}

function rebuildFilter() {
  var startRow = 2,
    startColumn = 1,
    lastRow = logSheet.getLastRow(),
    lastColumn = logSheet.getLastColumn(),
    range = logSheet.getRange(
      startRow,
      startColumn,
      lastRow - startRow + 1,
      lastColumn,
    ),
    filter = logSheet.getFilter(),
    criteria = [];

  // Store the filter criteria before removing the filter
  if (filter) {
    var numColumns = range.getNumColumns();
    for (var col = 1; col <= numColumns; col++) {
      criteria.push(filter.getColumnFilterCriteria(col));
    }
  }

  // Remove the filter
  if (filter) {
    filter.remove();
  }

  // Sort the data
  range.sort([{ column: 1 }]);

  // Reapply the filter
  if (criteria.length > 0) {
    var newFilterRange = logSheet.getRange(
      startRow - 1,
      startColumn,
      lastRow,
      lastColumn,
    );
    newFilterRange.createFilter();
    var newFilter = newFilterRange.getFilter();
    var numColumns = newFilterRange.getNumColumns();
    for (var col = 1; col <= numColumns; col++) {
      if (criteria[col - 1]) {
        newFilter.setColumnFilterCriteria(col, criteria[col - 1]);
      }
    }
  }
}
