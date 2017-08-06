import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";

import * as Runner from "./Runner/Runner";
import * as Draw from "./Draw/Draw";

Util.Log.Print(" EngineerJS Version 0.0.0.1");

let G:Engine.Game = new Engine.Game();
G.Name = "Test Game";

let S:Engine.Scene2D = new Engine.Scene2D();
S.BackColor = Math.Color.FromRGBA(0,0,0,255);
S.Name = "Test Scene";

let Sprite:Engine.Sprite = new Engine.Sprite();
Sprite.SpriteSets.push(new Engine.SpriteSet(null, "Run", ["/build/resources/sprites/enm3-1.png"]));
Sprite.SetSpriteSet(0);
Sprite.Trans.Translation = new Math.Vertex(300,300,0);
Sprite.Trans.Scale = new Math.Vertex(300,300,1);
S.AddSceneObject(Sprite);

G.AddScene(S);

let R:Runner.Runner = new Runner.Runner(G, Draw.DrawEngineType.ThreeJS);
R.SwitchScene("Test Scene", false);