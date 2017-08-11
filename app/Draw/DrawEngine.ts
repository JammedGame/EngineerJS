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
    public get Renderer():any { return this._Renderer; }
    public set Renderer(value:any) { this._Renderer = value; }
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
    public Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        // Virtual
    }
    public Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        // Virtual
    }
    private DrawSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Virtual
    }
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Virtual
    }
    private DrawTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        // Virtual
    }
    protected LoadTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        // Virtual
    }
}