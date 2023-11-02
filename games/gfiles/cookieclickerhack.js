function runfile(file,top){
  if (top){
    var topdoc=document.getElementById("frame").contentWindow; 
    var doc = topdoc.document.getElementById("iframe").contentWindow; 
  }
  else{
    var doc = document.getElementById("iframe").contentWindow; 
  }
  
  var script=doc.document.createElement("script");
  script.src=window.location.origin+"/games/gfiles/cookieclickerhacks/"+file;
  doc.document.body.appendChild(script);
}
