/** Checks given list of data for the best try
 * @param {any[][]} data List of Encounter results which contains the endBossphase + RestHP
 * @return {String}      returns the link to the best try
 * @customfunction
 */
function getBestTry(data){
    var phaseNoCurr = 0,
        bestPercCurr = 0,
        bestTryCurr = 0;
  
    for(var i = 0; i < data.length; i++){
      var phaseNoToCheck = 0,
          bestPercToCheck = data[i][1];

      for(var p = 0; p < validPhases.length; p++){
        if(data[i][0] == validPhases[p]){
          phaseNoToCheck = p;
          break;
        }
      }
  
      if(phaseNoCurr == phaseNoToCheck){
        if(bestPercCurr > bestPercToCheck){
          bestPercCurr = bestPercToCheck;
          bestTryCurr = i;
        }
      }
      else if(phaseNoCurr < phaseNoToCheck){
        phaseNoCurr = phaseNoToCheck;
        bestPercCurr = bestPercToCheck;
        bestTryCurr = i;
      }
    }
    var logs = logSheet.getRange(2,2,logSheet.getLastRow()-1,1).getValues();
  
    return logs[bestTryCurr][0];
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
    playerValues[a].push(arr[a],"=COUNTIF(Logs!H2:Q;A" + (a+9) + ")","=B" + (a+9) + "/A8","=COUNTIFS(Logs!G2:G;A" + (a+9) + ";Logs!Y2:Y;FALSE;Logs!R2:R;FALSE)","=D" + (a+9) + "/B" + (a+9));
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
        .setFontWeight("bold")
        .setBorder(true,true,true,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
      return statisticsValues.length;
    }
  }                         
}
