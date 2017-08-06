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
S.BackColor = Math.Color.FromRGBA(200,200,200,255);

let Sprite:Engine.Sprite = new Engine.Sprite();
Sprite.SpriteSets.push(new Engine.SpriteSet(null, "Run", ["/build/resources/sprites/run.png"]));
Sprite.SetSpriteSet(0);
Sprite.Trans.Translation = new Math.Vertex(600,600,0);
Sprite.Trans.Scale = new Math.Vertex(600,100,1);

S.AddSceneObject(Sprite);

let Drawer:Three.ThreeDrawEngine = new Three.ThreeDrawEngine();
Drawer.Draw2DScene(S, window.innerWidth, window.innerHeight);
