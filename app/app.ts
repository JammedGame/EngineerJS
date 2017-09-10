import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";
import * as Runner from "./Runner/Runner";
import * as Draw from "./Draw/Draw";

this._Game = new Engine.Game();
this._Game.Name = "3D Animation";
this._Runner = new Runner.Runner(this._Game, Draw.DrawEngineType.ThreeJS);