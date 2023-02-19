var ss = SpreadsheetApp.getActiveSpreadsheet(),
    statisticsSheet = ss.getSheetByName('Statistics'),
    staticSheet = ss.getSheetByName('Setup und Co'),
    logSheet = ss.getSheetByName('Logs'),
    mechanicsSheet = ss.getSheetByName('Mechanics');

/** create basic layout for the full spreadsheet
 * 
 */
function createFullLayout(){
    createStatisticsLayout();
    createSetupLayout();
    createLogsLayout();
    createMechanicsLayout();
}

/** create basic layout for the Tab Statistics
 * 
 */
function createStatisticsLayout(){
    if(statisticsSheet == null){
        ss.insertSheet('Statistics',0);
        statisticsSheet = ss.getSheetByName('Statistics');
    }
    var statisticsRange = statisticsSheet.getRange(1,1,8,21),
        statisticsValue = statisticsRange.getValues();

    statisticsValue[0][0] = "Best Try all time:";
    statisticsValue[0][1] = "=getBestTry(Logs!D2:E)";

    statisticsValue[1][0] = "AVG Tries per day:";
    statisticsValue[1][1] = "=R9/COUNTA(G10:G)";

    statisticsValue[2][0] = "Tries ended on Green:";
    statisticsValue[2][1] = "=S9/R9";

    statisticsValue[3][0] = "Tries ended on Slam:";
    statisticsValue[3][1] = "=T9/R9";

    statisticsValue[4][0] = "Tries ended on Shockwave:";
    statisticsValue[4][1] = "=U9/R9";

    statisticsValue[6][0] = "Total Count of valid Logs:";
    statisticsValue[6][1] = "Participation";
    statisticsValue[6][3] = "First Death";
    statisticsValue[6][6] = "Most failed Phase";
    statisticsValue[6][18] = "Failed on Mechanic";

    statisticsValue[7][0] = "=COUNTA(Logs!B2:B)";
    statisticsValue[7][1] = "total";
    statisticsValue[7][2] = "percent";
    statisticsValue[7][3] = "total";
    statisticsValue[7][4] = "percent";
    statisticsValue[7][7] = "Jormag";
    statisticsValue[7][8] = "Primordus";
    statisticsValue[7][9] = "Kralkatorrik";
    statisticsValue[7][10] = "Purification 2";
    statisticsValue[7][11] = "Mordremoth";
    statisticsValue[7][12] = "Zhaitan";
    statisticsValue[7][13] = "Purification 3";
    statisticsValue[7][14] = "Soo-Won 1";
    statisticsValue[7][15] = "Purification 4";
    statisticsValue[7][16] = "Soo-Won 2";
    statisticsValue[7][17] = "Total";
    statisticsValue[7][18] = "Green";
    statisticsValue[7][19] = "Slam";
    statisticsValue[7][20] = "Shockwave";

    statisticsSheet.getRange(7,2,1,2).mergeAcross();
    statisticsSheet.getRange(7,4,1,2).mergeAcross();
    statisticsSheet.getRange(7,7,1,12).mergeAcross();
    statisticsSheet.getRange(7,19,1,3).mergeAcross();
    statisticsRange.setValues(statisticsValue)
        .setFontFamily("Arial")
        .setFontSize(11)
        .setFontWeight("bold");
    statisticsSheet.getRange(2,2).setNumberFormat("#,##0.000");
    statisticsSheet.getRange(3,2,3,1).setNumberFormat("#0.00%");
    statisticsSheet.getRange(2,2,4,1).setHorizontalAlignment("center");
    statisticsSheet.getRange(7,1,2,21).setHorizontalAlignment("center");
    statisticsSheet.getRange(7,1,2,5).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
    statisticsSheet.getRange(7,7,2,15).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
    statisticsSheet.getRange(7,1,1,5).setBackground("#ABABAB");
    statisticsSheet.getRange(7,7,1,15).setBackground("#ABABAB");
    statisticsSheet.autoResizeColumns(1,1)
        .setColumnWidths(2,4,60)
        .setColumnWidths(6,1,25)
        .setColumnWidths(7,1,80)
        .autoResizeColumns(8,11)
        .setColumnWidths(19,1,50)
        .autoResizeColumns(20,2);
}

