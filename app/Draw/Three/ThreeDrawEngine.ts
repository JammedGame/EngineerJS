export  { ThreeDrawEngine };

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";

import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Target:HTMLCanvasElement;
    private _Scene:Three.Scene;
    private _Camera:Three.Camera;
    private _Renderer:Three.WebGLRenderer;
    public constructor(Old?:ThreeDrawEngine)
    {
        super(Old);
        this._Scene = new Three.Scene();
        this._Target = document.getElementById("canvas") as HTMLCanvasElement;
        this._Renderer = new Three.WebGLRenderer({canvas:this._Target});
    }
    public Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        if(this.Data["Width"] == null || this.Data["Width"] != Width || this.Data["Height"] != Height)
        {
            this.Data["Width"] = Width;
            this.Data["Height"] = Height;
            this._Renderer.setSize(Width, Height);
            console.log("ENGINEERJS-RESIZE");
        }
        if(this._Camera == null)
        {
            this._Camera = new Three.OrthographicCamera( 0, Width, Height, 0, 1, 1000 );
        }
        let Checked:any[] = [];
        this._Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        for(let i = 0; i < Scene.Objects.length; i++)
        {
            if(Scene.Objects[i].Type != Engine.SceneObjectType.Drawn) continue;
            let Drawn:Engine.DrawnSceneObject = <Engine.DrawnSceneObject>Scene.Objects[i];
            let SpriteData = <Engine.Sprite>Drawn.Visual;
            if(this.Data[Drawn.ID] == null)
            {
                this.Data[Drawn.ID + "_Set"] = SpriteData.GetActiveSprites();
                let SpriteMaterial;
                if(SpriteData.GetActiveSprites() != "")
                {
                    let SpriteMap:any = new Three.TextureLoader().load(SpriteData.GetActiveSprites());
                    SpriteMaterial = new Three.SpriteMaterial( { map: SpriteMap, color: 0xffffff } );
                }
                else
                {
                    SpriteMaterial  = new Three.SpriteMaterial( { color: 0xffffff } );
                }
                let Sprite:Three.Sprite = new Three.Sprite( SpriteMaterial );
                this.Data[Drawn.ID] = Sprite;
                Sprite.visible = SpriteData.Active;
                Sprite.position.set(SpriteData.Trans.Translation.X, SpriteData.Trans.Translation.Y, 0);
                Sprite.scale.set(SpriteData.Trans.Scale.X, SpriteData.Trans.Scale.Y, 0);
                Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
                this._Scene.add(Sprite);
                Checked.push(Sprite);
            }
            else
            {
                let Sprite:Three.Sprite = this.Data[Drawn.ID];
                if(this.Data[Drawn.ID + "_Set"] != SpriteData.GetActiveSprites())
                {
                    this.Data[Drawn.ID + "_Set"] = SpriteData.GetActiveSprites();
                    if(SpriteData.GetActiveSprites() != "")
                    {
                        let SpriteMap:any = new Three.TextureLoader().load(SpriteData.GetActiveSprites());
                        Sprite.material = new Three.SpriteMaterial( { map: SpriteMap, color: 0xffffff } );
                    }
                    else
                    {
                        Sprite.material  = new Three.SpriteMaterial( { color: 0xffffff } );
                    }
                }
                Sprite.visible = SpriteData.Active;
                Sprite.position.set(SpriteData.Trans.Translation.X, SpriteData.Trans.Translation.Y, 0);
                Sprite.scale.set(SpriteData.Trans.Scale.X, SpriteData.Trans.Scale.Y, 0);
                Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
                Checked.push(Sprite);
            }
        }
        for(let i = 0; i < this._Scene.children.length; i++)
        {
            let Sprite:Three.Sprite = <Three.Sprite>this._Scene.children[i];
            //if(Checked.findIndex(<any>Sprite) == -1) this._Scene.remove(Sprite);
        }
        console.log(this._Scene);
        console.log(this._Camera);
        console.log(this._Target);
        this._Renderer.render(this._Scene, this._Camera);
    }
    public Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        if(this._Camera == null)
        {
            this._Camera = new Three.PerspectiveCamera( 45, Width / Height, 1, 10000 );
	        this._Camera.position.z = 1000;
        }
    }
}