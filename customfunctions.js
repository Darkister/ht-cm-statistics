/**
 * Calculate amount of failes with the given conditions
 *
 * @param {String} date
 * @param {String} phase
 * @return {Integer} - returns a number
 * @customfunction
 */
function getAmountOfFailes(date,phase){
  Logger.log("Start calculating with: " + date + " " + phase)
  var ss = SpreadsheetApp.getActiveSpreadsheet(),
      sheet = ss.getSheetByName('Logs'),
      phaseValues = sheet.getRange(2,4,sheet.getLastRow(),1).getValues(),
      dateValues = sheet.getRange(2,1,sheet.getLastRow(),1).getValues(),
      counter = 0,
      lastValidDate = "";

  if(phase == "Green"){ 
    var greenValues = sheet.getRange(2,18,sheet.getLastRow(),1).getValues();
    Logger.log("checking green fails " + greenValues);
    if(date == "Over All"){
      for(var a = 0; a < greenValues.length; a++){
        Logger.log(greenValues[a][0]);
        if(greenValues[a][0]){
          counter++;
        }
      }
    }
    else{
      Logger.log("Date = " + date);
      for(var i = 0; i < greenValues.length; i++){
        if(dateValues[i][0] != ""){
          Logger.log("current Date = " + dateValues[i][0]);
          lastValidDate = dateValues[i][0].valueOf();
        }
        if(greenValues[i][0] && date.valueOf() == lastValidDate.valueOf()){
          counter++;
        }
      }
    }
  }

  else if(phase == "Slam"){ 
    var slamValues = sheet.getRange(2,21,sheet.getLastRow(),1).getValues();
    Logger.log("checking slam fails " + slamValues);
    if(date == "Over All"){
      for(var a = 0; a < slamValues.length; a++){
        Logger.log(slamValues[a][0]);
        if(slamValues[a][0] != false){
          counter++;
        }
      }
    }
    else{
      Logger.log("Date = " + date);
      for(var i = 0; i < slamValues.length; i++){
        if(dateValues[i][0] != ""){
          Logger.log("current Date = " + dateValues[i][0]);
          lastValidDate = dateValues[i][0].valueOf();
        }
        Logger.log(slamValues[i][0]);
        if(slamValues[i][0] != false && date.valueOf() == lastValidDate.valueOf()){
          counter++;
        }
      }
    }
  }

  else if(phase == "Shockwave"){ 
    var shockwaveValues = sheet.getRange(2,23,sheet.getLastRow(),1).getValues();
    Logger.log("checking Shockwave fails " + shockwaveValues);
    if(date == "Over All"){
      for(var a = 0; a < shockwaveValues.length; a++){
        Logger.log(shockwaveValues[a][0]);
        if(shockwaveValues[a][0] != false){
          counter++;
        }
      }
    }
    else{
      Logger.log("Date = " + date);
      for(var i = 0; i < shockwaveValues.length; i++){
        if(dateValues[i][0] != ""){
          Logger.log("current Date = " + dateValues[i][0]);
          lastValidDate = dateValues[i][0].valueOf();
        }
        Logger.log(shockwaveValues[i][0]);
        if(shockwaveValues[i][0] != false && date.valueOf() == lastValidDate.valueOf()){
          counter++;
        }
      }
    }
  }

  else if(date == "Over All"){
    for(var a = 0; a < phaseValues.length; a++){
      if(phaseValues[a][0] == phase){
        counter++;
      }
    }
  }

  else{
    for(var i = 0; i < phaseValues.length; i++){
      if(dateValues[i][0] != ""){
        lastValidDate = dateValues[i][0].valueOf();
      }
      if(phaseValues[i][0] == phase && date.valueOf() == lastValidDate.valueOf()){
        counter++;
      }
    }
  }
  return counter;
}

  /**
 * Checks given list of data for the best try
 *
 * @param {any[][]} data - List of Encounter results which contains the endBossphase + RestHP
 * @return {String} - returns the link to the best try
 * @customfunction
 */
function getBestTry(data){
    var phaseNoCurr = 0;
    var bestPercCurr = 0;
    var bestTryCurr = 0;
  
    Logger.log('Start checking best try.');
  
    for(var i = 0; i < data.length; i++){
      var phaseNoToCheck = 0;
      var bestPercToCheck = data[i][1];
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
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Logs');
    var startRow = 2;
    var logs = sheet.getRange(startRow,2,sheet.getLastRow()-1,1).getValues();
  
    return logs[bestTryCurr][0]
  }

/**
 * Calculate amount of mechanic fails
 *
 * @param {any[][]} range - the range of data
 * @param {String} player - the player who failed the mechanic
 * @return {Integer} - returns a number
 * @customfunction
 */
function getAmountOfMechanicFailes(range,player){
  var counter = 0;
  for(var i = 0; i < range.length; i++){
    counter += occurrences(range[i],player);
  }
  return counter;
}

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 * 
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see https://stackoverflow.com/a/7924240/938822
 */
function occurrences(string, subString, allowOverlapping) {

  string += "";
  subString += "";
  if (subString.length <= 0) return (string.length + 1);

  var n = 0,
      pos = 0,
      step = allowOverlapping ? 1 : subString.length;

  while (true) {
      pos = string.indexOf(subString, pos);
      if (pos >= 0) {
          ++n;
          pos += step;
      } else break;
  }
  return n;
}