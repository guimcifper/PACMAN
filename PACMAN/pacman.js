var game = new Phaser.Game(450,500, Phaser.AUTO, 'phaser-example', {init:init, preload: preload, create: create, update:update, mov: mov, eatDot: eatDot, eatPill: eatPill, tunnel: tunnel, deadpacman: deadpacman});
var map;
var layer;

var pacman = null;
var safetile = 14;

var current = Phaser.NONE;

var music_eatdot;
var music_eatdot1;
var music_intro;

var score = 0;
var scoreText = null;

var Inky;


function init() {

    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

function preload() {
    game.load.tilemap('Map', 'Map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'images/camp.png');
    game.load.spritesheet('pacman', 'images/pacman.png', 32, 32 );
    game.load.image('dot', 'images/dot.png');
    game.load.image('pill', 'images/pill.png');

    game.load.spritesheet('ghosts', 'images/ghosts.png',32, 32);

    game.load.audio('intro', 'sounds/pacman_beginning.wav');
    game.load.audio('pacman-chomp', 'sounds/pacman_chomp.wav');
    game.load.audio('pacman-chomp1', 'sounds/pacman_chomp1.wav');
    game.load.audio('death', 'sounds/death.wav');

}

function create() {

    map = game.add.tilemap('Map');
    map.addTilesetImage('pacman-mapa1', 'tiles');
    layer = map.createLayer('mapa1');

    dots = game.add.physicsGroup();
    pills = game.add.physicsGroup();

    map.createFromTiles(7, safetile, 'dot', layer, dots);
    map.createFromTiles(40, safetile, 'pill', layer, pills);

    //  The dots will need to be offset by 6px to put them back in the middle of the grid
    dots.setAll('x', 6, false, false, 1);
    dots.setAll('y', 6, false, false, 1);

    scoreText = game.add.text(372, 258, "Score: " + score, {fontSize: "13px", fill: "#00ff29"});

    //posición inicial de los fantasmas
    Inky = game.add.sprite((14 * 14), (17 * 11) - 3, 'ghosts', 0);
    Inky.anchor.set(0.5);

    Clyde= game.add.sprite((14 * 15)- 7, (17 * 14), 'ghosts', 5);
    Clyde.anchor.set(0.5);

    Pinky = game.add.sprite((14 * 18) -7 , (17 * 14), 'ghosts', 9);
    Pinky.anchor.set(0.5);

    Blinky = game.add.sprite((14 * 18), (17 * 11) - 3, 'ghosts', 13);
    Blinky.anchor.set(0.5);

    //sonido al pasar por los puntos.
    music_eatdot = game.add.audio('pacman-chomp');
    music_eatdot.volume = 0.2;

    music_eatdot1 = game.add.audio('pacman-chomp1');
    music_eatdot1.volume = 0.4;

    //reproducimos el sonido de la intro.
    music_intro = game.add.audio('intro');
    music_intro.volume = 0.2;
    music_intro.play();

    music_death = game.add.audio('death');

    // Posición del pacman, grid location 14x17
    pacman = game.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
    pacman.anchor.set(0.5);

    // Pacman should collide with everything except the safe tile
    map.setCollisionByExclusion([safetile], true, layer);

    //Nombre animacion, Frames, Velocidad por frame y si es ciclico.
    pacman.animations.add('munch', [0, 1, 2, 1], 20, true);
    pacman.animations.add("death", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], 10, false);

    pacman.animations.add("frightened", [16 ,17], false);

    game.physics.arcade.enable(pacman);
    pacman.body.setSize(16, 16, 0, 0);

    //fantasma.
    game.physics.arcade.enable(Inky);
    Inky.body.setSize(16, 16, 0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    //animación
    pacman.play('munch');
}


function update() {

    game.physics.arcade.collide(pacman, layer);
    game.physics.arcade.collide(Inky,layer);

    mov();

    game.physics.arcade.collide(pacman,Inky,deadpacman, null,this);

    game.physics.arcade.overlap(pacman, dots, eatDot, null, this);
    game.physics.arcade.overlap(pacman, pills, eatPill, null, this);

    scoreText.text = 'Score: ' + score;
    tunnel();

}

function mov(){

    if(cursors.left.isDown && current!== Phaser.LEFT){

        pacman.angle = 180;
        pacman.body.velocity.x = -200;
        pacman.animations.play('left');

    }
    else if(cursors.right.isDown && current!== Phaser.RIGHT){

        pacman.angle = 360;
        pacman.body.velocity.x = 200;
        pacman.animations.play('right');

    }
    else if(cursors.up.isDown && current!== Phaser.UP) {

        pacman.angle = 270;
        pacman.body.velocity.y = -200;
        pacman.animations.play('up');

    }
    else if (cursors.down.isDown && current!== Phaser.DOWN) {

        pacman.angle = 90;
        pacman.body.velocity.y = 200;
        pacman.animations.play('down');

    }

}

function eatDot (pacman, dot) {

    dot.kill();
    music_eatdot.play();
    score +=10;

    if (dots.total === 0)
    {
        dots.callAll('revive');
        score = 0;
    }
}

function eatPill (pacman, pill) {

    pill.kill();
    music_eatdot1.play();
    score +=50;

}

function tunnel() {

    if(pacman.body.x > 450){
        pacman.body.x = 0;
    }

    else if(pacman.body.x < 0){
        pacman.body.x = 450;
    }
}

function deadpacman (Inky, pacman) {

    if(pacman = Inky){
        music_death.play();
        pacman.play('death');
        //pacman.kill();
    }
}

//TODO: Que el fantasma se mueva independientemente buscando al pacman.




