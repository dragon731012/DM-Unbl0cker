"use strict";
/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("searchbox");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("search");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("searchengine");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await registerSW();
  } catch (err) {
    alert(err.toString());
    throw err;
  }
  const url = search(address.value, searchEngine.value);
      var white = document.createElement('div');
            white.style.cursor="pointer";
            white.style.position = "absolute";
            white.style.width = "100%";
            white.style.height = "100%";
            white.style.zIndex="100";
            white.style.right = "0px";
            white.className="black";
            white.style.top = "0px";
            document.body.appendChild(white);

            var loading = document.createElement('img');
            loading.style.cursor="pointer";
            loading.style.width = "125px";
            loading.style.height = "125px";
            loading.style.position="absolute";
            loading.style.zIndex="101"; 
            loading.src = "/img/loading.gif";
            loading.style.top="50%";
            loading.style.left="50%";
            loading.style.transform="translate(-50%, -50%)";
            document.body.appendChild(loading);

            var iframe = document.createElement('iframe');

            iframe.style.position = "absolute";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.top = "0px";
            iframe.style.left = "0px";
            iframe.id = "iframe";
            iframe.style.zIndex="1000";
            iframe.style.border = "none";
            iframe.src = __uv$config.prefix + __uv$config.encodeUrl(url);
            document.body.appendChild(iframe);


    
            

    
    
            var x = document.createElement('img');
            x.style.cursor="pointer";
            x.style.position = "absolute";
            x.style.width = "50px";
            x.style.height = "50px";
            x.src = "/img/x.png";
            x.style.zIndex = "1001";
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
            open.style.zIndex = "1001";
            open.style.right = "65px";
            open.style.top = "1%";
            open.onclick = function() {
                if (document.getElementById("iframe").contentWindow.location.href!="about:blank"){
                    window.open(document.getElementById("iframe").contentWindow.location.href);
                }
            };

            document.body.appendChild(open);


            var inpcont=document.createElement('div');
            inpcont.style.maxWidth="80%";
            inpcont.style.overflowX="scroll";
            inpcont.style.overflowY="hidden";
            inpcont.style.padding="5px";
            inpcont.style.position="absolute";
            inpcont.style.top="2.5%";
            inpcont.style.left="75px";
    
            var inp = document.createElement('span');
            inp.style.zIndex = '999999999999999999999999999999999999999999999999999999';
            inp.id='inp';
            inp.style.textWrap="nowrap";
            inp.contentEditable="true";
            inp.spellcheck="false";
            inp.innerText="Run a bookmarklet..";
            inp.style.color="black";
            inp.style.top="2.5%";
            inp.style.fontFamily="font-family: Arial,Helvetica Neue,Helvetica,sans-serif !important;";
            inp.style.left="0px";
            inp.style.outline="none";
            inp.style.padding="3px";
            setInterval(() => {
              inp.style.backgroundColor="white";
            },1);
            inp.style.borderRadius="25px";
            inp.style.border="2px solid black";
            inp.style.position="relative";
            window.addEventListener('keydown',function(e) {
                if (e.keyIdentifier=='U+000A' || e.keyIdentifier=='Enter' || e.keyCode==13) {
                    var code=document.getElementById("inp").innerText;
                      var codescript=document.getElementById("iframe").contentWindow.document.createElement("script");
                      codescript.innerHTML=code;
                      document.getElementById("iframe").contentWindow.document.body.appendChild(codescript);
                  document.getElementById("inp").innerText="Run a bookmarklet..";
                    e.preventDefault();
                }
            });

            document.body.appendChild(inpcont);
            inpcont.appendChild(inp);
  
            var dev = document.createElement('img');
            dev.style.cursor="pointer";
            dev.style.position = "absolute";
            dev.style.width = "50px";
            dev.style.borderRadius="50%";
            dev.style.height = "50px";
            dev.src = "/img/wrench.jpg";
            dev.style.zIndex = "1001";
            dev.style.left = "1%";
            dev.style.top = "1%";
            dev.onclick = async function() {
              if (document.getElementById("iframe").contentWindow.document.getElementById("FirebugUI")==null){
                var firebug=document.getElementById("iframe").contentWindow.document.createElement("script");
                firebug.setAttribute('src','https://luphoria.com/fbl/fbl/firebug-lite-debug.js');
                firebug.setAttribute('id','firebugscriptidkeeee');
                document.getElementById("iframe").contentWindow.document.body.appendChild(firebug);
                (function(){
                  if (window.firebug.version){
                    firebug.init();
                  }else{
                    setTimeout(arguments.callee);
                  }
                })();
              } else {
                if (document.getElementById("iframe").contentWindow.document.getElementById("FirebugUI").style.display!="none"){
                  document.getElementById("iframe").contentWindow.document.getElementById("FirebugUI").style.display="none";
                }else{
                  document.getElementById("iframe").contentWindow.document.getElementById("FirebugUI").style.display="inline-block";
                }
              }
            };

            document.body.appendChild(dev);

});
