export  { WGL2DrawEngine };

import * as Math from "./../../Mathematics/Mathematics"
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import { DrawEngine } from "./../DrawEngine";
import { RenderEnableCap, Renderer } from "./../Renderer";
import { WGL2ShaderRenderer } from "./WGL2ShaderRenderer";

class WGL2DrawEngine extends DrawEngine
{
    public constructor(Old?:WGL2DrawEngine)
    {
        super(Old);
        this._Renderer = new WGL2ShaderRenderer(null, this._Target);
        this.Resize();
    }
    public Copy() : WGL2DrawEngine
    {
        return new WGL2DrawEngine(this);
    }
    public Resize() : void
    {
        // Override
        let Width:number = this._Parent.clientWidth;
        let Height:number = this._Parent.clientHeight;
        this._Target.style.width = Width + "px";
        this._Target.style.height = Height + "px";
        this._Renderer.SetSize( Width, Height );
        this._GlobalScale = new Math.Vertex(Width / this.Resolution.X, Height / this.Resolution.Y, 1);
    }
    public Draw2DScene(Scene:Engine.Scene2D, Size:Math.Vertex) : void
    {
        // Virtual
        if(Scene == null) return;
        this._Renderer.SetDepth(false);
        this._Renderer.SetSize(Size);
        this._Renderer.Clear(Scene.BackColor);
        this._Matrix.MatrixMode(Math.MatrixMode.Projection);
        this._Matrix.LoadIdentity();
        this._Matrix.Ortho2D(0, Size.X, Size.Y, 0);
        this._Renderer.SetProjectionMatrix(this._Matrix.ProjectionMatrix.Fields);
        this._Matrix.MatrixMode(Math.MatrixMode.ModelView);
        this._Matrix.LoadIdentity();
        this._Matrix.Translate(Scene.Trans.Translation.X, Scene.Trans.Translation.Y, Scene.Trans.Translation.Z);
        this._Renderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
        this._Matrix.PushMatrix();
        let Tiles:Engine.Tile[] = Scene.Tiles;
        for(let i = 0; i < Tiles.length; i++)
        {
            this.DrawTile(Scene, Tiles[i]);
        }
        let Sprites:Engine.Sprite[] = Scene.Sprites;
        for(let i = 0; i < Sprites.length; i++)
        {
            this.DrawSprite(Scene, Sprites[i]);
        }
    }
    protected DrawSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {
        // Override
        if(Drawn.Active)
        {
            this._Matrix.Translate(Drawn.Trans.Translation.X, Drawn.Trans.Translation.Y, Drawn.Trans.Translation.Z);
            this._Matrix.Scale(Drawn.Trans.Scale.X, Drawn.Trans.Scale.Y, Drawn.Trans.Scale.Z);
            this._Matrix.Rotate(Drawn.Trans.Rotation.X, 1, 0, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Y, 0, 1, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Z, 0, 0, 1);
            this._Renderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
            this._Renderer.RenderImage(Drawn.ID, Drawn.CollectiveList(), (Drawn.CollectiveList().length > 0) ? Drawn.Index() : -1, Drawn.Modified);
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
        // Override
    }
    protected DrawTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        if(Drawn.Active)
        {
            this._Matrix.Translate(Drawn.Trans.Translation.X, Drawn.Trans.Translation.Y, Drawn.Trans.Translation.Z);
            this._Matrix.Scale(Drawn.Trans.Scale.X, Drawn.Trans.Scale.Y, Drawn.Trans.Scale.Z);
            this._Matrix.Rotate(Drawn.Trans.Rotation.X, 1, 0, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Y, 0, 1, 0);
            this._Matrix.Rotate(Drawn.Trans.Rotation.Z, 0, 0, 1);
            this._Renderer.SetModelViewMatrix(this._Matrix.ModelViewMatrix.Fields);
            this._Renderer.RenderImage(Drawn.ID, Drawn.Collection.Images, (Drawn.Collection.Images.length > 0) ? Drawn.Index : -1, Drawn.Modified);
            Drawn.Modified = false;
            this._Matrix.PopMatrix();
        }
    }
    protected LoadTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {
        // Override
    }
}