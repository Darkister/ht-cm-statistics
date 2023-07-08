/** Write Data of the Log into the Spreadsheet
 *  @param {Integer} row  [OPTIONAL] defines where to start with the data writing
 */
function writeDataIntoSpreadsheet(logs) {
  var row = logSheet.getLastRow(),
    date = "",
    cellsWithSameDate = 0,
    valuesRange = logSheet.getRange(row, 1, logs.length, 28),
    values = new Array();

  for (var i = 0; i < logs.length; i++) {
    if (!(i in values)) {
      values.push([]);
    }
    try {
      var log = logs[i];
      Logger.log("Next Log to calculate: " + log);
      var json = apiFetch(log),
        dateOfLog = getDayOfLog(json);
      if (date == "") {
        date = dateOfLog;
        cellsWithSameDate++;
      } else if (date != dateOfLog) {
        date = dateOfLog;
        cellsWithSameDate = 1;
      } else if (date == dateOfLog) {
        if (
          !logSheet
            .getRange(i + row, 1, cellsWithSameDate + 1, 1)
            .isPartOfMerge()
        ) {
          logSheet
            .getRange(i + row - cellsWithSameDate, 1, cellsWithSameDate + 1, 1)
            .mergeVertically();
        }
        cellsWithSameDate++;
      }
      values[i].push(dateOfLog);
      values[i].push(log);
      values[i].push(json.duration);
      var endphase = getLatestValidPhase(json.phases);
      values[i].push(endphase);
      values[i].push(bossHPendPhase(json, endphase));
      values[i].push(json.durationMS > 60000);
      values[i].push(firstDeath(json));
      var players = getPlayer(json);
      for (p = 0; p < 10; p++) {
        values[i].push(players[p]);
      }
      values[i].push(failedOnGreen(json));

      for (var m = 0; m < mechanicsToCheck.length; m++) {
        values[i].push(failedMechanic(json, mechanicsToCheck[m]));
      }
      values[i].push(getDebilitatedDebuff(json));
      values[i].push(allPlayerDownOnFirstDeath(json));
    } catch (e) {
      console.error("apiFetch yielded error: " + e);
      Logger.log("Continue with Dummy data");
      for (var c = 0; c < values[0].length; c++) {
        if (c != 1) {
          values[i][c] = i + " / " + c;
        }
      }
    }
  }
  Logger.log(values);
  valuesRange
    .setValues(values)
    .setBorder(
      true,
      true,
      true,
      true,
      true,
      null,
      "black",
      SpreadsheetApp.BorderStyle.SOLID
    )
    .setFontWeight("normal")
    .setFontFamily("Arial")
    .setFontSize("10")
    .setBackground("#FFFFFF")
    .setFontColor("#000000");
  logSheet.getRange(row, 1, logs.length, 1).setFontWeight("bold");
  logSheet.getRange(row, 2, logs.length, 1).setFontColor("#00B2EE");
  logSheet.getRange(row, 5, logs.length, 1).setNumberFormat("#0.00%");
}

/** Get data of a log as json
 *  @param {String} link  permalink of the Encounter
 *  @return {String}      returns the full encounterinformation as json
 */
function apiFetch(permalink) {
  var opt = {
      contentType: "application/json",
      muteHttpExceptions: true,
    },
    data = UrlFetchApp.fetch(
      "https://dps.report/getJson?permalink=" + permalink,
      opt
    );

  data = data.getContentText();
  return JSON.parse(data);
}

/** Checks the latest valid Phase in which the fight ends based on the variable validPhases
 *  @param {String} phases  the phases of the fight as json
 *  @return {String}        returns the latest valid phase in which the give fight ends
 */
function getLatestValidPhase(phases) {
  var phase = phases[phases.length - 1].name;
  if (
    phase == "Purification 1" ||
    phase == "Jormag" ||
    phase == "Primordus" ||
    phase == "Kralkatorrik" ||
    phase == "Purification 2" ||
    phase == "Mordremoth" ||
    phase == "Zhaitan" ||
    phase == "Purification 3" ||
    phase == "Soo-Won 1" ||
    phase == "Soo-Won 2" ||
    phase == "Purification 4"
  ) {
    return phase;
  }
  if (phase.includes("Heart 1")) {
    return "Purification 1";
  } else if (
    phase.includes("Zeitzauberer") ||
    phase.includes("Time Caster") ||
    phase.includes("Heart 2")
  ) {
    return "Purification 2";
  } else if (phase.includes("Giants")) {
    return "Zhaitan";
  } else if (
    phase.includes("Salzgischtdrachen") ||
    phase.includes("Saltspray Dragon") ||
    phase.includes("Heart 3")
  ) {
    return "Purification 3";
  } else if (phase == "Soo-Won") {
    return "Soo-Won 1";
  } else if (
    phase.includes("Vernichter") ||
    phase.includes("Goliath") ||
    phase.includes("Obliterator")
  ) {
    return "Soo-Won 2";
  }
  return phase;
}

/** Checks the rest hp of the boss where the fight ends
 *  @param {String} json  fightData as json of the Encounter
 *  @param {String} boss  boss name where the encounter ends
 *  @return {Integer}      returns hp in percent as decimal
 */
