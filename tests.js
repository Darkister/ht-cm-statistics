if (typeof GasTap === "undefined") {
  // GasT Initialization. (only if not initialized yet.)
  eval(
    UrlFetchApp.fetch(
      "https://raw.githubusercontent.com/huan/gast/master/src/gas-tap-lib.js"
    ).getContentText()
  );
} // Class GasTap is ready for use now!

var test = new GasTap();
var json = apiFetch("https://dps.report/ICMq-20221123-211350_void");

function gast() {
  /** generell tests against the json
   *  returns any */
  test("do fightDurationCheck right", function (t) {
    var duration = json.duration;
    t.equal(duration, "06m 22s 687ms", "fightDurationCheck is ok");
  });

  /** function getLatestValidPhase(phases)
   *  returns String */
  test("do endPhaseCheck right", function (t) {
    var endPhase = getLatestValidPhase(json.phases);
    t.equal(endPhase, "Purification 2", "endPhaseCheck is ok");
  });

  /** function bossHPendPhase(json, boss)
   *  returns Integer */
  test("do bossHpEndPhase right", function (t) {
    var bossHp = bossHPendPhase(json, "Purification 2");
    t.equal(bossHp, 1, "bossHpEndPhase is ok");
  });

  /** function firstDeath(json)
   *  returns String */
  test("do deathCheck right", function (t) {
    var deathCheck = firstDeath(json);
    t.equal(deathCheck, "blackicedragon.3579", "deathCheck is ok");
  });

  /** function getPlayer(json)
   *  returns String[] */

  /** function getDayOfLog(json)
   *  returns String */
  test("do getDayOfLog right", function (t) {
    var dayofLog = getDayOfLog(json);
    t.equal(dayofLog, "23.11.2022", "getDayOfLog is ok");
  });

  /** function failedOnGreen(json)
   *  returns Boolean */
  test("do failedOnGreen right", function (t) {
    var failed = failedOnGreen(json);
    t.equal(failed, false, "failedOnGreen is ok");
  });

  /** function failedMechanic(json, mechanic)
   *  returns String */
  test("do failedMechanic right", function (t) {
    var value = failedMechanic(json, "Barrage.H");
    t.equal(value, "Scharkoon.2017", "failedMechanic is ok");
  });

  /** function fillAllPlayersAccName()
   *  returns Integer */

  /** function getAmountOfMechanicFailes(range,player,days=-1)
   *  returns Integer */

  /** function occurrences(string, substring)
   *  returns Integer */
  test("do occurrences right", function (t) {
    var counter = occurrences(
      "Slayerstryke.6928Slayerstryke.6928Slayerstryke.6928Scharkoon.2017Scharkoon.2017Zailer.9817Zailer.9817Zailer.9817Zailer.9817",
      "Slayerstryke.6928"
    );
    t.equal(counter, 3, "occurences is ok");
  });

  test("do occurrences right", function (t) {
    var counter = occurrences(
      "Slayerstryke.6928stone goes perma.6980Slayerstryke.6928stone goes perma.6980GLD.7468GLD.7468Slayerstryke.6928stone goes perma.6980Scharkoon.2017stone goes perma.6980Scharkoon.2017Slayerstryke.6928stone goes perma.6980Scharkoon.2017Slayerstryke.6928Slayerstryke.6928Judy.8532stone goes perma.6980Homegrow.4365Scharkoon.2017Zailer.9817ToxicSkritt.6281Chelu.2095Chelu.2095Chelu.2095Chelu.2095Chelu.2095Chelu.2095Slayerstryke.6928Slayerstryke.6928stone goes perma.6980Slayerstryke.6928stone goes perma.6980Slayerstryke.6928Slayerstryke.6928Slayerstryke.6928Zailer.9817ToxicSkritt.6281Slayerstryke.6928ToxicSkritt.6281Slayerstryke.6928Zailer.9817Zailer.9817Homegrow.4365stone goes perma.6980ToxicSkritt.6281Slayerstryke.6928Judy.8532Scharkoon.2017Scharkoon.2017Judy.8532Slayerstryke.6928Scharkoon.2017Slayerstryke.6928Judy.8532stone goes perma.6980ToxicSkritt.6281Judy.8532stone goes perma.6980Slayerstryke.6928Judy.8532Slayerstryke.6928stone goes perma.6980Scharkoon.2017Judy.8532Slayerstryke.6928Scharkoon.2017Chelu.2095Chelu.2095Slayerstryke.6928Scharkoon.2017Judy.8532Judy.8532Scharkoon.2017Chelu.2095Slayerstryke.6928",
      "Homegrow.4365"
    );
    t.equal(counter, 2, "occurences is ok");
  });

  test("do occurrences right", function (t) {
    var counter = occurrences("", "anyString");
    t.equal(counter, 0, "occurences is ok");
  });

  /** function avgFailsPerTry(player,totalValue,phase,days=-1)
   *  returns Integer */

  /** function removeEndingZeros(arr)
   *  returns Array */
  test("do removing right", function (t) {
    var arr = removeEndingZeros([
      5.0, 7.0, 1.0, 2.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
    ]);
    t.deepEqual(arr, [5.0, 7.0, 1.0, 2.0], "removing is ok");
  });

  test("do removing right", function (t) {
    var arr = removeEndingZeros([
      1.0, 2.0, 0.0, 0.0, 3.0, 1.0, 2.0, 1.0, 2.0, 1.0,
    ]);
    t.deepEqual(
      arr,
      [1.0, 2.0, 0.0, 0.0, 3.0, 1.0, 2.0, 1.0, 2.0, 1.0],
      "removing is ok"
    );
  });

  test("do removing right", function (t) {
    var arr = removeEndingZeros([
      0.0, 0.0, 0.0, 4.0, 5.0, 2.0, 1.0, 0.0, 0.0, 0.0,
    ]);
    t.deepEqual(arr, [0.0, 0.0, 0.0, 4.0, 5.0, 2.0, 1.0], "removing is ok");
  });

  test.finish();
}
