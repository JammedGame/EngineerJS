import * as Util from "./Util/Util";
import * as Data from "./Data/Data";
import * as Engine from "./Engine/Engine";
import * as Math from "./Mathematics/Mathematics";

import * as Runner from "./Runner/Runner";
import * as Draw from "./Draw/Draw";

Util.Log.Print(" EngineerJS Version 0.0.1");

let G:Engine.Game = new Engine.Game();
G.Name = "Test Game";

let S:Engine.Scene2D = new Engine.Scene2D();
S.BackColor = Math.Color.FromRGBA(0,0,0,255);
S.Name = "Test Scene";

let Sprite:Engine.Sprite = new Engine.Sprite();
Sprite.SpriteSets.push(new Engine.SpriteSet(null, "Run", ["/build/resources/sprites/cube.jpg"]));
Sprite.SetSpriteSet(0);
Sprite.Trans.Translation = new Math.Vertex(200,200,0);
Sprite.Trans.Scale = new Math.Vertex(150, 150,1);
Sprite.Data["Collision"] = Math.CollisionType.Rectangular2D;
S.AddSceneObject(Sprite);

let Sprite1:Engine.Sprite = new Engine.Sprite();
Sprite1.Trans.Translation = new Math.Vertex(600,600,0);
Sprite1.Trans.Scale = new Math.Vertex(200,200,1);
Sprite1.Data["Collision"] = Math.CollisionType.Rectangular2D;
S.AddSceneObject(Sprite1);

let Tile1:Draw.ImageContainer = new Draw.ImageContainer();
Tile1.Load("/build/resources/sprites/cube.jpg", function()
{
    let Tiled:Draw.ImageContainer = new Draw.ImageContainer();
    Tiled.Create(new Math.Vertex(200, 100, 0));
    Tiled.DrawImage(Tile1.Data, new Math.Vertex(0,0,0), new Math.Vertex(100,100,0));
    Tiled.DrawImage(Tile1.Data, new Math.Vertex(100,0,0), new Math.Vertex(100,100,0));
    console.log(Tiled.Drawn);
    Sprite1.SpriteSets.push(new Engine.SpriteSet(null, "Run", [Tiled.Drawn]));
    Sprite1.SetSpriteSet(0);
});

function KeyDown(G:Engine.Game, Args) : void
{
    let ColVal:Math.CollisionValue = Math.Collision.Check(Util.Convert.DrawObjectToCollider(Sprite), Util.Convert.DrawObjectToCollider(Sprite1));
    //Util.Log.Print(ColVal);
    if(Args.Key == "a" && !ColVal.Left)
    {
        Sprite.Trans.Translation.X -= 10;
    }
    if(Args.Key == "d"  && !ColVal.Right)
    {
        Sprite.Trans.Translation.X += 10;
    }
    if(Args.Key == "w"  && !ColVal.Top)
    {
        Sprite.Trans.Translation.Y -= 10;
    }
    if(Args.Key == "s"  && !ColVal.Bottom)
    {
        Sprite.Trans.Translation.Y += 10;
    }
}

S.Events.KeyPress.push(KeyDown);

G.AddScene(S);

let R:Runner.Runner = new Runner.Runner(G, Draw.DrawEngineType.ThreeJS);
R.SwitchScene("Test Scene", false);