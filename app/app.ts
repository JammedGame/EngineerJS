import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";

import * as Draw from "./Draw/Draw";
import * as Three from "./Draw/Three/Three";

console.log("EngineerJS");

let G:Engine.Game = new Engine.Game();
G.Name = "Test Game";

let S:Engine.Scene2D = new Engine.Scene2D();
S.BackColor = Math.Color.FromRGBA(255,0,0,255);

let Sprite:Engine.Sprite = new Engine.Sprite();
Sprite.SpriteSets.push(new Engine.SpriteSet(null, "Run", "/build/resources/sprites/run.png"));
Sprite.SetSpriteSet(0);
let Drawn:Engine.DrawnSceneObject = new Engine.DrawnSceneObject();
Drawn.Visual = Sprite;

S.AddSceneObject(Drawn);

let Drawer:Three.ThreeDrawEngine = new Three.ThreeDrawEngine();
Drawer.Draw2DScene(S, window.innerWidth, window.innerHeight);
