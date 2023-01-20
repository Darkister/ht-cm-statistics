var validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Void Saltspray Dragon","Purification 3","Soo-Won 1","Purification 4","Soo-Won 2"],
    targetValues = ["Heart 1","The JormagVoid","The PrimordusVoid","The KralkatorrikVoid","Zeitzauberer der Leere","Heart 2","The MordremothVoid","The ZhaitanVoid","Void Saltspray Dragon","Heart 3","The SooWonVoid","Heart 4"],
    mechanicsToCheck = ["Void.D","J.Breath.H","Slam.H","Barrage.H","ShckWv.H"],
    ss = SpreadsheetApp.getActiveSpreadsheet(),
    logSheet = ss.getSheetByName('Logs'),
    staticSheet = ss.getSheetByName('Setup und Co'),
    statisticsSheet = ss.getSheetByName('Statistics');

/** Trigger to check that dps.reports are entered into the correct space and to automatically run writeDataIntoSpreadsheet when the input is valid
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
    var amountOfPlayers = fillAllPlayersAccName(),
          amountOfDays = fillFailedPhases();
      updateStatisticsLayout(amountOfPlayers,amountOfDays);
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
      values = new Array();

  for(var i = 0; i < logs.length; i++){
    if(!(i in values)){
      values.push([]);
    }
    try{
      var log = logs[i][0];
      Logger.log("Next Log to calculate: " + log);
      var json = apiFetch(log),
          dateOfLog = getDayOfLog(json);
      if(date == ""){
        date = dateOfLog;
        cellsWithSameDate++;
      }
      else if(date != dateOfLog){
        date = dateOfLog;
        cellsWithSameDate = 1;
      }
      else if(date == dateOfLog){
        if(!logSheet.getRange(i+row,1,cellsWithSameDate+1,1).isPartOfMerge()){
          logSheet.getRange(i+row-cellsWithSameDate,1,cellsWithSameDate+1,1).mergeVertically();       
        }
        cellsWithSameDate++;
      }
      values[i].push(dateOfLog);
      values[i].push(logs[i][0]);
      values[i].push(json.duration);
      var endphase = getLatestValidPhase(json.phases);
      values[i].push(endphase);
      values[i].push(bossHPendPhase(json, endphase));
      values[i].push(json.durationMS > 60000);
      values[i].push(firstDeath(json));
      var players = getPlayer(json);
      for(p = 0; p < 10; p++){
        values[i].push(players[p]);
      }
      values[i].push(failedOnGreen(json));

      for(var m = 0; m < mechanicsToCheck.length; m++){
        values[i].push(failedMechanic(json, mechanicsToCheck[m]));
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
  Logger.log(values);
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
 *  @return {Boolean}     returns a boolean
 */
