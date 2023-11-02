var amount=prompt("how many cookies do you want to have?");
Game.cookies = Game.cookiesEarned + amount;
alert("cookies set.");
Game.Achievements["Cheated cookies taste awful"].won=0;
