/**
 * Calculate amount of failes with the given conditions
 *
 * @param {String} date
 * @param {String} phase
 * @return {Integer} - returns a number
 * @customfunction
 */
function getAmountOfFailes(date,phase){
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Logs');
    var phaseValues = sheet.getRange(2,4,sheet.getLastRow(),1).getValues();
    var dateValues = sheet.getRange(2,1,sheet.getLastRow(),1).getValues();
    var greenValues = sheet.getRange(2,18,sheet.getLastRow(),1).getValues();
    var counter = 0;
    var lastValidDate = "";

    if(phase == "Green"){ 
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