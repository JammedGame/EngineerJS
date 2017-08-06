export  { ThreeDrawEngine };

import * as Three from 'Three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";
import * as Shaders from "./Shaders";

import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Checked:string[];
    private _Target:HTMLCanvasElement;
    private _Scene:Three.Scene;
    private _Camera:Three.Camera;
    public constructor(Old?:ThreeDrawEngine)
    {
        super(Old);
        this._Scene = new Three.Scene();
        this._Target = document.getElementById("canvas") as HTMLCanvasElement;
        this.Renderer = new Three.WebGLRenderer({canvas:this._Target});
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Renderer.setSize( window.innerWidth, window.innerHeight );
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
            this.Renderer.setSize(Width, Height);
        }
        if(this._Camera == null)
        {
            this._Camera = new Three.OrthographicCamera( 0, Width, 0, Height, 1, 10 );
            this._Camera.position.z = 5;
        }
        this.Load2DScene(Scene);
        this.Renderer.render( this._Scene, this._Camera );
        Util.Log.Info("Scene2D " + Scene.ID + " drawn.");
    }
    private DrawThree() : void
    {
        this.Renderer.clear();
        this.Renderer.render(this._Scene, this._Camera);
    }
    public Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        if(this._Camera == null)
        {
            this._Camera = new Three.PerspectiveCamera( 45, Width / Height, 1, 10000 );
	        this._Camera.position.z = 1000;
        }
    }
    private GenerateSpriteMaterial(Sprite:Engine.Sprite, Texture:Three.Texture) : Three.ShaderMaterial
    {
        let SpriteMaterial = new Three.ShaderMaterial
        (
            {
                uniforms:
                {
                    index: { type:"i", value:Sprite.Index() },
                    color: { type:"v4", value:[1,1,1,1] },
                    texture: { type:"tv", value: Texture }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
                fragmentShader: Shaders.ThreeJSShaders.Fragment2D,
            }
        );
        SpriteMaterial.transparent = true;
        return SpriteMaterial;
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
                this.Data[Drawn.ID + "_Tex"] = Textures;
                let TextureUrls : string[] = SpriteData.GetActiveSprites();
                for(let j = 0; j < TextureUrls.length; j++)
                {
                    let NewTexture = TextureLoader.load(TextureUrls[j]);
                    NewTexture.flipY = false;
                    Textures.push(NewTexture);
                }
                SpriteMaterial = this.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.Index()]);
            }
            else
            {
                SpriteMaterial = this.GenerateSpriteMaterial(SpriteData, null);
                SpriteMaterial.transparent = true;
            }
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
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
            let Sprite:Three.Mesh = this.Data[Drawn.ID];
            if(SpriteData.GetActiveSprites().length > 0)
            {
                if(this.Data[Drawn.ID + "_Set"].length != SpriteData.GetActiveSprites().length)
                {
                    this.Data[Drawn.ID + "_Set"] = SpriteData.GetActiveSprites();
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    this.Data[Drawn.ID + "_Tex"] = Textures;
                    let TextureUrls : string[] = SpriteData.GetActiveSprites();
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                let TextureLoader = new Three.TextureLoader();
                let Textures : Three.Texture[] = <Three.Texture[]> this.Data[SpriteData.ID + "_Tex"];
                Sprite.material = this.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.Index()]);
            }
            else
            {
                Sprite.material = this.GenerateSpriteMaterial(SpriteData, null);
            }
            Sprite.visible = SpriteData.Active;
            Sprite.position.set(SpriteData.Trans.Translation.X, SpriteData.Trans.Translation.Y, 0);
            Sprite.scale.set(SpriteData.Trans.Scale.X, SpriteData.Trans.Scale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Checked.push(Sprite.uuid);
        }
    }
}