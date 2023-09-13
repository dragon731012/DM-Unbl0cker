var white = document.createElement('img');
white.style.cursor="pointer";
white.style.position = "absolute";
white.style.width = "100%";
white.style.height = "100%";
white.style.zIndex="1";
white.style.opacity="1";
white.src = "/img/black.jpeg";
white.style.right = "0px";
white.style.top = "0px";
document.body.appendChild(white);

var loading = document.createElement('img');
loading.style.cursor="pointer";
loading.style.width = "125px";
loading.style.height = "125px";
loading.style.position="absolute";
loading.style.zIndex="2"; 
loading.style.opacity="1";
loading.src = "/img/loading.gif";
loading.style.top="50%";
loading.style.left="50%";
loading.style.transform="translate(-50%, -50%)";
document.body.appendChild(loading);

function waitforfade(){
  function fade(){
    var lo=Number(loading.style.opacity)-0.01;
    loading.style.opacity=lo.toString();
    var wo=Number(white.style.opacity)-0.01;
    white.style.opacity=wo.toString();
    if (white.style.opacity=="0"){
      white.remove();
      loading.remove();
    }
  }
  setInterval(fade,5);
}
setTimeout(waitforfade,500);
