var validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Void Saltspray Dragon","Purification 3","Soo-Won 1","Purification 4","Soo-Won 2"],
    ss = SpreadsheetApp.getActiveSpreadsheet(),
    logSheet = ss.getSheetByName('Logs');

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
