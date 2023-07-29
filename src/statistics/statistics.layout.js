var ss = SpreadsheetApp.getActiveSpreadsheet(),
  statisticsSheet = ss.getSheetByName("Statistics");

/** create basic layout for the Tab Statistics
 *
 */
function createStatisticsLayout() {
  if (statisticsSheet == null) {
    ss.insertSheet("Statistics", 0);
    statisticsSheet = ss.getSheetByName("Statistics");
  }
  var statisticsRange = statisticsSheet.getRange(1, 1, 8, 21),
    statisticsValue = statisticsRange.getValues();

  statisticsValue[0][0] = "Best Try all time:";
  statisticsValue[0][1] = "=getBestTry(Logs!D2:E)";

  statisticsValue[1][0] = "AVG Tries per day:";
  statisticsValue[1][1] = "=R9/COUNTA(G10:G)";

  statisticsValue[2][0] = "Tries ended on Green:";
  statisticsValue[2][1] = "=S9/R9";

  statisticsValue[3][0] = "Tries ended on Slam:";
  statisticsValue[3][1] = "=T9/R9";

  statisticsValue[4][0] = "Tries ended on Shockwave:";
  statisticsValue[4][1] =
    "=SUM(MAP(U10:U; S10:S;LAMBDA(valA;valB;MIN(valA;valB))))/R9";

  statisticsValue[6][0] = "Total Count of valid Logs:";
  statisticsValue[6][1] = "Participation";
  statisticsValue[6][3] = "First Death";
  statisticsValue[6][6] = "Most failed Phase";
  statisticsValue[6][18] = "Failed on Mechanic";

  statisticsValue[7][0] = "=COUNTA(Logs!B2:B)";
  statisticsValue[7][1] = "total";
  statisticsValue[7][2] = "percent";
  statisticsValue[7][3] = "total";
  statisticsValue[7][4] = "percent";
  statisticsValue[7][7] = "Jormag";
  statisticsValue[7][8] = "Primordus";
  statisticsValue[7][9] = "Kralkatorrik";
  statisticsValue[7][10] = "Purification 2";
  statisticsValue[7][11] = "Mordremoth";
  statisticsValue[7][12] = "Zhaitan";
  statisticsValue[7][13] = "Purification 3";
  statisticsValue[7][14] = "Soo-Won 1";
  statisticsValue[7][15] = "Purification 4";
  statisticsValue[7][16] = "Soo-Won 2";
  statisticsValue[7][17] = "Total";
  statisticsValue[7][18] = "Green";
  statisticsValue[7][19] = "Slam";
  statisticsValue[7][20] = "Shockwave";

  statisticsSheet.getRange(7, 2, 1, 2).mergeAcross();
  statisticsSheet.getRange(7, 4, 1, 2).mergeAcross();
  statisticsSheet.getRange(7, 7, 1, 12).mergeAcross();
  statisticsSheet.getRange(7, 19, 1, 3).mergeAcross();
  statisticsRange
    .setValues(statisticsValue)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setFontWeight("bold");
  statisticsSheet.getRange(2, 2).setNumberFormat("#,##0.000");
  statisticsSheet.getRange(3, 2, 3, 1).setNumberFormat("#0.00%");
  statisticsSheet.getRange(2, 2, 4, 1).setHorizontalAlignment("center");
  statisticsSheet.getRange(7, 1, 2, 21).setHorizontalAlignment("center");
  statisticsSheet
    .getRange(7, 1, 2, 5)
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
  statisticsSheet
    .getRange(7, 7, 2, 15)
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
  statisticsSheet.getRange(7, 1, 1, 5).setBackground("#ABABAB");
  statisticsSheet.getRange(7, 7, 1, 15).setBackground("#ABABAB");
  statisticsSheet
    .autoResizeColumns(1, 1)
    .setColumnWidths(2, 4, 60)
    .setColumnWidths(6, 1, 25)
    .setColumnWidths(7, 1, 80)
    .autoResizeColumns(8, 11)
    .setColumnWidths(19, 1, 50)
    .autoResizeColumns(20, 2);

  if (statisticsSheet.getLastRow() < 40) {
    statisticsSheet.deleteRows(40, statisticsSheet.getMaxRows() - 40);
  }
  if (statisticsSheet.getLastColumn() < 22) {
    statisticsSheet.deleteColumns(23, statisticsSheet.getMaxColumns() - 22);
  }

  var statisticsProtection = statisticsSheet.protect(),
    me = Session.getEffectiveUser();

  statisticsProtection
    .removeEditors(statisticsProtection.getEditors())
    .setDescription("Protect whole sheet expect the Cell to enter Logs")
    .addEditor(me);
}

/** create basic layout for the Tab Statistics
 *
 */
