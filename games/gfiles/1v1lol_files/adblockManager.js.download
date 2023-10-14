async function checkAdBlock() {

  while(window.unityInstance === undefined)
  {
    await sleep(500)
  }

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
    /*if (adBlockEnabled) {
      window.unityInstance.SendMessage("PersistantObjects", "SendAdblockData", "true");
    } else {
      window.unityInstance.SendMessage("PersistantObjects", "SendAdblockData", "false");
    }*/
	window.unityInstance.SendMessage("PersistantObjects", "SendAdblockData", "false");
  }, 100);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
