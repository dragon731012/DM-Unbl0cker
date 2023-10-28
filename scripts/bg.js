$(document).ready(function () {
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
