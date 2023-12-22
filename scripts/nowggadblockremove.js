alert("bypass by Potato. https://github.com/dragon731012");

setInterval(() => {
    var div=document.getElementsByTagName("div");
    for (var i=0; i<div.length;i++){
        if (div[i].className.includes("ad-blocker")){
            div[i].style.display="none";
        }
    }
},0);
