if ((typeof GasTap)==='undefined') { // GasT Initialization. (only if not initialized yet.)
    eval(UrlFetchApp.fetch('https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js').getContentText())
  } // Class GasTap is ready for use now!
  
var test = new GasTap()
var json = apiFetch("https://dps.report/ICMq-20221123-211350_void")
  
function gast() {
  
  test('do deathCheck right', function (t) {    
    var deathCheck = firstDeath(json);
    t.equal(deathCheck, "blackicedragon.3579", 'deathCheck is ok');
  })
  
  test('do fightDurationCheck right', function (t) {    
    var duration = json.duration;
    t.equal(duration,"06m 22s 687ms",'fightDurationCheck is ok');
  })
  
  test('do endPhaseCheck right', function (t) {    
    var endPhase = getLatestValidPhase(json.phases);
    t.equal(endPhase, "Purification 2",'endPhaseCheck is ok');
  })
  
  test('do occurrences right', function (t) {    
    var counter = occurrences("Slayerstryke.6928Slayerstryke.6928Slayerstryke.6928Scharkoon.2017Scharkoon.2017Zailer.9817Zailer.9817Zailer.9817Zailer.9817","Slayerstryke.6928");
    t.equal(counter, 3 ,'occurences is ok');
  })

  test('do occurrences right', function (t) {    
    var counter = occurrences("Slayerstryke.6928stone goes perma.6980Slayerstryke.6928stone goes perma.6980GLD.7468GLD.7468Slayerstryke.6928stone goes perma.6980Scharkoon.2017stone goes perma.6980Scharkoon.2017Slayerstryke.6928stone goes perma.6980Scharkoon.2017Slayerstryke.6928Slayerstryke.6928Judy.8532stone goes perma.6980Homegrow.4365Scharkoon.2017Zailer.9817ToxicSkritt.6281Chelu.2095Chelu.2095Chelu.2095Chelu.2095Chelu.2095Chelu.2095Slayerstryke.6928Slayerstryke.6928stone goes perma.6980Slayerstryke.6928stone goes perma.6980Slayerstryke.6928Slayerstryke.6928Slayerstryke.6928Zailer.9817ToxicSkritt.6281Slayerstryke.6928ToxicSkritt.6281Slayerstryke.6928Zailer.9817Zailer.9817Homegrow.4365stone goes perma.6980ToxicSkritt.6281Slayerstryke.6928Judy.8532Scharkoon.2017Scharkoon.2017Judy.8532Slayerstryke.6928Scharkoon.2017Slayerstryke.6928Judy.8532stone goes perma.6980ToxicSkritt.6281Judy.8532stone goes perma.6980Slayerstryke.6928Judy.8532Slayerstryke.6928stone goes perma.6980Scharkoon.2017Judy.8532Slayerstryke.6928Scharkoon.2017Chelu.2095Chelu.2095Slayerstryke.6928Scharkoon.2017Judy.8532Judy.8532Scharkoon.2017Chelu.2095Slayerstryke.6928","Homegrow.4365");
    t.equal(counter, 2 ,'occurences is ok');
  })
  
  test.finish();
}



