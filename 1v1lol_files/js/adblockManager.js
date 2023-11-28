async function checkAdBlock() {
  var adBlockEnabled = false;
  var testAd = document.createElement("div");
  testAd.innerHTML = "&nbsp;";
  testAd.className = "adsbox";
  document.body.appendChild(testAd);
  window.setTimeout(function () {
    if (testAd.offsetHeight === 0) {
      adBlockEnabled = true;
    }
    testAd.remove();
    if (adBlockEnabled) {
      gameInstance.SendMessage("PersistantObjects", "SendAdblockData", "true");
    } else {
      gameInstance.SendMessage("PersistantObjects", "SendAdblockData", "false");
    }
  }, 100);
}
