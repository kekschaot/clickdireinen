// var parentdiv = 'mainscreen';
// alert(parentdiv);
var game = new Phaser.Game(800, 600, Phaser.AUTO, "", { preload: preload, create: create, update: update });
var game_states = {} // dictionary with all the game stats
var music; // ingame background music
var cursors; 
var maxenemies = 2;
var slowMotionTimeoutId;


function preload() {      
  // wir laden den ganzen schrott den wir brauchen im haupt preloader
  // game.load.image('tdelogo'                       , 'static/wallpapers/tdeLogo.png'                         ,800,600);
  game.load.image('enemy'                       , 'static/enemy.png'                         );
  // game.load.audio('misc1'     , ['static/musik/misc1.ogg'   ]); // wir sollten die mucke zusätzlich zu mp3 convertieren        


}

function create() {
  alive = true;
  kills = 0; 
  lives = 4;

  enemies = game.add.group();
  textLives = game.add.text(game.world.width-110, 0, "Lives: "+lives, { font: "30px Arial", fill: "#ffff00", align: "center" });
  textKills = game.add.text(game.world.width-110, 30, "Kills: "+kills, { font: "30px Arial", fill: "#ffff00", align: "center" });


  textYouHaveLost = game.add.text(game.world.centerX, game.world.centerY, "YOU HAVE LOST", { font: "65px Arial", fill: "#ffff00", align: "center" });
  textYouHaveLost.anchor.set(0.5);
  textYouHaveLost.alpha = 0;

  textPlayAgain = game.add.text(game.world.centerX, game.world.centerY+50, "PLAY AGAIN?", { font: "30px Arial", fill: "#ff0000", align: "center" });
  textPlayAgain.inputEnabled = true;
  textPlayAgain.anchor.set(0.5);
  textPlayAgain.visible = false;
  textPlayAgain.events.onInputDown.add(function () {game.state.start("default")})
  // game.state.add('Logoshow',game_states.Logoshow);

}


function update() {

  if (lives <= 0) {
    alive = false;
    textYouHaveLost.alpha = 1;
    textPlayAgain.visible = true;
    // game.paused = true;
    // console.log('You have lost');

  }

  if (enemies.length < (kills / 3) +1) {

    var sprite = game.add.sprite(game.rnd.between(10,790),0,"enemy");
  
    // var rndpick = game.rnd.between(1,parseInt(kills/30 + 10))
    var rndpick = game.rnd.between(1,parseInt(kills/5 + 10))
    if ( rndpick == 1 ) {
      sprite.typus="freezer";
      sprite.tint = 0x0000ff;
      sprite.spezial = function () {
        clearTimeout(slowMotionTimeoutId) ;
        game.time.slowMotion = 3; 
        slowMotionTimeoutId = setTimeout(function () {
          game.time.slowMotion = 1;
        }, 3000);
      };
    } else if(rndpick == 2){
      sprite.typus="exploder";
      sprite.tint = 0xff0000;
      sprite.spezial = function () { for (var i = 0; i < enemies.children.length; i++) {
        enemies.children[i].kill();
      }};
    } else {
      sprite.typus="normal";
      sprite.spezial = function () {  };
    }


    sprite.lives = 3;
    sprite.inputEnabled=true;
    sprite.events.onInputDown.add(function () {
      // console.log(this);
      if (alive === true) { // if we are alive 
        this.lives = this.lives -1;  // we make damage to the sprite
      console.log("HIT");
      this.alpha = this.alpha * 0.50;
      }
      if ( this.lives <= 0 ) {
        this.kill();
        kills = kills +1;
        console.log("KILL");
        textKills.text = "Kills: "+kills;
        sprite.spezial();
      }
    },sprite);

    sprite.events.onOutOfBounds.add(function(asteroid){
      this.kill();
      if (lives > 0) {
        lives = lives - 1;
      }
      console.log('Lost a live..',lives);
      textLives.text = "Lives: " + lives ;
    }, sprite);

    // sprite.outOfBoundsKill  = true;
    sprite.checkWorldBounds=true;
    enemies.add(sprite);
    game.add.tween(sprite).to( {y: 650}, game.rnd.between(8000,12000), "Linear", true);
    game.add.tween(sprite).to( {x: game.rnd.between(100,500)}, game.rnd.between(8000,12000), "Sine", true);    
    
  }

  for (var i = 0; i < enemies.children.length; i++) {
    if (enemies.children[i].alive == false) {
      enemies.children[i].destroy();
    }
  };
    
}

