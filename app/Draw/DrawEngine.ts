export  { DrawEngineType, DrawEngine };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";

enum DrawEngineType
{
    ThreeJS = 0
}
class DrawEngine
{
    private _Matrix:Math.MatrixTransformer;
    private _Renderer:any;
    protected _GlobalScale:Math.Vertex;
    protected _GlobalOffset:Math.Vertex;
    protected _Resolution:Math.Vertex;
    public get Renderer():any { return this._Renderer; }
    public set Renderer(value:any) { this._Renderer = value; }
    public get GlobalScale():Math.Vertex { return this._GlobalScale; }
    public get GlobalOffset():Math.Vertex { return this._GlobalOffset; }
    public get Resolution():Math.Vertex { return this._Resolution; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:DrawEngine)
    {
        Util.Log.Print("EngineerJS Version " + Engine.Settings.Version);
        this._Matrix = new Math.MatrixTransformer();
    }
    public Copy() : DrawEngine
    {
        let New:DrawEngine = new DrawEngine(this);
        return New;
    }
    public DrawScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        // Virtual
    }
    protected Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        // Virtual
    }
    protected Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
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
    protected DrawActor(Scene:Engine.Scene, Drawn:Engine.Actor) : void
    {
        // Virtual
    }
    protected LoadActor(Scene:Engine.Scene, Drawn:Engine.Actor) : void
    {
        // Virtual
    }
    protected LoadCamera(Scene:Engine.Scene, Drawn:Engine.Camera) : void
    {
        // Virtual
    }
    protected LoadLight(Scene:Engine.Scene, Drawn:Engine.Light) : void
    {
        // Virtual
    }
}