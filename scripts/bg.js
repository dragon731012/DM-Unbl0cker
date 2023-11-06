$(document).ready(function () {
    function get_cookie(cookie_name) { const value = "; " + document.cookie; const parts = value.split("; " + cookie_name + "="); if (parts.length === 2) return parts.pop().split(";").shift(); } 
    var running=true;
    /*
    if (window.location.pathname!="/chat" && window.location.pathname!="/settings"){
        document.body.appendChild(style1);
        var all = document.getElementsByTagName("*");
    
        for (var i=0, max=all.length; i < max; i++) {
            if (all[i].tagName!="BODY" && all[i].tagName!="HTML" && all[i].tagName!="HEAD"){
                all[i].style.fontFamily="Ultra, serif";
            }
        }
    }
    */
    
    if (get_cookie("theme")=="space"){
        var particlecolor="white";
        var opacitychange="0.2";
        var backgroundcolor="black";
        var hovercolor="#444";
        var navcolor="#333";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="ocean"){
        var particlecolor="white";
        var opacitychange="0.2";
        var backgroundcolor="#1440C2";
        var hovercolor="#0075ba";
        var navcolor="#0066FF";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="fire and ice"){
        var particlecolor="black";
        var opacitychange="0.2";
        var backgroundcolor="linear-gradient(90deg, rgb(255, 0, 0) 0%, rgba(0,0,0,1) 51%, rgb(34, 181, 255) 100%);";
        var hovercolor="#a6a6a6";
        var navcolor="black";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="thanksgiving"){
        var particlecolor="#870020";
        var backgroundcolor="#856100";
        var opacitychange="0.2";
        var hovercolor="#c29723";
        var navcolor="#fc9003";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="beach"){
        var particlecolor="#dbd446";
        var backgroundcolor="#c7bda3";
        var hovercolor="#dbd446";
        var opacitychange="0.2";
        var navcolor="#65aceb";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="wildfire"){
        var particlecolor="#fad450";
        var backgroundcolor="#433834";
        var hovercolor="#f6a93c";
        var navcolor="#b85e30";
        var opacitychange="0.2";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="cotton candy"){
        var particlecolor="#fab3ff";
        var backgroundcolor="#e247ed";
        var hovercolor="#ffd1ff";
        var opacitychange="0.2";
        var navcolor="#dd16e0";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="rainforest"){
        var particlecolor="#4788ff";
        var backgroundcolor="#06c92d";
        var opacitychange="0.2";
        var hovercolor="#06c22b";
        var navcolor="#017819";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="patriotic"){
        var particlecolor="white";
        var backgroundcolor="blue";
        var hovercolor="#a6a6a6";
        var navcolor="red";
        var opacitychange="0.2";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="sunshine"){
        var particlecolor="white";
        var backgroundcolor="#ffce47";
        var hovercolor="yellow";
        var opacitychange="0.2";
        var navcolor="#ebad05";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="halloween"){
        var particlecolor="green";
        var backgroundcolor="#f29d13";
        var hovercolor="#a6a6a6";
        var opacitychange="0.2";
        var navcolor="black";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }
    else if (get_cookie("theme")=="heavenly light"){
        var particlecolor="white";
        var backgroundcolor="black";
        var opacitychange="0";
        var hovercolor="#444";
        var navcolor="#333";
        var glow="0 0 100px 100px rgb(255, 255, 255)";
        var textcolor="#878787";
    }
    else{
        var particlecolor="white";
        var backgroundcolor="black";
        var hovercolor="#444";
        var navcolor="#333";
        var glow="0 0 0px 0px rgb(255, 255, 255)";
    }

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "@import url('https://fonts.googleapis.com/css2?family=Ultra&display=swap');#chats { background:"+backgroundcolor+" !important; } #fsbutton{background-color:"+navcolor+" !important;} ul.navbar {background-color: "+navcolor+" !important;} li.nav-item2 a:hover,li.nav-item a:hover { background-color: "+hovercolor+" !important; } .black{ background:"+backgroundcolor+" !important; } .search{ background:"+backgroundcolor+" !important; } .particle { width: 0px; opacity: 1; border-radius: 50%; height: 0px; left: 50%; top: 50%; box-shadow: "+glow+"; background-color: "+particlecolor+"; position: absolute; } #particlebox { color: transparent; z-index: -9999999999; background: transparent; position: absolute; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%; } body { background: "+backgroundcolor+" !important; overflow:hidden;font-family:Ultra, serif !important;}";
    document.getElementsByTagName('head')[0].appendChild(style);

    if (textcolor!=null && textcolor!=undefined){
        var all = document.getElementsByTagName("*");
        
        for (var i=0, max=all.length; i < max; i++) {
         all[i].style.color = textcolor;
         all[i].style.borderColor = textcolor;
        }
    }

    if (window.location.pathname=="/home.html"){
        const form = document.getElementById("searchbox");
        form.addEventListener("submit", async (event) => {
            running=false;
        });
    }
    
    if (window.location.pathname!="/" && window.location.pathname!="/chat"){
            setInterval(() => {
              if (running){
                  var particle = document.createElement("div");
                  particle.className = "particle";
                  document.getElementById("particlebox").appendChild(particle);
                  var x = Math.floor(Math.random() * window.innerWidth);
                  var y = Math.floor(Math.random() * window.innerHeight);
            
                  var speed = Math.floor(Math.random() * 4000);
                  var size = Math.floor(Math.random() * 25);
            
                  if (Math.floor(Math.random() * 2) == 1) {
                    if (y > x) {
                      x = -50;
                    } else {
                      y = -50;
                    }
                  } else {
                    if (y > x) {
                      x = window.innerWidth + 50;
                    } else {
                      y = window.innerHeight + 50;
                    }
                  }
                  $(particle).animate(
                    {
                      left: x + "px",
                      top: y + "px",
                      opacity: opacitychange,
                      display: "none",
                      height: 10 + size + "px",
                      width: 10 + size + "px"
                    },
                    4500 + speed,
                    function () {
                      particle.remove();
                    }
                  );
              }
            }, 100);
    }
  });
