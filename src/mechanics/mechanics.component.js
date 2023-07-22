/** Trigger to update mechanics
 *
 */
function updateMechanics() {
  var statusRange = mechanicSheet.getRange(41, 1),
    status = statusRange.getValue();
  if (occurrences(status, "in progress ...") == 0) {
    mechanicSheet.getRange(41, 1, 1, 1).setValues([["in progress ..."]]);
    fillMechanics();
    mechanicSheet.getRange(41, 1, 1, 1).setValues([["Complete!"]]);
  }
}

/** Fill the values for the Mechanics tab
 *
 */
function fillMechanics() {
  var playersToView = settingsSheet.getRange(2, 3).getValue(),
    mechanicsRange = mechanicSheet.getRange(1, 2, 37, playersToView * 3),
    mechanicsValue = mechanicsRange.getValues(),
    avgFailsMinPhases = [
      "Jormag",
      "Jormag",
      "Primordus",
      "Kralkatorrik",
      "Mordremoth",
      "Purification 3",
      "Soo-Won 1",
      "Soo-Won 1",
      "Purification 1",
    ],
    value = 0;

  for (var j = 0; j < 3; j++) {
    var days = j == 0 ? -1 : j == 1 ? 4 : 1;
    for (var i = 0; i < playersToView; i++) {
      var player = mechanicsValue[0 + j * 13][0 + i * 3];
      for (var n = 0; n <= mechanicsToCheck.length; n++) {
        mechanicsValue[n + 2 + j * 13][1 + i * 3] = getAmountOfMechanicFailes(
          logSheet
            .getRange(2, n + 19, logSheet.getLastRow() - 1, 1)
            .getValues(),
          player,
          days,
        );
        mechanicsValue[n + 2 + j * 13][0 + i * 3] = avgFailsPerTry(
          player,
          mechanicsValue[n + 2 + j * 13][1 + i * 3],
          avgFailsMinPhases[n],
          days,
        );
        value += 2;
        if (j > 0) {
          mechanicsValue[n + 2 + j * 13][2 + i * 3] =
            mechanicsValue[n + 2 + j * 13][0 + i * 3] <
            mechanicsValue[n + 2 + (j - 1) * 13][0 + i * 3]
              ? "+"
              : mechanicsValue[n + 2 + j * 13][0 + i * 3] ==
                mechanicsValue[n + 2 + (j - 1) * 13][0 + i * 3]
              ? "~"
              : mechanicsValue[n + 2 + j * 13][1 + i * 3] ==
                mechanicsValue[n + 2 + (j - 1) * 13][1 + i * 3]
              ? "~"
              : "-";
          value++;
        }
        mechanicSheet
          .getRange(41, 1, 1, 1)
          .setValues([
            [
              "in progress ... " +
                String(
                  +(
                    Math.round((value / (72 * playersToView)) * 100 + "e+2") +
                    "e-2"
                  ),
                ) +
                " %",
            ],
          ]);
      }
      mechanicsValue[0 + j * 13][0 + i * 3] = "='Setup und Co'!B" + (2 + i);
    }
  }
  mechanicsRange.setValues(mechanicsValue);
}

/** Calculate amount of mechanic fails
 * @param {any[][]} range  the range of data
 * @param {String} player  the player who failed the mechanic
 * @param {Integer} days   [Optional] calculate only the last x days
 * @return {Integer}       returns a number
 */
function getAmountOfMechanicFailes(range, player, days = -1) {
  var counter = 0;
  if (days == -1) {
    for (var i = 0; i < range.length; i++) {
      counter += occurrences(range[i], player);
    }
  } else {
    var dates = logSheet
        .getRange(2, 1, logSheet.getLastRow() - 1, 1)
        .getValues(),
      players = logSheet
        .getRange(2, 8, logSheet.getLastRow() - 1, 10)
        .getValues();
    for (var i = dates.length - 1; i >= 0; i--) {
      if (days > 0) {
        if (dates[i][0] == "") {
          for (var p = 0; p < players[i].length; p++) {
            if (players[i][p] == player) {
              counter += occurrences(range[i], player);
              break;
            }
          }
        } else {
          for (var p = 0; p < players[i].length; p++) {
            if (players[i][p] == player) {
              counter += occurrences(range[i], player);
              days--;
              break;
            }
          }
        }
      } else break;
    }
  }

  return counter;
}

/** Calculate the average fails per try
 * @param {String} player       the player who failed the mechanic
 * @param {Integer} totalValue  the amount of fails
 * @param {String} phase        Minimum reached phase
 * @param {Integer} days        [Optional] calculate only the last x days (Default:-1)
 * @return {Integer}            returns a number
 */
function avgFailsPerTry(player, totalValue, phase, days = -1) {
  var allowedPhases = [
    "Purification 1",
    "Jormag",
    "Primordus",
    "Kralkatorrik",
    "Purification 2",
    "Mordremoth",
    "Zhaitan",
    "Purification 3",
    "Soo-Won 1",
    "Purification 4",
    "Soo-Won 2",
  ];

  if (totalValue == 0) {
    return 0;
  }

  while (phase != allowedPhases[0]) {
    allowedPhases.shift();
  }
  var dates = logSheet.getRange(2, 1, logSheet.getLastRow() - 1, 1).getValues(),
    phases = logSheet.getRange(2, 4, logSheet.getLastRow() - 1, 1).getValues(),
    players = logSheet
      .getRange(2, 8, logSheet.getLastRow() - 1, 10)
      .getValues(),
    counter = 0;

  if (days == -1) {
    var filteredRows = phases.filter(
      (row, i) => allowedPhases.includes(row[0]) && players[i].includes(player),
    );
    counter = filteredRows.length;
  } else {
    for (var i = dates.length - 1; i >= 0; i--) {
      if (days > 0) {
        if (
          dates[i][0] == "" &&
          allowedPhases.includes(phases[i][0]) &&
          players[i].includes(player)
        ) {
          counter++;
        } else if (
          allowedPhases.includes(phases[i][0]) &&
          players[i].includes(player)
        ) {
          counter++;
          days--;
        } else if (dates[i][0] != "" && players[i].includes(player)) {
          days--;
        }
      } else break;
    }
  }
  return totalValue / counter;
}
