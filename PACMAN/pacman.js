
var game = new Phaser.Game(450,500, Phaser.AUTO, 'phaser-example', {preload: preload, create: create});

var map;
var layer;


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

}



