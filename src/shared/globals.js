var targetValues = ["Heart 1","The JormagVoid","The PrimordusVoid","The KralkatorrikVoid","Zeitzauberer der Leere","The MordremothVoid","The ZhaitanVoid","Leere-Salzgischtdrachen","The SooWonVoid","Heart 4"],
    validPhases = ["Purification 1","Jormag","Primordus","Kralkatorrik","Zeitzauberer der Leere","Purification 2","Mordremoth","Zhaitan","Void Saltspray Dragon","Purification 3","Soo-Won 1","Purification 4","Soo-Won 2"],
    mechanicsToCheck = ["Void.D","J.Breath.H","Slam.H","Barrage.H","ShckWv.H","Whrlpl.H","Tsunami.H","Claw.H"],
    ss = SpreadsheetApp.getActiveSpreadsheet(),
    logSheet = ss.getSheetByName('Logs'),
    staticSheet = ss.getSheetByName('Setup und Co'),
    mechanicSheet = ss.getSheetByName('Mechanics'),
    statisticsSheet = ss.getSheetByName('Statistics'),
    settingsSheet = ss.getSheetByName('Settings');

