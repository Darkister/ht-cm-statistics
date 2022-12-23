function apiFetch(permalink) {
  var opt = {
    contentType: "application/json",
    muteHttpExceptions: true
  };

  var data = UrlFetchApp.fetch('https://dps.report/getJson?permalink=' + permalink, opt);
  data = data.getContentText();

  return JSON.parse(data);
}

/**
 * Get data of a log
 *
 * @param {String} link - permalink of the Encounter
 */
function writeDataIntoSpreadsheet(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Logs');
  var startRow = 2;
  var logs = sheet.getRange(startRow,2,sheet.getLastRow()-1,1).getValues();

  for(var i = 0; i < logs.length; i++){
    var valuesRange = sheet.getRange(i+startRow,3,1,15);
    var values = valuesRange.getValues();

    try{
      var log = logs[i][0];
      Logger.log("Next Log to calculate: " + log);
      var json = apiFetch(log);
      var column = 0;
      values[0][column] = fightDuration(json);
      column++;
      var endphase = endPhase(json);
      values[0][column] = endphase;
      column++;
      values[0][column] = bossHPendPhase(json, endphase);
      column++;
      values[0][column] = isValid(json);
      column++;
      values[0][column] = firstDeath(json);
      column++;
      var players = getPlayer(json);
      for(p = 0; p < players.length; p++){
        values[0][column] = players[p];
        column++;
      }
    }
    catch(e){
      console.error('apiFetch yielded error: ' + e);
      Logger.log('Continue with Dummy data');
      for (var c = 0; c < values[0].length; c++) {
        values[0][c] = i + " / " + c;
      }
    }

    valuesRange.setValues(values);
  }
}

/**
 * returns the duration of the fight
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {String} - returns the duration of the given fight in human readable format
 */
function fightDuration(json){
  var duration = json.duration;
  return duration;
}

/**
 * Checks the Phase in which the fight ends
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {String} - returns the phase in which the give fight ends
 */
function endPhase(json){
  var phases = json.phases;
  var phase = phases[phases.length - 1].name
  var validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Leere-Salzgischtdrachen","Purification 3","SooWon"];
  if(validPhases.includes(phase)){
    return phase;
  }
  else{
    return phases[phases.length - 2].name;
  }
}

/**
 * Checks the rest hp of the boss where the fight ends
 *
 * @param {String} json - fightData as json of the Encounter
 * @param {String} boss - boss name where the encounter ends
 * @return {String} - returns hp in percent as decimal
 */
function bossHPendPhase(json, boss){
  var targets = json.targets;
  var targetValues = ["Heart 1","The JormagVoid","The PrimordusVoid","The KralkatorrikVoid","Zeitzauberer der Leere","Heart 2","The MordremothVoid","The ZhaitanVoid","The SooWonVoid"];
  var searchName = "";
  if(boss == "Purification 1"){
    searchName = "Heart 1";
  }
  else if(boss == "Jormag"){
    searchName = "The JormagVoid";
  }
  else if(boss == "Primordus"){
    searchName = "The PrimordusVoid";
  }
  else if(boss == "Kralkatorrik"){
    searchName = "The KralkatorrikVoid";
  }
  else if(boss == "Zeitzauberer der Leere"){
    searchName = "Zeitzauberer der Leere";
  }
  else if(boss == "Purification 2"){
    searchName = "Heart 2";
  }
  else if(boss == "Mordremoth"){
    searchName = "The MordremothVoid";
  }
  else if(boss == "Zhaitan"){
    searchName = "The ZhaitanVoid";
  }
  else if(boss == "SooWon"){
    searchName = "The SooWonVoid";
  }
  for(var i = 0; i < targets.length; i++){
    if(targets[i].name == searchName){
      return (100 - targets[i].healthPercentBurned) / 100;
    }
  }
}

/**
 * Validateds the fight and returns the validation as boolean
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {Boolean} - returns a boolean depending on validation of the encounter
 */
function isValid(json){
  var duration = json.durationMS;
  if(duration > 60000){
    return true;
  }
  return false;
}

/**
 * Get Accountname of first death player for given Encounter
 *
 * @param {String} json - fightData as json of the Encounter
 * * @return {String} - returns the first death player of the given fight
 */
function firstDeath(json){
  var mechanics = json.mechanics;
  var players = json.players;
  for(var i = 0; i < mechanics.length; i++){
    if(mechanics[i].name == 'Dead'){
      var playername =  mechanics[i].mechanicsData[0].actor;
      for(var p = 0; p < players.length; p++){
        if(playername == players[p].name){
          return players[p].account;
        }
      }
    }
  }
}

/**
 * Checks players of the given fight
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {String[]} - returns a Array which contains all players Accountnames
 */
function getPlayer(json){
  var allPlayersInfo = json.players;
  var players = new Array(10);
  for(var i = 0; i < allPlayersInfo.length; i++){
    players[i] = allPlayersInfo[i].account;
  }

  return players;
}

/**
 * Checks given list of data for the best try
 *
 * @param {any[][]} data - fightData as json of the Encounter
 * @return {String} - returns the link to the best try
 * @customfunction
 */
function getBestTry(data){
  var targets =  ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","SooWon"];
  var phaseNoCurr = 0;
  var bestPercCurr = 0;
  var bestTryCurr = 0;

  for(var i = 0; i < data.length; i++){
    var phaseNoCheck = 0;
    var bestPercCheck = data[i][1];
    for(var p = 0; p < targets.length; p++){
      if(data[i][0] == targets[p]){
        phaseNoCheck = p;
      }
    }

    if(phaseNoCurr = phaseNoCheck){
      if(bestPercCurr > bestPercCheck){
        bestPercCurr = bestPercCheck;
        bestTryCurr = i;
      }
    }
    else if(phaseNoCurr < phaseNoCheck){
      phaseNoCurr = phaseNoCheck;
      bestTryCurr = i;
    }
  }
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Logs');
  var startRow = 2;
  var logs = sheet.getRange(startRow,2,sheet.getLastRow()-1,1).getValues();

  return logs[bestTryCurr][0]
}