function bossHPendPhase(json, boss) {
  var targets = json.targets;
  var searchName = "";
  if (boss == "Purification 1") {
    searchName = targetValues[0];
  } else if (boss == "Jormag") {
    searchName = targetValues[1];
  } else if (boss == "Primordus") {
    searchName = targetValues[2];
  } else if (boss == "Kralkatorrik") {
    searchName = targetValues[3];
  } else if (boss == "Purification 2") {
    searchName = targetValues[4];
  } else if (boss == "Mordremoth") {
    searchName = targetValues[5];
  } else if (boss == "Zhaitan") {
    searchName = targetValues[6];
  } else if (boss == "Purification 3") {
    searchName = targetValues[7];
  } else if (boss == "Soo-Won 1" || boss == "Soo-Won 2") {
    searchName = targetValues[8];
  } else if (boss == "Purification 4") {
    searchName = targetValues[9];
  }

  for (var i = 0; i < targets.length; i++) {
    if (targets[i].name == searchName) {
      return (100 - targets[i].healthPercentBurned) / 100;
    }
  }
}

/** Get Accountname of first death player for given Encounter
 *  @param {String} json  fightData as json of the Encounter
 *  @return {String}      returns the first death player of the given fight
 */
function firstDeath(json) {
  var mechanics = json.mechanics,
    players = json.players;

  for (var i = 0; i < mechanics.length; i++) {
    if (mechanics[i].name == "Dead") {
      var playername = mechanics[i].mechanicsData[0].actor;
      for (var p = 0; p < players.length; p++) {
        if (playername == players[p].name) {
          return players[p].account;
        }
      }
    }
  }
}

/** Checks players of the given fight
 *  @param {String} json  fightData as json of the Encounter
 *  @return {String[]}    returns a Array which contains all players Accountnames
 */
function getPlayer(json) {
  var allPlayersInfo = json.players,
    players = new Array(10);

  for (var i = 0; i < allPlayersInfo.length; i++) {
    players[i] = allPlayersInfo[i].account;
  }

  return players;
}

/** Get the Day where the try was made
 *  @param {String} json  fightData as json of the Encounter
 *  @return {String}      returns a date
 */
function getDayOfLog(json) {
  var timeStart = json.timeStart,
    date = timeStart.split("-"),
    year = date[0],
    month = date[1],
    day = date[2].split(" ")[0];
  return day + "." + month + "." + year;
}

/** Get info that try failed on green mechanic
 *  This function is experimental and based on a custom logic
 *  @param {String} json  fightData as json of the Encounter
 *  @return {Boolean}     returns a boolean
 */
function failedOnGreen(json) {
  var mechanics = json.mechanics,
    downs;

  try {
    for (var i = 0; i < mechanics.length; i++) {
      if (mechanics[i].name == "Downed") {
        downs = mechanics[i];
        break;
      }
    }

    var time = 0,
      timesAmount = 0;

    for (var t = 0; t < downs.mechanicsData.length; t++) {
      if (downs.mechanicsData[t].time != time) {
        time = downs.mechanicsData[t].time;
        timesAmount = 1;
      } else if (downs.mechanicsData[t].time == time) {
        timesAmount++;
      }
    }

    return timesAmount > 8;
  } catch {
    return false;
  }
}

/**
 *
 */
function allPlayerDownOnFirstDeath(json) {
  var mechanics = json.mechanics,
    dead,
    downs,
    res,
    firstDeathTime,
    lastDownTime;

  try {
    for (var i = 0; i < mechanics.length; i++) {
      if (mechanics[i].name == "Dead") {
        dead = mechanics[i].mechanicsData;
        break;
      }
    }

    for (var i = 0; i < mechanics.length; i++) {
      if (mechanics[i].name == "Downed") {
        downs = mechanics[i].mechanicsData;
        break;
      }
    }

    firstDeathTime = dead[0].time;
    lastDownTime = downs[downs.length - 1].time;
  } catch {
    return false;
  }
  try {
    for (var i = 0; i < mechanics.length; i++) {
      if (mechanics[i].name == "Got up") {
        res = mechanics[i].mechanicsData;
        break;
      }
    }

    var firstDownTime = downs[downs.length - 10].time;
    var lastResTime = res[res.length - 1].time;

    return lastResTime < firstDownTime && firstDeathTime > lastDownTime;
  } catch {
    return downs.length >= 10 && firstDeathTime > lastDownTime;
  }
}

/** Get all players who recieved debilitated Debuff
 *
 */
function getDebilitatedDebuff(json) {
  var players = json.players;
  var hits = "";
  for (var i = 0; i < players.length; i++) {
    var buffs = players[i].buffUptimes;
    var debilitated = buffs.find(({ id }) => id == 67972);
    try {
      var states = debilitated.states;
      Logger.log(states);
      for (var s = 0; s < states.length - 1; s++) {
        if (states[s][1] <= states[s + 1][1]) {
          hits = hits + players[i].account;
        }
      }
    } catch {}
  }
  return hits;
}
