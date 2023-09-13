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