/** create basic layout for the tab Setup
 * 
 */
function createSetupLayout(){
    if(staticSheet == null){
        ss.insertSheet('Setup und Co',1);
        staticSheet = ss.getSheetByName('Setup und Co');
    }
    var staticRange = staticSheet.getRange(1,1,11,15),
        staticValue = staticRange.getValues();

    staticValue[0][0] = "Subgrp";
    staticValue[0][1] = "Accountname";
    staticValue[0][2] = "Name";
    staticValue[0][3] = "Role";
    staticValue[0][4] = "Orb 1";
    staticValue[0][5] = "Jormag";
    staticValue[0][6] = "Primordus";
    staticValue[0][7] = "Kralkatorrik";
    staticValue[0][8] = "Orb 2";
    staticValue[0][9] = "Mordremoth";
    staticValue[0][10] = "Zaithan";
    staticValue[0][11] = "Orb 3";
    staticValue[0][12] = "Soo-Won 1";
    staticValue[0][13] = "Final Orb";
    staticValue[0][14] = "Soo-Won 2";

    staticValue[1][0] = "1";
    staticValue[6][0] = "2";

    staticSheet.getRange(2,1,5,1).mergeVertically();
    staticSheet.getRange(7,1,5,1).mergeVertically();

    staticRange.setValues(staticValue)
        .setFontFamily("Arial")
        .setFontSize(11)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle");

    staticSheet.getRange(1,1,1,15).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK)
        .setBackground("#ABABAB");;
    staticSheet.getRange(2,1,10,1).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
    staticSheet.autoResizeColumn(1)
        .setColumnWidth(2,150)
        .setColumnWidths(3,13,100);
}

/** create basic layout for the tab Logs
 * 
 */
function createLogsLayout(){
    if(logSheet == null){
        ss.insertSheet('Logs',2);
        logSheet = ss.getSheetByName('Logs');
    }
    var logRange = logSheet.getRange(1,1,1,24),
        logValue = logRange.getValues();

    logValue[0][0] = "Date";
    logValue[0][1] = "Log";
    logValue[0][2] = "Duration";
    logValue[0][3] = "endPhase";
    logValue[0][4] = "Rest HP";
    logValue[0][5] = "isValid?";
    logValue[0][6] = "First Death";
    logValue[0][7] = "Players Accountname";

    logValue[0][17] = "failed on green";
    logValue[0][18] = "Recieved Void debuff";
    logValue[0][19] = "Hit by Jormag Breath";
    logValue[0][20] = "Hit by Primordus Slam";
    logValue[0][21] = "Hit by Crystal Barrage";
    logValue[0][22] = "Hit by Mordremoth Shockwave";
    logValue[0][23] = "Recieved Debilitated debuff";

    logSheet.getRange(1,7,1,10).mergeAcross();
    logSheet.getRange(2,1,logSheet.getMaxRows()-1,1)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setFontWeight("bold");
    logSheet.getRange(2,3,logSheet.getMaxRows()-1,21)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
    logSheet.getRange(2,5,logSheet.getMaxRows()-1,1).setNumberFormat("#0.00%");
    logRange.setValues(logValue)
        .setFontFamily("Arial")
        .setFontSize(11)
        .setFontWeight("bold")
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle")
        .setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);

    logSheet.setColumnWidths(1,1,80)
        .setColumnWidths(2,1,300)
        .setColumnWidths(3,1,105)
        .setColumnWidths(4,1,85)
        .autoResizeColumns(5,2)
        .setColumnWidths(7,1,150)
        .setColumnWidths(8,10,25)
        .autoResizeColumns(18,6)
        .setFrozenRows(1);
    logSheet.hideColumns(6,1);
    logSheet.hideColumns(8,10);
    logSheet.hideColumns(19,2);
    logSheet.hideColumns(22);
}

/** create basic layout for the tab Mechanics
 * 
 */
