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

/** Calculate amount of mechanic fails
 * @param {any[][]} range  the range of data
 * @param {String} player  the player who failed the mechanic
 * @param {Integer} days   [Optional] calculate only the last x days
 * @return {Integer}       returns a number
 * @customfunction
 */
function getAmountOfMechanicFailes(range,player,days=-1){
  var counter = 0;
  if(days==-1){
    for(var i = 0; i < range.length; i++){
      counter += occurrences(range[i],player);
    }
  }
  else{
    var dates = logSheet.getRange(2,1,logSheet.getLastRow()-1,1).getValues(),
        players = logSheet.getRange(2,8,logSheet.getLastRow()-1,10).getValues();
    for(var i = dates.length - 1; i >= 0; i--){
      if(days > 0){
        if(dates[i][0] == ""){
          for(var p = 0; p < players[i].length; p++){
            if(players[i][p] == player){
              counter += occurrences(range[i],player);
              break;
            }
          }
        }
        else{
          for(var p = 0; p < players[i].length; p++){
            if(players[i][p] == player){
              counter += occurrences(range[i],player);
              days--;
              break;
            }
          }          
        }
      }
      else break;
    }
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

/** Calculate amount of mechanic fails
 * @param {String} player       the player who failed the mechanic
 * @param {Integer} totalValue  the amount of fails
 * @param {String} phase        Minimum reached phase
 * @param {Integer} days        [Optional] calculate only the last x days (Default:-1)
 * @return {Integer}            returns a number
 * @customfunction
 */
function avgFailsPerTry(player,totalValue,phase,days=-1){
  var allowedPhases = validPhases;
  while(phase != allowedPhases[0]){
    allowedPhases.shift();
  }
  var dates = logSheet.getRange(2,1,logSheet.getLastRow()-1,1).getValues(),
      phases = logSheet.getRange(2,4,logSheet.getLastRow()-1,1).getValues(),
      players = logSheet.getRange(2,8,logSheet.getLastRow()-1,10).getValues(),
      counter = 0;

  if(days==-1){
    for(var i = 0; i < phases.length; i++){
      if(allowedPhases.includes(phases[i][0]) && players[i].includes(player)){
        counter++;
      }
    }
  }
  else{
    for(var i = dates.length - 1; i >= 0; i--){
      if(days > 0){
        if(dates[i][0] == "" && allowedPhases.includes(phases[i][0]) && players[i].includes(player)){
          counter++;
        }
        else if(allowedPhases.includes(phases[i][0]) && players[i].includes(player)){
          counter++;
          days--;
        }
        else if(dates[i][0] != "" && players[i].includes(player)){
          days--; 
        }
      }
      else break;
    }
  }
  return totalValue/counter;
}