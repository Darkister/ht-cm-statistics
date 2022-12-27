var validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Void Saltspray Dragon","Purification 3","Soo-Won 1","Purification 4","Soo-Won 2"];
var targetValues = ["Heart 1","The JormagVoid","The PrimordusVoid","The KralkatorrikVoid","Zeitzauberer der Leere","Heart 2","The MordremothVoid","The ZhaitanVoid","Void Saltspray Dragon","Heart 3","The SooWonVoid","Heart 4"];

/**
 * @param {*} e 
 */
function editTrigger(e) {
  
  var targetCol = 2;
  var targetSheet = "Logs";
  var inputIsValid = false;
  var inputIsEmpty = false;
  var values = e.range.getValues();
  Logger.log(values);

  for(var i = 0; i < values.length; i++){
    if(values[i][0].toString().includes('https://dps.report/')){
      inputIsValid = true;
    }
    else{
      if(values[i][0].toString() == ""){
        inputIsEmpty = true;
      }
      else{
        inputIsValid = false;
        break;
      }
    }
  }

  if (e && e.range && e.range.getRow() && e.range.getColumn() === targetCol && e.range.getSheet().getName() === targetSheet && inputIsValid) {
    writeDataIntoSpreadsheet(e.range.getRow());
  }
  else if(e && e.range && e.range.getRow() && e.range.getColumn() === targetCol && e.range.getSheet().getName() === targetSheet && inputIsEmpty){
    var range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheet).getRange(e.range.getRow(),e.range.getColumn()-1,1,25);
    range.clearContent();
  }
  else if(e && e.range && e.range.getRow() && e.range.getColumn() === targetCol && e.range.getSheet().getName() === targetSheet){
    var cell = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(targetSheet).getRange(e.range.getRow(),e.range.getColumn() + 1);
    cell.setValue("Wrong records found, check the entries or contact an admin");
  }
}

/**
 * Write Data of the Log into the Spreadsheet
 * @param {Integer} row - [OPTIONAL] defines where to start with the data writing
 */
function writeDataIntoSpreadsheet(row=2){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Logs');
  var startRow = row;
  var logs = sheet.getRange(startRow,2,sheet.getLastRow()-startRow+1,1).getValues();
  var date = "";
  var cellsWithSameDate = 0;

  for(var i = 0; i < logs.length; i++){
    var valuesRange = sheet.getRange(i+startRow,1,1,18);
    var values = valuesRange.getValues();

    try{
      var log = logs[i][0];
      Logger.log("Next Log to calculate: " + log);
      var json = apiFetch(log);
      var column = 0;
      var dateOfLog = getDayOfLog(json);
      if(date == ""){
        date = dateOfLog;
        values[0][column] = dateOfLog;
        cellsWithSameDate++;
      }
      else if(date != dateOfLog){
        date = dateOfLog;
        values[0][column] = dateOfLog;
        cellsWithSameDate = 1;
      }
      else if(date == dateOfLog){
        if(!valuesRange.isPartOfMerge()){
          sheet.getRange(i+startRow-cellsWithSameDate,1,cellsWithSameDate+1,1).mergeVertically();
          cellsWithSameDate++;
        }
        else{
          cellsWithSameDate++;
        }
      }
      column++;
      column++;
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
      values[0][column] = failedOnGreen(json);
    }
    catch(e){
      console.error('apiFetch yielded error: ' + e);
      Logger.log('Continue with Dummy data');
      for (var c = 0; c < values[0].length; c++) {
        if(c != 1){
          values[0][c] = i + " / " + c;
        }
      }
    }

    valuesRange.setValues(values);
  }
}

/**
 * Get data of a log as json
 *
 * @param {String} link - permalink of the Encounter
 * @return {String} - returns the full encounterinformation as json
 */
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
  var phase = phases[phases.length - 1].name;
  return getLatestValidPhase(phases)
}

function getLatestValidPhase(phases){
  var phase = phases[phases.length -1].name;
  if(validPhases.includes(phase)){
    return phase;
  }
  else{
    return getLatestValidPhase(phases.slice(0,phases.length -1));
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
  var searchName = "";
  if(boss == "Purification 1"){
    searchName = targetValues[0];
  }
  else if(boss == "Jormag"){
    searchName = targetValues[1];
  }
  else if(boss == "Primordus"){
    searchName = targetValues[2];
  }
  else if(boss == "Kralkatorrik"){
    searchName = targetValues[3];
  }
  else if(boss == "Zeitzauberer der Leere"){
    searchName = targetValues[4];
  }
  else if(boss == "Purification 2"){
    searchName = targetValues[5];
  }
  else if(boss == "Mordremoth"){
    searchName = targetValues[6];
  }
  else if(boss == "Zhaitan"){
    searchName = targetValues[7];
  }
  else if(boss == "Salzgischtdrache der Leere"){
    searchName = targetValues[8];
  }
  else if(boss == "Purification 3"){
    searchName = targetValues[9];
  }
  else if(boss == "Soo-Won"){
    searchName = targetValues[10];
  }
  else if(boss == "Purification 4"){
    searchName = targetValues[10];
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
 * @return {String} - returns the first death player of the given fight
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
 * Get the Day where the try was made
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {String} - returns a date
 */
function getDayOfLog(json){
  var timeStart = json.timeStart;
  var date = timeStart.split("-");
  var year = date[0];
  var month = date[1];
  var day = date[2].split(" ")[0];
  return day + "." + month + "." + year
}

/**
 * Get info that try failed on green mechanic
 * This function is very experimental
 *
 * @param {String} json - fightData as json of the Encounter
 * @return {Boolean} - returns a date
 */
function failedOnGreen(json){
  var mechanics = json.mechanics;
  var downs;
  try{
    for(var i = 0; i < mechanics.length; i++){
      if(mechanics[i].name == "Downed"){
        downs = mechanics[i];
        break;
      }
    }

    var time = 0;  
    var timesAmount = 0;
    for(var t = 0; t < downs.mechanicsData.length; t++){
      if(downs.mechanicsData[t].time != time){
        time = downs.mechanicsData[t].time;
        timesAmount = 1;
      }
      else if(downs.mechanicsData[t].time == time){
        timesAmount++;
      }
    }

    var amountOverNine = false;
    if(timesAmount > 8){
      amountOverNine = true;
    }
  
    return amountOverNine;
  }
  catch{ 
    return false;
  }
}