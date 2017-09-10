import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";
import * as Runner from "./Runner/Runner";
import * as Draw from "./Draw/Draw";

import { Models } from "./Models";

let Pillar = new Engine.Actor();
Pillar.ExternData = JSON.parse(Models.Pillar);

let Scene = new Engine.Scene3D();
Scene.Name = "Default";
Scene.AddSceneObject(Pillar);

let Game = new Engine.Game();
Game.Name = "3D Animation";
Game.Scenes = [];
Game.AddScene(Scene);

let DRunner = new Runner.Runner(Game, Draw.DrawEngineType.ThreeJS);
DRunner.SwitchScene("Default", true);