function failedOnGreen(json){
  var mechanics = json.mechanics,
      downs;

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
  
    return timesAmount > 8;
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

/** Get the Accountnames of all Players and fill it into the Statisticssheet
 */
function fillAllPlayersAccName(){
  var players = logSheet.getRange(2,8,logSheet.getLastRow()-1,10).getValues(),
      static = staticSheet.getRange(2,2,10,1).getValues(),
      allPlayers = new Set();

  for(var i = 0; i < 10; i++){
    allPlayers.add(static[i][0]);
  }

  for(var r = 0; r < players.length; r++){
    for(var c = 0; c < 10; c++){
      allPlayers.add(players[r][c]);
    }
  }

  var fillPlayers = statisticsSheet.getRange(9,1,allPlayers.size,5),
      arr = Array.from(allPlayers),
      playerValues = new Array();
  for(var a = 0; a < arr.length; a++){
    if(!(a in playerValues)){
      playerValues.push([]);
    }
    playerValues[a].push(arr[a],"=COUNTIF(Logs!H2:Q;A" + (a+9) + ")","=B" + (a+9) + "/A8","=COUNTIFS(Logs!G2:G;A" + (a+9) + ";Logs!R2:R;FALSE)","=D" + (a+9) + "/B" + (a+9));
  }

  fillPlayers.setValues(playerValues)
    .setBorder(false,false,false,false,false,false)
    .setHorizontalAlignment("center")
    .setFontSize(11)
    .setFontFamily("Arial")
    .setBorder(true,true,true,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
  statisticsSheet.getRange(9,1,10,5).setBorder(null,null,true,null,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK); 
  return allPlayers.size; 
}

/** Get the failed Phases and fill it into the Statisticsheet
 */
function fillFailedPhases(){
  var logValues = logSheet.getRange(1,1,logSheet.getLastRow(),logSheet.getLastColumn()).getValues(),
      statisticsValues = new Array(),
      currentRow = jorFailes = priFailes = kraFailes = pu2Failes = morFailes = zhaFailes = pu3Failes = sw1Failes = pu4Failes = sw2Failes = greenFailes = slamFailes = shwaveFailes = 0;
  
  if(!(0 in statisticsValues)){
    statisticsValues.push([]);
  }
  statisticsValues[0].push("Over All","=SUM(H10:H)","=SUM(I10:I)","=SUM(J10:J)","=SUM(K10:K)","=SUM(L10:L)","=SUM(M10:M)","=SUM(N10:N)","=SUM(O10:O)","=SUM(P10:P)","=SUM(Q10:Q)","=SUM(R10:R)","=SUM(S10:S)","=SUM(T10:T)","=SUM(U10:U)");

  for(var i = 1; i < logValues.length; i++){
    
    if(logValues[i][0] != ""){
      if(!(currentRow+1 in statisticsValues)){
        statisticsValues.push([]);
      }
      currentRow++;
      statisticsValues[currentRow].push(logValues[i][0]);
    }
    if(logValues[i][3] == "Jormag"){
      jorFailes++;
    }
    else if(logValues[i][3] == "Primordus"){
      priFailes++;
    }
    else if(logValues[i][3] == "Kralkatorrik"){
      kraFailes++;
    }
    else if(logValues[i][3] == "Purification 2"){
      pu2Failes++;
    }
    else if(logValues[i][3] == "Mordremoth"){
      morFailes++;
    }
    else if(logValues[i][3] == "Zhaitan"){
      zhaFailes++;
    }
    else if(logValues[i][3] == "Purification 3"){
      pu3Failes++;
    }
    else if(logValues[i][3] == "Soo-Won 1"){
      sw1Failes++;
    }
    else if(logValues[i][3] == "Purification 4"){
      pu4Failes++;
    }
    else if(logValues[i][3] == "Soo-Won 2"){
      sw2Failes++;
    }

    if(logValues[i][17]){
      greenFailes++;
    }
    else if(logValues[i][20] != false){
      slamFailes++;
    }
    else if(logValues[i][22] != false){
      shwaveFailes++;
    }
    
    try{
      if(logValues[i+1][0] != ""){
        statisticsValues[currentRow].push(jorFailes,priFailes,kraFailes,pu2Failes,morFailes,zhaFailes,pu3Failes,sw1Failes,pu4Failes,sw2Failes,"=SUM(H"+ String(currentRow+9) + ":Q" + String(currentRow+9) + ")",greenFailes,slamFailes,shwaveFailes);
        jorFailes = priFailes = kraFailes = pu2Failes = morFailes = zhaFailes = pu3Failes = sw1Failes = pu4Failes = sw2Failes = greenFailes = slamFailes = shwaveFailes = 0;
      }
    }
    catch{
      var statisticsRange = statisticsSheet.getRange(9,7,statisticsValues.length,statisticsSheet.getLastColumn()-6);
      statisticsValues[currentRow].push(jorFailes,priFailes,kraFailes,pu2Failes,morFailes,zhaFailes,pu3Failes,sw1Failes,pu4Failes,sw2Failes,"=SUM(H"+ String(currentRow+9) + ":Q" + String(currentRow+9) + ")",greenFailes,slamFailes,shwaveFailes);
      Logger.log(statisticsValues);
      statisticsRange.setValues(statisticsValues)
        .setBorder(false,false,false,false,false,false)
        .setHorizontalAlignment("center")
        .setFontSize(11)
        .setFontFamily("Arial")
        .setBorder(true,true,true,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
      return statisticsValues.length;
    }
  }                         
}

/** Get the failed Phases and fill it into the Statisticsheet
 */
function updateStatisticsLayout(amountOfPlayers,amountOfDays){
  var rules = new Array();
  // Layout settings for the list of players including the Participation and first Deaths
  statisticsSheet.getRange(9,1,amountOfPlayers,1).setBorder(null,null,null,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
  statisticsSheet.getRange(9,3,amountOfPlayers,1).setBorder(null,null,null,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
  statisticsSheet.getRange(9,3,amountOfPlayers,1).setNumberFormat("#0.00%");
  statisticsSheet.getRange(9,5,amountOfPlayers,1).setNumberFormat("#0.00%");

  var ruleParticipation = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMaxpoint("#008B00")
    .setGradientMidpointWithValue("#FFFF00", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
    .setGradientMinpoint("#FF0000")
    .setRanges([statisticsSheet.getRange(9,3,amountOfPlayers,1)])
    .build();
  var ruleFirstDeath = SpreadsheetApp.newConditionalFormatRule()
    .setGradientMaxpoint("#FF0000")
    .setGradientMidpointWithValue("#FFFF00", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
    .setGradientMinpoint("#008B00")
    .setRanges([statisticsSheet.getRange(9,5,amountOfPlayers,1)])
    .build();

  rules.push(ruleParticipation);
  rules.push(ruleFirstDeath);

  // Layout settings for the Matrix of Phases/Mechanics and Days
  statisticsSheet.getRange(9,7,amountOfDays,1).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
  statisticsSheet.getRange(9,7,amountOfDays,1).setFontWeight("bold");
  statisticsSheet.getRange(9,7,1,15).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);

  for(var i = 0; i < amountOfDays; i++){
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpoint("#FF0000")
      .setGradientMidpointWithValue("#FFFF00", SpreadsheetApp.InterpolationType.PERCENT, "50")
      .setGradientMinpoint("#008B00")
      .setRanges([statisticsSheet.getRange(9+i,8,1,10)])
      .build();

    rules.push(rule)
  }
  for(var j = 0; j < 3; j++){
    var rule = SpreadsheetApp.newConditionalFormatRule()
      .setGradientMaxpoint("#FF0000")
      .setGradientMidpointWithValue("#FFFF00", SpreadsheetApp.InterpolationType.PERCENT, "50")
      .setGradientMinpoint("#008B00")
      .setRanges([statisticsSheet.getRange(10,19+j,amountOfDays-1,1)])
      .build();

    rules.push(rule)
  }
  statisticsSheet.setConditionalFormatRules(rules);
}

