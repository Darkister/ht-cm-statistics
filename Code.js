var validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Void Saltspray Dragon","Purification 3","Soo-Won 1","Purification 4","Soo-Won 2"],
    targetValues = ["Heart 1","The JormagVoid","The PrimordusVoid","The KralkatorrikVoid","Zeitzauberer der Leere","Heart 2","The MordremothVoid","The ZhaitanVoid","Void Saltspray Dragon","Heart 3","The SooWonVoid","Heart 4"],
    ss = SpreadsheetApp.getActiveSpreadsheet(),
    logSheet = ss.getSheetByName('Logs');

/** Trigger to check that dps.reports are entered into the correct space and to automatically run writeDataIntoSpreadsheet when the input ios valid
 *  @param {*} e 
 */
function editTrigger(e) {
  var targetCol = 2,
      inputIsValid = false,
      inputIsEmpty = false,
      values = e.range.getValues();
  
  Logger.log(values);

  // simple logic to validate the input
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

  if(e && e.range && e.range.getRow() && e.range.getColumn() === targetCol && e.range.getSheet().getName() === "Logs"){
    if(inputIsValid){
      writeDataIntoSpreadsheet(e.range.getRow());
    }
    else if(inputIsEmpty){
      var range = logSheet.getRange(e.range.getRow(),e.range.getColumn()-1,1,25);
      range.clearContent();
    }
    else{
      var cell = logSheet.getRange(e.range.getRow(),e.range.getColumn() + 1);
      cell.setValue("Wrong records found, check the entries or contact an admin");
    }
  }
}

/** Write Data of the Log into the Spreadsheet
 *  @param {Integer} row  [OPTIONAL] defines where to start with the data writing
 */
function writeDataIntoSpreadsheet(row=2){
  var logs = logSheet.getRange(row,2,logSheet.getLastRow()-row+1,1).getValues(),
      date = "",
      cellsWithSameDate = 0,
      valuesRange = logSheet.getRange(row,1,logs.length,23),
      values = valuesRange.getValues();

  for(var i = 0; i < logs.length; i++){

    try{
      var log = logs[i][0];
      Logger.log("Next Log to calculate: " + log);
      var json = apiFetch(log),
          column = 0,
          dateOfLog = getDayOfLog(json);
      if(date == ""){
        date = dateOfLog;
        values[i][column] = dateOfLog;
        cellsWithSameDate++;
      }
      else if(date != dateOfLog){
        date = dateOfLog;
        values[i][column] = dateOfLog;
        cellsWithSameDate = 1;
      }
      else if(date == dateOfLog){
        if(!logSheet.getRange(i+row,1,cellsWithSameDate+1,1).isPartOfMerge()){
          logSheet.getRange(i+row-cellsWithSameDate,1,cellsWithSameDate+1,1).mergeVertically();
          cellsWithSameDate++;
        }
        else{
          cellsWithSameDate++;
        }
      }
      column++;
      column++;
      values[i][column] = json.duration;
      column++;
      var endphase = getLatestValidPhase(json.phases);
      values[i][column] = endphase;
      column++;
      values[i][column] = bossHPendPhase(json, endphase);
      column++;
      values[i][column] = json.durationMS > 60000 ? true : false;
      column++;
      values[i][column] = firstDeath(json);
      column++;
      var players = getPlayer(json);
      for(p = 0; p < 10; p++){
        values[i][column] = players[p];
        column++;
      }
      values[i][column] = failedOnGreen(json);
      column++;
      var mechanicsToCheck = ["Void.D","J.Breath.H","Slam.H","Barrage.H","ShckWv.H"];
      for(var m = 0; m < mechanicsToCheck.length; m++){
        values[i][column] = failedMechanic(json, mechanicsToCheck[m]);
        column++;
      }
    }
    catch(e){
      console.error('apiFetch yielded error: ' + e);
      Logger.log('Continue with Dummy data');
      for (var c = 0; c < values[0].length; c++) {
        if(c != 1){
          values[i][c] = i + " / " + c;
        }
      }
    }
  }
  valuesRange.setValues(values);
}

/** Get data of a log as json
 *  @param {String} link  permalink of the Encounter
 *  @return {String}      returns the full encounterinformation as json
 */
