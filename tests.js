// if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
//   eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
// } // Class GasTap is ready for use now!

// var test = new GasTap()

// function gast() {

//   test('do deathCheck right', function (t) {    
//     var deathCheck = firstDeath("u4UF-20221216-205751_void",true);
//     t.equal(deathCheck, "Domnorix Belphegor", 'deathCheck is ok');
//   })

//   test('do fightDurationCheck right', function (t) {    
//     var duration = fightDuration("u4UF-20221216-205751_void");
//     t.equal(duration,"08m 22s 222ms",'fightDurationCheck is ok');
//   })

//   test('do endPhaseCheck right', function (t) {    
//     var endPhase = includesString("Jormag");
//     t.equal(endPhase, "Jormag",'endPhaseCheck is ok');
//   })

//   test('do endPhaseCheck right', function (t) {    
//     var endPhase = endPhase("u4UF-20221216-205751_void");
//     t.equal(endPhase, "Zhaitan",'endPhaseCheck is ok');
//   })


//   test.finish();
// }