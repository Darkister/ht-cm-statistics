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