function apiFetch(permalink) {
  var opt = {
    contentType: "application/json",
    muteHttpExceptions: true
  },
      data = UrlFetchApp.fetch('https://dps.report/getJson?permalink=' + permalink, opt);

  data = data.getContentText();
  return JSON.parse(data);
}

/** Checks the latest valid Phase in which the fight ends based on the variable validPhases
 *  @param {String} phases  the phases of the fight as json
 *  @return {String}        returns the latest valid phase in which the give fight ends
 */
function getLatestValidPhase(phases){
  var phase = phases[phases.length -1].name;
  if(validPhases.includes(phase)){
    return phase;
  }
  else{
    return getLatestValidPhase(phases.slice(0,phases.length -1));
  }
}

/** Checks the rest hp of the boss where the fight ends
 *  @param {String} json  fightData as json of the Encounter
 *  @param {String} boss  boss name where the encounter ends
 *  @return {String}      returns hp in percent as decimal
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

/** Get Accountname of first death player for given Encounter
 *  @param {String} json  fightData as json of the Encounter
 *  @return {String}      returns the first death player of the given fight
 */
function firstDeath(json){
  var mechanics = json.mechanics,
      players = json.players;

  for(var i = 0; i < mechanics.length; i++){
    if(mechanics[i].name == 'Dead'){
      var playername = mechanics[i].mechanicsData[0].actor;
      for(var p = 0; p < players.length; p++){
        if(playername == players[p].name){
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
function getPlayer(json){
  var allPlayersInfo = json.players,
      players = new Array(10);

  for(var i = 0; i < allPlayersInfo.length; i++){
    players[i] = allPlayersInfo[i].account;
  }

  return players;
}

/** Get the Day where the try was made
 *  @param {String} json  fightData as json of the Encounter
 *  @return {String}      returns a date
 */
function getDayOfLog(json){
  var timeStart = json.timeStart,
      date = timeStart.split("-"),
      year = date[0],
      month = date[1],
      day = date[2].split(" ")[0];
  return day + "." + month + "." + year
}

/** Get info that try failed on green mechanic
 *  This function is experimental and based on a custom logic
 *  @param {String} json  fightData as json of the Encounter
 *  @return {Boolean}     returns a date
 */
function failedOnGreen(json){
  var mechanics = json.mechanics,
      downs,
      amountOverNine;

  try{
    for(var i = 0; i < mechanics.length; i++){
      if(mechanics[i].name == "Downed"){
        downs = mechanics[i];
        break;
      }
    }

    var time = 0,
        timesAmount = 0;

    for(var t = 0; t < downs.mechanicsData.length; t++){
      if(downs.mechanicsData[t].time != time){
        time = downs.mechanicsData[t].time;
        timesAmount = 1;
      }
      else if(downs.mechanicsData[t].time == time){
        timesAmount++;
      }
    }

    timesAmount > 8 ? amountOverNine = true : amountOverNine = false;
  
    return amountOverNine;
  }
  catch{ 
    return false;
  }
}

/** Get info that players failed a given mechanic
 *  @param {String} json      fightData as json of the Encounter
 *  @param {String} mechanic  the name of the mechanic
 *  @return {String}          returns a string with all players in a row who failed the given mechanic
 */
function failedMechanic(json, mechanic){
  var mechanics = json.mechanics,
      players = json.players,
      mechanicData;

  try{
    for(var i = 0; i < mechanics.length; i++){
      if(mechanics[i].name == mechanic){
        mechanicData = mechanics[i];
        break;
      }
    }
    var accountnames = "";
    for(var t = 0; t < mechanicData.mechanicsData.length; t++){
      var playername = mechanicData.mechanicsData[t].actor;
      for(var p = 0; p < players.length; p++){
        var specialMechanics = ["Slam.H","ShckWv.H"];
        if(playername == players[p].name && specialMechanics.indexOf(mechanic) > -1){
          if(accountnames == ""){
            return players[p].account;
          }
          else break;
        }
        else if(playername == players[p].name){
          accountnames += players[p].account;
          break;
        }    
      }
    } 
    return accountnames;
  }
  catch{
    return false;
  }
}
