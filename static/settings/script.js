function get_cookie(cookie_name) { const value = "; " + document.cookie; const parts = value.split("; " + cookie_name + "="); if (parts.length === 2) return parts.pop().split(";").shift(); } 
var title2=get_cookie("title2");
var favicon=get_cookie("favicon");

if (title2!=undefined){
    title.value=title2;
    document.title=title2;
}
    
if (favicon!=undefined){
    url1.value=favicon;
    var t = document.querySelector('head');
    var f = document.createElement('link');
    f.setAttribute('rel','shortcut icon');
    f.setAttribute('href',favicon);
    t.appendChild(f);
}
    
function whileloop(){
    if (importing.value!=""){
        url1.value="";
        title.value="";
    }
}
    
setInterval(whileloop,15);
    
var fontsize1=2560/screen.width*8;
url1.style.fontSize = fontsize1+"px";
var fontsize2=2560/screen.width*8;
title.style.fontSize = fontsize2+"px";
var fontsize3=2560/screen.width*8;
importing.style.fontSize = fontsize3+"px";
    
   
function settitle(titlename){
   document.title=titlename;
}
   
function settandf(){
var url=importing.innerText;
var originalurl=url;
   
settitle(originalurl);

if (url.includes("https://")==false){
    url="https://"+url;
}

url="https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url="+url;
   
document.cookie="icon="+url+"; expires=Thu, 18 Dec 9013 12:00:00 UTC; path=/";

setfavicon(url); 
}
function setfavicon(favicon){
(function() {
       var link=document.querySelector("link[rel*='icon']") || document.createElement('link');
       link.type='image/x-icon';
       link.rel='shortcut icon';
       link.href=favicon;
       document.getElementsByTagName('head')[0].appendChild(link);
   })();
}
