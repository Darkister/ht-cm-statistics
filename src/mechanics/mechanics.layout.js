/** create basic layout for the tab Mechanics
 *
 */
function createMechanicsLayout(players = 10) {
  var rules = new Array();
  if (mechanicSheet == null) {
    ss.insertSheet("Mechanics", 3);
    mechanicSheet = ss.getSheetByName("Mechanics");
  }

  while (mechanicSheet.getMaxColumns() < 3 * players + 1) {
    mechanicSheet.insertColumns(mechanicSheet.getMaxColumns(), 1);
  }
  mechanicSheet.getRange(40, 1, 1, 1).setValues([["Update Status:"]]);
  mechanicSheet.getRange(40, 1, 2, 1).setFontWeight("bold");

  var mechanicsRange = mechanicSheet.getRange(1, 1, 39, 31),
    mechanicsValue = mechanicsRange.getValues();

  mechanicsRange.setBorder(false, false, false, false, false, false);
  mechanicsValue[0][0] = "Mechanics failed OverAll";
  mechanicsValue[13][0] = "Mechanics failed last 4 days";
  mechanicsValue[26][0] = "Mechanics failed last day";

  for (var j = 0; j < 3; j++) {
    for (var i = 0; i < players; i++) {
      mechanicsValue[0 + j * 13][1 + i * 3] = "='Setup und Co'!B" + (2 + i);
      mechanicsValue[1 + j * 13][1 + i * 3] = "AVG";
      mechanicsValue[1 + j * 13][2 + i * 3] = "Total";
      if (j > 0) {
        mechanicsValue[1 + j * 13][3 + i * 3] = "'+-~";
      }
      mechanicSheet.getRange(1 + j * 13, 2 + i * 3, 1, 3).mergeAcross();
      mechanicSheet
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
          SpreadsheetApp.BorderStyle.SOLID,
        );
      mechanicSheet
        .getRange(1 + j * 13, 2 + i * 3, 11, 3)
        .setBorder(
          true,
          true,
          true,
          true,
          null,
          null,
          "black",
          SpreadsheetApp.BorderStyle.SOLID,
        );
      mechanicSheet
        .getRange(3 + j * 13, 2 + i * 3, 9, 1)
        .setNumberFormat("#,##0.000");
      mechanicSheet
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
    mechanicSheet.getRange(1 + j * 13, 1, 11, 1).setFontWeight("bold");
    mechanicSheet
      .getRange(1 + j * 13, 1, 11, 1)
      .setBorder(
        true,
        true,
        true,
        true,
        true,
        true,
        "black",
        SpreadsheetApp.BorderStyle.SOLID,
      );

    for (var r = 0; r < 9; r++) {
      var num = 3 + r + j * 13;
      ranges = new Array();
      for (var c = 0; c < 10; c++) {
        ranges.push(mechanicSheet.getRange(num, 2 + c * 3));
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
          "50",
        )
        .setGradientMinpoint("#008B00")
        .setRanges(ranges)
        .build();

      rules.push(rule);
    }
  }

  var ranges = new Array();
  for (var a = 0; a < players; a++) {
    ranges.push(mechanicSheet.getRange(16, 4 + a * 3, 9, 1));
    ranges.push(mechanicSheet.getRange(29, 4 + a * 3, 9, 1));
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

  mechanicSheet.setConditionalFormatRules(rules);

  mechanicsRange
    .setValues(mechanicsValue)
    .setFontFamily("Arial")
    .setFontSize(11)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  mechanicSheet
    .autoResizeColumns(1, 1)
    .setColumnWidths(2, 30, 50)
    .setFrozenColumns(1);

  var cellPosition = "A43",
    imageUrl = mechanics_button_url,
    images = mechanicSheet.getImages(),
    isImageExisting = false;

  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    if (image.getAltTextTitle() === "mechanics_button") {
      isImageExisting = true;
      break;
    }
  }

  if (isImageExisting) {
    Logger.log("The image exists in the sheet.");
  } else {
    var image = UrlFetchApp.fetch(imageUrl),
      mechanic_button = mechanicSheet.insertImage(
        image,
        mechanicSheet.getRange(cellPosition).getColumn(),
        mechanicSheet.getRange(cellPosition).getRow(),
      );
    mechanic_button
      .assignScript("updateMechanics")
      .setAltTextTitle("mechanics_button");
  }
}

function rebuildMechanics(playersToView) {
  var range = mechanicSheet.getRange(
    1,
    2,
    mechanicSheet.getLastRow(),
    mechanicSheet.getLastColumn() - 1,
  );
  range.clearContent().clearFormat().clearDataValidations();
  createMechanicsLayout(playersToView);
}
