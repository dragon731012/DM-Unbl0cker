"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("uv-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("uv-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("uv-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("uv-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("uv-error-code");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    await registerSW();
  } catch (err) {
    error.textContent = "Failed to register service worker.";
    errorCode.textContent = err.toString();
    throw err;
  }

  const url = search(address.value, searchEngine.value);
  var white = document.createElement('img');
            white.style.cursor="pointer";
            white.style.position = "absolute";
            white.style.width = "100%";
            white.style.height = "100%";
            white.src = "/img/white.jpg";
            white.style.right = "0px";
            white.style.top = "0px";
            document.body.appendChild(white);

            var iframe = document.createElement('iframe');

            iframe.style.position = "absolute";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.top = "0px";
            iframe.style.left = "0px";
            iframe.id = "iframe";
            iframe.style.border = "none";
            iframe.src = __uv$config.prefix + __uv$config.encodeUrl(address.value);
            document.body.appendChild(iframe);

            var x = document.createElement('img');
            x.style.cursor="pointer";
            x.style.position = "absolute";
            x.style.width = "50px";
            x.style.height = "50px";
            x.src = "/img/x.png";
            x.style.zIndex = "99999999999999999999";
            x.style.right = "1%";
            x.style.top = "1%";
            x.onclick = function() {
                window.location.reload(1);
            };

            document.body.appendChild(x);


            var open = document.createElement('img');
            open.style.cursor="pointer";
            open.style.position = "absolute";
            open.style.width = "50px";
            open.style.height = "50px";
            open.src = "/img/open.png";
            open.style.zIndex = "99999999999999999999";
            open.style.right = "65px";
            open.style.top = "1%";
            open.onclick = function() {
                if (document.getElementById("iframe").contentWindow.location.href!="about:blank"){
                    window.open(document.getElementById("iframe").contentWindow.location.href);
                }
            };

            document.body.appendChild(open);
});
