async function load(){
  try {
    await registerSW();
  } catch (err) {
    alert(err.toString());
    throw err;
  }
  const url = search("", "");

            var iframe = document.createElement('iframe');

            iframe.style.position = "absolute";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.top = "0px";
            iframe.style.left = "0px";
            iframe.style.display="none";
            iframe.id = "iframe";
            iframe.style.zIndex="9999999999999999";
            iframe.style.border = "none";
            iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            document.body.appendChild(iframe);
  function wait(){
    if (window.location.href.includes("/service/")){
      window.location.reload(1);
    }
  }
  setTimeout(wait,50);
}
load();
