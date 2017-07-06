import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";

import * as Draw from "./Draw/Draw";
import * as WGL2 from "./Draw/WebGL2/WebGL2";

console.log("EngineerJS");

let G:Engine.Game = new Engine.Game();
G.Name = "Test Game";

let S:Engine.Scene2D = new Engine.Scene2D();
S.BackColor = Math.Color.FromRGBA(255,0,0,255);

let WGL:WGL2.WGL2ShaderRenderer = new WGL2.WGL2ShaderRenderer();
let Drawer:Draw.DrawEngine = new Draw.DrawEngine();
Drawer.CurrentRenderer = WGL;
Drawer.Draw2DScene(S, window.innerWidth, window.innerHeight);
