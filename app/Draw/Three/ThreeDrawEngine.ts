export  { ThreeDrawEngine };

import * as Three from 'Three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";
import * as Shaders from "./../WebGL2/Shaders";

import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Init:boolean;
    private _Checked:string[];
    private _Target:HTMLCanvasElement;
    private _Scene:Three.Scene;
    private _Camera:Three.Camera;
    private _Renderer:Three.WebGLRenderer;
    public constructor(Old?:ThreeDrawEngine)
    {
        super(Old);
        this._Scene = new Three.Scene();
        this._Init = false;
        this._Target = document.getElementById("canvas") as HTMLCanvasElement;
        this._Renderer = new Three.WebGLRenderer({canvas:this._Target});
        this._Renderer.setPixelRatio( window.devicePixelRatio );
        this._Renderer.setSize( window.innerWidth, window.innerHeight );
    }
    public Load2DScene(Scene:Engine.Scene2D) : void
    {
        this._Checked = [];
        this._Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        for(let i = 0; i < Scene.Objects.length; i++)
        {
            if(Scene.Objects[i].Type != Engine.SceneObjectType.Drawn) continue;
            let Drawn:Engine.DrawObject = <Engine.DrawObject>Scene.Objects[i];
            if(Drawn.DrawType == Engine.DrawObjectType.Sprite)
            {
                let SpriteData = <Engine.Sprite>Drawn;
                this.LoadSprite(Scene, SpriteData);
            }
        }
        for(let i = 0; i < this._Scene.children.length; i++)
        {
            let Found = false;
            let Sprite:any = this._Scene.children[i];
            for(let i = 0; i < this._Checked.length; i++)
            {
                if(this._Checked[i] == Sprite.uuid) Found = true;
            }
            if(!Found)
            {
                this._Scene.remove(Sprite);
                Util.Log.Info("ThreeJS Object " + Sprite.uuid + " removed from scene.");
            }
        }
    }
    public Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        if(this.Data["Width"] == null || this.Data["Width"] != Width || this.Data["Height"] != Height)
        {
            this.Data["Width"] = Width;
            this.Data["Height"] = Height;
            this._Renderer.setSize(Width, Height);
            Util.Log.Event("Scene2D Resize");
        }
        if(this._Camera == null)
        {
            this._Camera = new Three.OrthographicCamera( 0, Width, 0, Height, 1, 10 );
            this._Camera.position.z = 5;
        }
        this.Load2DScene(Scene);
        if(!this._Init)
        {
            this.Animate();
            this._Init = true;
            Util.Log.Info("ThreeJS Scene "+ this._Scene.uuid + " initialized.");
        }
        Util.Log.Info("Scene2D " + Scene.ID + " drawn.");
    }
    private Animate() : void
    {
        requestAnimationFrame( this.Animate.bind(this) );
        this._Renderer.render( this._Scene, this._Camera );
    }
    private DrawThree() : void
    {
        this._Renderer.clear();
        this._Renderer.clearDepth();
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
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {  
        let SpriteData = <Engine.Sprite>Drawn;
        if(this.Data[Drawn.ID] == null)
        {
            this.Data[Drawn.ID + "_Set"] = SpriteData.GetActiveSprites();
            let SpriteMaterial;
            if(SpriteData.GetActiveSprites().length > 0)
            {
                let TextureLoader = new Three.TextureLoader();
                let Textures : Three.Texture[] = [];
                let TextureUrls : string[] = SpriteData.GetActiveSprites();
                for(let j = 0; j < TextureUrls.length; j++)
                {
                    let NewTexture = TextureLoader.load(TextureUrls[j]);
                    NewTexture.flipY = false;
                    Textures.push(NewTexture);
                }
                SpriteMaterial = new Three.SpriteMaterial( { map: Textures[0], color: 0xffffff } );
            }
            else
            {
                SpriteMaterial  = new Three.SpriteMaterial( { color: 0xffffff } );
            }
            let Sprite:Three.Sprite = new Three.Sprite( SpriteMaterial );
            this.Data[Drawn.ID] = Sprite;
            Sprite.visible = SpriteData.Active;
            Sprite.position.set(SpriteData.Trans.Translation.X, SpriteData.Trans.Translation.Y, 0);
            Sprite.scale.set(SpriteData.Trans.Scale.X, SpriteData.Trans.Scale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Scene.add(Sprite);
            Util.Log.Info("ThreeJS Object " + Sprite.uuid + " added to scene.");
            this._Checked.push(Sprite.uuid);
        }
        else
        {
            let Sprite:Three.Sprite = this.Data[Drawn.ID];
            if(this.Data[Drawn.ID + "_Set"].length != SpriteData.GetActiveSprites().length)
            {
                if(SpriteData.GetActiveSprites().length > 0)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    let TextureUrls : string[] = SpriteData.GetActiveSprites();
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                    Sprite.material = new Three.SpriteMaterial( { map: Textures[0], color: 0xffffff } );
                }
                else
                {
                    Sprite.material  = new Three.SpriteMaterial( { color: 0xffffff } );
                }
            }
            Sprite.visible = SpriteData.Active;
            Sprite.position.set(SpriteData.Trans.Translation.X, SpriteData.Trans.Translation.Y, 0);
            Sprite.scale.set(SpriteData.Trans.Scale.X, SpriteData.Trans.Scale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Checked.push(Sprite.uuid);
        }
    }
}