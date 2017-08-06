export  { DrawEngine };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";

import { RenderEnableCap, Renderer } from "./Renderer";

class DrawEngine
{
    private _Matrix:Math.MatrixTransformer;
    private _CurrentRenderer:Renderer;
    public get CurrentRenderer():Renderer { return this._CurrentRenderer; }
    public set CurrentRenderer(value:Renderer) { this._CurrentRenderer = value; }
    public Data: { [key: string]:any; } = {};
    public constructor(Old?:DrawEngine)
    {
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
        this._CurrentRenderer.Toggle(RenderEnableCap.Depth, false);
        this._CurrentRenderer.SetViewport(Width, Height);
        this._CurrentRenderer.ClearColor(Scene.BackColor.ToArray());
        this._CurrentRenderer.Clear();
        this._Matrix.MatrixMode(Math.MatrixMode.Projection);
        this._Matrix.LoadIdentity();
        this._Matrix.Ortho2D(0, Width, Height, 0);
        this._CurrentRenderer.SetProjectionMatrix(this._Matrix.ProjectionMatrix.Fields);
        this._Matrix.MatrixMode(Math.MatrixMode.ModelView);
        this._Matrix.LoadIdentity();
        this._Matrix.Translate(Scene.Trans.Translation.X, Scene.Trans.Translation.Y, Scene.Trans.Translation.Z);
        this._Matrix.PushMatrix();
        this._CurrentRenderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
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
            this._CurrentRenderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
            this._CurrentRenderer.RenderSprite(Drawn.ID, Drawn.CollectiveList(), (Drawn.CollectiveList().length > 0) ? Drawn.Index() : -1, Drawn.Modified);
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
}