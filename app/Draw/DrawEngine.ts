export  { DrawEngineType, DrawEngine };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";

import { RenderEnableCap, Renderer } from "./Renderer";

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
    public Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        // Virtual
        if(Scene == null) return;
        this._Renderer.Toggle(RenderEnableCap.Depth, false);
        this._Renderer.SetViewport(Width, Height);
        this._Renderer.ClearColor(Scene.BackColor.ToArray());
        this._Renderer.Clear();
        this._Matrix.MatrixMode(Math.MatrixMode.Projection);
        this._Matrix.LoadIdentity();
        this._Matrix.Ortho2D(0, Width, Height, 0);
        this._Renderer.SetProjectionMatrix(this._Matrix.ProjectionMatrix.Fields);
        this._Matrix.MatrixMode(Math.MatrixMode.ModelView);
        this._Matrix.LoadIdentity();
        this._Matrix.Translate(Scene.Trans.Translation.X, Scene.Trans.Translation.Y, Scene.Trans.Translation.Z);
        this._Matrix.PushMatrix();
        this._Renderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
        let Sprites:Engine.Sprite[] = Scene.Sprites;
        for(let i = 0; i < Sprites.length; i++)
        {
            this.DrawSprite(Scene, Sprites[i]);
        }
    }
    public Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        // Virtual
        // TODO
    }
    private DrawSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Virtual
        if(Drawn.Active)
        {
            this._Matrix.Translate(Drawn.Trans.Translation.X, Drawn.Trans.Translation.Y, Drawn.Trans.Translation.Z);
            this._Matrix.Scale(Drawn.Trans.Scale.X, Drawn.Trans.Scale.Y, Drawn.Trans.Scale.Z);
            this._Matrix.Rotate(Drawn.Trans.Rotation.X, 1, 0, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Y, 0, 1, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Z, 0, 0, 1);
            this._Renderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
            this._Renderer.RenderSprite(Drawn.ID, Drawn.CollectiveList(), (Drawn.CollectiveList().length > 0) ? Drawn.Index() : -1, Drawn.Modified);
            Drawn.Modified = false;
            for(let i = 0; i < Drawn.SubSprites.length; i++)
            {
                this.DrawSprite(Scene, Drawn.SubSprites[i]);
            }
            this._Matrix.PopMatrix();
        }
    }
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {

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