function createMechanicsLayout(){
    var rules = new Array();
    if(mechanicsSheet == null){
        ss.insertSheet('Mechanics',3);
        mechanicsSheet = ss.getSheetByName('Mechanics');
    }

    while(mechanicsSheet.getMaxColumns() < 31){
        mechanicsSheet.insertColumns(mechanicsSheet.getMaxColumns(), 1)
    }
    var mechanicsRange = mechanicsSheet.getRange(1,1,28,31),
        mechanicsValue = mechanicsRange.getValues();

    mechanicsValue[0][0] = "Mechanics failed OverAll";  
    mechanicsValue[10][0] = "Mechanics failed last 4 days";
    mechanicsValue[20][0] = "Mechanics failed last day";

    for(var j = 0; j < 3; j++){
        for(var i = 0; i < 10; i++){
            mechanicsValue[0 + (j * 10)][1 + i*3] = "='Setup und Co'!B" + (2+i);
            mechanicsValue[1 + (j * 10)][1 + i*3] = "AVG";
            mechanicsValue[1 + (j * 10)][2 + i*3] = "Total";
            if(j>0){
                mechanicsValue[1 + (j * 10)][3 + i*3] = "'+-~";
            }
            mechanicsSheet.getRange(1 + (j * 10), 2 + (i * 3),1,3).mergeAcross();
            mechanicsSheet.getRange(1 + (j * 10), 2 + (i * 3),2,3).setFontWeight("bold")
                .setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID);
            mechanicsSheet.getRange(1 + (j * 10), 2 + (i * 3),7,3).setBorder(true,true,true,true,null,null,"black",SpreadsheetApp.BorderStyle.SOLID);
            mechanicsSheet.getRange(3 + (j * 10), 2 + (i * 3),5,1).setNumberFormat("#,##0.000");
        }
        mechanicsValue[1 + (j * 10)][0] = "Mechanic";
        mechanicsValue[2 + (j * 10)][0] = "=Logs!$S$1";
        mechanicsValue[3 + (j * 10)][0] = "=Logs!$T$1";
        mechanicsValue[4 + (j * 10)][0] = "=Logs!$U$1";
        mechanicsValue[5 + (j * 10)][0] = "=Logs!$V$1";
        mechanicsValue[6 + (j * 10)][0] = "=Logs!$W$1";
        mechanicsValue[7 + (j * 10)][0] = "=Logs!$X$1";
        mechanicsSheet.getRange(1 + (j * 10),1,8,1).setFontWeight("bold");
        mechanicsSheet.getRange(1 + (j * 10),1,8,1).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID);

        for(var r = 0; r < 5; r++){
            var num = 3 + r + (j * 10);
                ranges = new Array();
            for(var c = 0; c < 10 ; c++){
                ranges.push(mechanicsSheet.getRange(num,2 + (c * 3)));
            }
            var rule = SpreadsheetApp.newConditionalFormatRule()
                .setGradientMaxpoint("#FF0000")
                .setGradientMidpointWithValue("#FFFF00", SpreadsheetApp.InterpolationType.PERCENTILE, "50")
                .setGradientMinpoint("#008B00")
                .setRanges(ranges)
                .build();
      
            rules.push(rule);
        }        
    }

    var ranges = new Array();
    for(var a = 0; a < 10; a++){
        ranges.push(mechanicsSheet.getRange(13,4 + (a * 3),5,1));
        ranges.push(mechanicsSheet.getRange(23,4 + (a * 3),5,1));
    }
    var plusRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains("+")
        .setBackground("#B7E1CD")
        .setRanges(ranges)
        .build();
    var minusRule = SpreadsheetApp.newConditionalFormatRule()
        .whenTextContains("-")
        .setBackground("#E67C73")
        .setRanges(ranges)
        .build();
  
    rules.push(plusRule);
    rules.push(minusRule);

    mechanicsSheet.setConditionalFormatRules(rules);
  
    mechanicsRange.setValues(mechanicsValue)
        .setFontFamily("Arial")
        .setFontSize(11)
        .setHorizontalAlignment("center")
        .setVerticalAlignment("middle");

    mechanicsSheet.autoResizeColumns(1,1)
        .setColumnWidths(2,30,50)
        .setFrozenColumns(1);
}