function cleanUpStatisticsLayout() {
  var statisticsRange = statisticsSheet.getRange(
      9,
      1,
      statisticsSheet.getLastRow() - 8,
      5,
    ),
    statisticsValue = statisticsRange.getValues();

  for (var i = 1; i < statisticsValue.length; i++) {
    if (statisticsValue[i][1] == 0) {
      statisticsSheet
        .getRange(i + 9, 1, 1, 5)
        .setValues([["", "", "", "", ""]])
        .setBorder(false, false, false, false, false, false);
    }
  }
  statisticsSheet
    .getRange(9, 1, statisticsSheet.getLastRow() - 8, 5)
    .setBorder(
      null,
      null,
      true,
      null,
      null,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_THICK,
    );
}

/** Get the failed Phases and fill it into the Statisticsheet
 */
function updateStatisticsLayout(amountOfPlayers, amountOfDays) {
  if(amountOfPlayers > statisticsSheet.getMaxRows() - 10){
    statisticsSheet.insertRowsAfter(statisticsSheet.getMaxRows(), amountOfPlayers - (statisticsSheet.getMaxRows() - 10))
  }
  if(amountOfDays > statisticsSheet.getMaxRows() - 10){
    statisticsSheet.insertRowsAfter(statisticsSheet.getMaxRows(), amountOfDays - (statisticsSheet.getMaxRows() - 10))
  }
  var rules = new Array();
  // Layout settings for the list of players including the Participation and first Deaths
  statisticsSheet
    .getRange(9, 1, amountOfPlayers, 1)
    .setBorder(
      null,
      null,
      null,
      true,
      null,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_THICK,
    );
  statisticsSheet
    .getRange(9, 3, amountOfPlayers, 1)
    .setBorder(
      null,
      null,
      null,
      true,
      null,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_THICK,
    );
  statisticsSheet.getRange(9, 2, amountOfPlayers, 1).setNumberFormat("#,##0");
  statisticsSheet.getRange(9, 3, amountOfPlayers, 1).setNumberFormat("#0.00%");
  statisticsSheet.getRange(9, 4, amountOfPlayers, 1).setNumberFormat("#,##0");
  statisticsSheet.getRange(9, 5, amountOfPlayers, 1).setNumberFormat("#0.00%");

  var ruleParticipation = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMaxpoint("#008B00")
    .setGradientMidpointWithValue(
      "#FFFF00",
      SpreadsheetApp.InterpolationType.PERCENTILE,
      "50",
    )
    .setGradientMinpoint("#FF0000")
    .setRanges([statisticsSheet.getRange(9, 3, amountOfPlayers, 1)])
    .build();
  var ruleFirstDeath = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMaxpoint("#FF0000")
    .setGradientMidpointWithValue(
      "#FFFF00",
      SpreadsheetApp.InterpolationType.PERCENTILE,
      "50",
    )
    .setGradientMinpoint("#008B00")
    .setRanges([statisticsSheet.getRange(9, 5, amountOfPlayers, 1)])
    .build();

  rules.push(ruleParticipation);
  rules.push(ruleFirstDeath);

  // Layout settings for the Matrix of Phases/Mechanics and Days
  statisticsSheet
    .getRange(9, 7, amountOfDays, 1)
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      "black",
      SpreadsheetApp.BorderStyle.SOLID_THICK,
    )
    .setFontWeight("bold");
  statisticsSheet
    .getRange(9, 8, amountOfDays, 10)
    .setBackground("#BEBEBE")
    .setFontWeight("normal");
  statisticsSheet.getRange(9, 8, amountOfDays, 14).setNumberFormat("#,##0");
  statisticsSheet
    .getRange(9, 7, 1, 15)
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

  for (var i = 0; i < amountOfDays; i++) {
    var values = removeEndingZeros(
      statisticsSheet.getRange(9 + i, 8, 1, 10).getValues()[0],
    );

    var rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpoint("#FF0000")
      .setGradientMidpointWithValue(
        "#FFFF00",
        SpreadsheetApp.InterpolationType.PERCENT,
        "50",
      )
      .setGradientMinpoint("#008B00")
      .setRanges([statisticsSheet.getRange(9 + i, 8, 1, values.length)])
      .build();

    rules.push(rule);
    statisticsSheet.getRange(9 + i, 8, 1, values.length).setFontWeight("bold");
  }
  for (var j = 0; j < 3; j++) {
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpoint("#FF0000")
      .setGradientMidpointWithValue(
        "#FFFF00",
        SpreadsheetApp.InterpolationType.PERCENT,
        "50",
      )
      .setGradientMinpoint("#008B00")
      .setRanges([statisticsSheet.getRange(10, 19 + j, amountOfDays - 1, 1)])
      .build();

    rules.push(rule);
    statisticsSheet
      .getRange(10, 19 + j, amountOfDays - 1, 1)
      .setFontWeight("bold");
  }
  statisticsSheet.setConditionalFormatRules(rules);
}
