var ss = SpreadsheetApp.getActiveSpreadsheet(),
    statisticsSheet = ss.getSheetByName('Statistics'),
    staticSheet = ss.getSheetByName('Setup und Co'),
    logSheet = ss.getSheetByName('Logs');

/** create basic layout for the full spreadsheet
 * 
 */
function createFullLayout(){
    createStatisticsLayout();
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
    statisticsValue[1][1] = "=R9/ANZAHL2(G10:G)";

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

    statisticsValue[7][0] = "=ANZAHL2(Logs!B2:B)";
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
    statisticsSheet.getRange(2,2,4,1).setHorizontalAlignment("center");
    statisticsSheet.getRange(7,1,2,21).setHorizontalAlignment("center");
    statisticsSheet.getRange(7,1,2,5).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
    statisticsSheet.getRange(7,7,2,15).setBorder(true,true,true,true,true,true,"black",SpreadsheetApp.BorderStyle.SOLID_THICK);
    statisticsSheet.getRange(7,1,1,5).setBackground("#ABABAB");
    statisticsSheet.getRange(7,7,1,15).setBackground("#ABABAB");
    statisticsSheet.autoResizeColumns(1,1);
    statisticsSheet.setColumnWidths(2,4,60);
    statisticsSheet.setColumnWidths(6,1,25);
    statisticsSheet.setColumnWidths(7,1,80);
    statisticsSheet.autoResizeColumns(8,11);
    statisticsSheet.setColumnWidths(19,1,50);
    statisticsSheet.autoResizeColumns(20,2);
}