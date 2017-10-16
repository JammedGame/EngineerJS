export  { DrawEngineType, DrawEngine };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";

import { RenderEnableCap, Renderer } from "./Renderer";

enum DrawEngineType
{
    WGL2 = 0,
    ThreeJS = 1
}
class DrawEngine
{
    protected _Matrix:Math.MatrixTransformer;
    protected _Renderer:any;
    protected _Target:HTMLCanvasElement;
    protected _Parent:HTMLCanvasElement;
    protected _GlobalScale:Math.Vertex;
    protected _GlobalOffset:Math.Vertex;
    protected _Resolution:Math.Vertex;
    public get Renderer():any { return this._Renderer; }
    public set Renderer(value:any) { this._Renderer = value; }
    public get GlobalScale():Math.Vertex { return this._GlobalScale; }
    public get GlobalOffset():Math.Vertex { return this._GlobalOffset; }
    public get Resolution():Math.Vertex { return this._Resolution; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:DrawEngine, Resolution?:any)
    {
        Util.Log.Print("EngineerJS Version " + Engine.Settings.Version);
        this._Target = document.getElementById("canvas") as HTMLCanvasElement;
        this._Parent = document.getElementById("canvas-parent") as HTMLCanvasElement;
        if(Resolution) this._Resolution = Resolution;
        else this._Resolution = new Math.Vertex(1920, 1080, 1);
        this._GlobalScale = new Math.Vertex(1,1,1);
        this._GlobalOffset = new Math.Vertex(0,0,0);
        this._Matrix = new Math.MatrixTransformer();
    }
    public Copy() : DrawEngine
    {
        let New:DrawEngine = new DrawEngine(this);
        return New;
    }
    public Resize() : void
    {
        // Virtual
    }
    public Draw2DScene(Scene:Engine.Scene2D, Size:Math.Vertex) : void
    {
        // Virtual
    }
    protected DrawSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Virtual
    }
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Virtual
    }
    protected DrawTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        // Virtual
    }
    protected LoadTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        // Virtual
    }
}