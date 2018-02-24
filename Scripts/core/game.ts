// IIFE - Immediately Invoked Function Expression
(function(){
  let stage:createjs.Stage;
  let canvas:any;
  let assetManager:createjs.LoadQueue;
  let assetManifest = [
    {id: "ocean", src:"./Assets/images/ocean.gif"},
    {id: "engine", src:"./Assets/audio/engine.ogg"},
    {id: "thunder", src:"./Assets/audio/thunder.ogg"},
    {id: "yay", src:"./Assets/audio/yay.ogg"}
  ];

  let textureAtlasData = {

    "images": [
      "./Assets/spritesheets/textureatlas.png"
  ],
  
  "frames": [
      [1, 1, 53, 54, 0, 0, 0],
      [56, 1, 53, 54, 0, 0, 0],
      [111, 1, 53, 54, 0, 0, 0],
      [166, 1, 53, 54,  0, 0, 0],
      [221, 1, 53, 54,  0, 0, 0],
      [276, 1, 53, 54,  0, 0, 0],
      [331, 1, 52, 53,  0, 0, 0],
      [385, 1, 3, 3,  0, 0, 0],
      [390, 1, 9, 9,  0, 0, 0],
      [1, 57, 226, 178,  0, 0, 0],
      [229, 57, 62, 62,  0, 0, 0],
      [293, 57, 62, 51,  0, 0, 0],
      [357, 57, 62, 51,  0, 0, 0],
      [421, 57, 62, 51,  0, 0, 0],
      [1, 237, 150, 50,  0, 0, 0],
      [153, 237, 150, 50,  0, 0, 0]
  ],
  
  "animations": {
      "bigExplosion": {
           "frames": [0, 1, 2, 3, 4, 5, 6],
           "next": "clearExplosion",
           "speed": 0.25
          },
      "clearExplosion" : {
            "frames": [7]
      },
      "bullet": { "frames": [8] },
      "cloud": { "frames": [9] },
      "island": { "frames": [10] },
      "plane": { 
          "frames": [11, 12, 13],
          "speed": 0.25
      },
      "restartButton": { "frames": [14] },
      "startButton": { "frames": [15] }
  }
  
  };

  let textureAtlas: createjs.SpriteSheet;

  let currentScene: objects.Scene;
  let currentState:number;

  function Init() {
    assetManager = new createjs.LoadQueue();
    assetManager.installPlugin(createjs.Sound);
    assetManager.on("complete", Start);
    assetManager.loadManifest(assetManifest);

    textureAtlas = new createjs.SpriteSheet(textureAtlasData);
  }

  function Start() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.on("tick", Update);

    currentState = config.START;
    Main();
  }

  // Main Game Loop
  function Update() {
    let newState = currentScene.Update();
    if(newState != currentState) {
      currentState = newState;
      Main();
    }
    stage.update();
  }

  function Main() {

    stage.removeAllChildren();

    switch(currentState) {
      case config.START:
      currentScene = new scenes.Start(assetManager, textureAtlas, currentState);
      break;

      case config.PLAY:
      currentScene = new scenes.Play(assetManager, textureAtlas, currentState);
      break;

      case config.END:
      currentScene = new scenes.End(assetManager, textureAtlas, currentState);
      break;
    }

    stage.addChild(currentScene);
  }

  window.onload = Init;

})();
