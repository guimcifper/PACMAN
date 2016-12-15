var game = new Phaser.Game(450,500, Phaser.AUTO, 'phaser-example', {init:init, preload: preload, create: create, update:update, mov :mov});

var map;
var layer;

var pacman = null;
var safetile = 14;
var current = Phaser.NONE;


function init() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.physics.startSystem(Phaser.Physics.ARCADE);
}

function preload() {
    game.load.tilemap('Map', 'Map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'images/camp.png');
    game.load.spritesheet('pacman', 'images/pacman.png', 32, 32 );
}

function create() {

    game.stage.backgroundColor = '#000000';

    map = game.add.tilemap('Map');
    map.addTilesetImage('pacman-mapa1', 'tiles');
    layer = map.createLayer('mapa1');

    // Posición del pacman, grid location 14x17
    pacman = game.add.sprite((14 * 16) + 8, (17 * 16) + 8, 'pacman', 0);
    pacman.anchor.set(0.5);

    // Pacman should collide with everything except the safe tile
    map.setCollisionByExclusion([safetile], true, layer);

    //Nombre animacion, Frames, Velocidad por frame y si es ciclico.
    pacman.animations.add('munch', [0, 1, 2, 1], 20, true);

    game.physics.arcade.enable(pacman);
    pacman.body.setSize(16, 16, 0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    //animación
    pacman.play('munch');
}


function update() {
    game.physics.arcade.collide(pacman, layer);
    mov();
}

function mov(){

    if(cursors.left.isDown && current!== Phaser.LEFT){

        pacman.angle = 180;
        pacman.body.velocity.x = -150;
        pacman.animations.play('left');

    }
    else if(cursors.right.isDown && current!== Phaser.RIGHT){

        pacman.angle = 360;
        pacman.body.velocity.x = 150;
        pacman.animations.play('right');

    }
    else if(cursors.up.isDown && current!== Phaser.UP) {

        pacman.angle = 270;
        pacman.body.velocity.y = -150;
        pacman.animations.play('up');
    }
    else if (cursors.down.isDown && current!== Phaser.DOWN) {

        pacman.angle = 90;
        pacman.body.velocity.y = 150;
        pacman.animations.play('down');
    }

}



