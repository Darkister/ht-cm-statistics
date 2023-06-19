/** create basic layout for the tab Mechanics
 *
 */
function createMechanicsLayout() {
  var rules = new Array();
  if (mechanicsSheet == null) {
    ss.insertSheet("Mechanics", 3);
    mechanicsSheet = ss.getSheetByName("Mechanics");
  }

  while (mechanicsSheet.getMaxColumns() < 31) {
    mechanicsSheet.insertColumns(mechanicsSheet.getMaxColumns(), 1);
  }
  mechanicsSheet.getRange(40, 1, 1, 1).setValues([["Update Status:"]]);
  mechanicsSheet.getRange(40, 1, 2, 1).setFontWeight("bold");

  var mechanicsRange = mechanicsSheet.getRange(1, 1, 39, 31),
    mechanicsValue = mechanicsRange.getValues();

  mechanicsRange.setBorder(false, false, false, false, false, false);
  mechanicsValue[0][0] = "Mechanics failed OverAll";
  mechanicsValue[13][0] = "Mechanics failed last 4 days";
  mechanicsValue[26][0] = "Mechanics failed last day";

  for (var j = 0; j < 3; j++) {
    for (var i = 0; i < 10; i++) {
      mechanicsValue[0 + j * 13][1 + i * 3] = "='Setup und Co'!B" + (2 + i);
      mechanicsValue[1 + j * 13][1 + i * 3] = "AVG";
      mechanicsValue[1 + j * 13][2 + i * 3] = "Total";
      if (j > 0) {
        mechanicsValue[1 + j * 13][3 + i * 3] = "'+-~";
      }
      mechanicsSheet.getRange(1 + j * 13, 2 + i * 3, 1, 3).mergeAcross();
      mechanicsSheet
        .getRange(1 + j * 13, 2 + i * 3, 2, 3)
        .setFontWeight("bold")
        .setBorder(
          true,
          true,
          true,
          true,
          true,
          true,
          "black",
          SpreadsheetApp.BorderStyle.SOLID
        );
      mechanicsSheet
        .getRange(1 + j * 13, 2 + i * 3, 11, 3)
        .setBorder(
          true,
          true,
          true,
          true,
          null,
          null,
          "black",
          SpreadsheetApp.BorderStyle.SOLID
        );
      mechanicsSheet
        .getRange(3 + j * 13, 2 + i * 3, 9, 1)
        .setNumberFormat("#,##0.000");
      mechanicsSheet
        .getRange(3 + j * 13, 3 + i * 3, 9, 1)
        .setNumberFormat("#,##0");
    }
    mechanicsValue[1 + j * 13][0] = "Mechanic";
    mechanicsValue[2 + j * 13][0] = "=Logs!$S$1";
    mechanicsValue[3 + j * 13][0] = "=Logs!$T$1";
    mechanicsValue[4 + j * 13][0] = "=Logs!$U$1";
    mechanicsValue[5 + j * 13][0] = "=Logs!$V$1";
    mechanicsValue[6 + j * 13][0] = "=Logs!$W$1";
    mechanicsValue[7 + j * 13][0] = "=Logs!$X$1";
    mechanicsValue[8 + j * 13][0] = "=Logs!$Y$1";
    mechanicsValue[9 + j * 13][0] = "=Logs!$Z$1";
    mechanicsValue[10 + j * 13][0] = "=Logs!$AA$1";
    mechanicsSheet.getRange(1 + j * 13, 1, 11, 1).setFontWeight("bold");
    mechanicsSheet
      .getRange(1 + j * 13, 1, 11, 1)
      .setBorder(
        true,
        true,
        true,
        true,
        true,
        true,
        "black",
        SpreadsheetApp.BorderStyle.SOLID
      );

    for (var r = 0; r < 9; r++) {
      var num = 3 + r + j * 13;
      ranges = new Array();
      for (var c = 0; c < 10; c++) {
        ranges.push(mechanicsSheet.getRange(num, 2 + c * 3));
      }
      var defaultRule = SpreadsheetApp.newConditionalFormatRule()
        .whenNumberEqualTo(0)
        .setBackground("#008B00")
        .setRanges(ranges)
        .build();

      rules.push(defaultRule);

      var rule = SpreadsheetApp.newConditionalFormatRule()
        .setGradientMaxpoint("#FF0000")
        .setGradientMidpointWithValue(
          "#FFFF00",
          SpreadsheetApp.InterpolationType.PERCENTILE,
          "50"
        )
        .setGradientMinpoint("#008B00")
        .setRanges(ranges)
        .build();

      rules.push(rule);
    }
  }

  var ranges = new Array();
  for (var a = 0; a < 10; a++) {
    ranges.push(mechanicsSheet.getRange(16, 4 + a * 3, 9, 1));
    ranges.push(mechanicsSheet.getRange(29, 4 + a * 3, 9, 1));
  }
  var plusRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("+")
    .setBackground("#B7E1CD")
    .setRanges(ranges)
    .build();
  var minusRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains("-")
    .setBackground("#E67C73")
    .setRanges(ranges)
    .build();

  rules.push(plusRule);
  rules.push(minusRule);

  mechanicsSheet.setConditionalFormatRules(rules);

  mechanicsRange
    .setValues(mechanicsValue)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  mechanicsSheet
    .autoResizeColumns(1, 1)
    .setColumnWidths(2, 30, 50)
    .setFrozenColumns(1);
}
