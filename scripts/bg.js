$(document).ready(function () {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.particle { width: 0px; opacity: 1; border-radius: 50%; height: 0px; left: 50%; top: 50%; background-color: white; position: absolute; } #particlebox { color: transparent; z-index: -9999999999; background: transparent; position: absolute; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%; } body { background-color: black; overflow:hidden; }';
    document.getElementsByTagName('head')[0].appendChild(style);
    
    setInterval(() => {
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
          opacity: "0.2",
          display: "none",
          height: 10 + size + "px",
          width: 10 + size + "px"
        },
        4500 + speed,
        function () {
          particle.remove();
        }
      );
    }, 100);
  });
