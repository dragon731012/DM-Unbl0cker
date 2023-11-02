var topdoc=document.getElementById("frame").contentWindow; 
var doc = topdoc.document.getElementById("iframe").contentWindow; 


var script=topdoc.document.createElement("script");
script.src=window.location.origin+"/games/gfiles/cookieclickerhacks/opensesame.js";
doc.document.body.appendChild(script);
