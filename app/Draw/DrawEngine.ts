export  { DrawEngineType, DrawEngine };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";

import { RenderEnableCap, Renderer } from "./Renderer";

enum DrawEngineType
{
    WebGL2 = "WGL2",
    ThreeJS = "ThreeJS"
}
class DrawEngine
{
    protected _Matrix:Math.MatrixTransformer;
    protected _Renderer:any;
    protected _FixedSize:boolean;
    protected _GlobalScale:Math.Vertex;
    protected _GlobalOffset:Math.Vertex;
    protected _Resolution:Math.Vertex;
    protected _Target:any;
    protected _Parent:any;
    protected _Type:DrawEngineType;
    public get Renderer():any { return this._Renderer; }
    public set Renderer(value:any) { this._Renderer = value; }
    public get GlobalScale():Math.Vertex { return this._GlobalScale; }
    public get GlobalOffset():Math.Vertex { return this._GlobalOffset; }
    public get Resolution():Math.Vertex { return this._Resolution; }
    public get Type():DrawEngineType { return this._Type; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:DrawEngine, Resolution?:any)
    {
        this._FixedSize = false;
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
    public UpdateResolution(Resolution:Math.Vertex, FixedSize?:boolean) : void
    {
        // Virtual
        this._Resolution = Resolution;
        if(FixedSize != null) this._FixedSize = FixedSize;
    }
    public Resize() : void
    {
        // Virtual
    }
    public TransformToCanvas(X:number, Y:number) : Math.Vertex
    {
        if(this._FixedSize) return new Math.Vertex(X, Y, 0);
        return new Math.Vertex((X / this._Target.clientWidth) * this._Resolution.X, (Y / this._Target.clientHeight) * this._Resolution.Y, 0);
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
    protected LoadLight(Scene:Engine.Scene, Drawn:Engine.Light) : void
    {
        // Virtual
    }
}