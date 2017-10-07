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
    private _Parent:HTMLCanvasElement;
    private _Scene:Three.Scene;
    private _EngineerScene:Engine.Scene2D;
    private _Camera:Three.Camera;
    public constructor(Old?:ThreeDrawEngine, Resolution?:Math.Vertex)
    {
        super(Old);
        this._Scene = new Three.Scene();
        this._GlobalScale = new Math.Vertex(1,1,1);
        this._GlobalOffset = new Math.Vertex(0,0,0);
        if(Resolution) this._Resolution = Resolution;
        else this._Resolution = new Math.Vertex(1920, 1080, 1);
        this._Target = document.getElementById("canvas") as HTMLCanvasElement;
        this._Parent = document.getElementById("canvas-parent") as HTMLCanvasElement;
        this.Renderer = new Three.WebGLRenderer({canvas:this._Target});
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Resize();
    }
    public Resize()
    {
        let Width:number = this._Parent.clientWidth;
        let Height:number = this._Parent.clientHeight;
        this.Renderer.setSize( Width, Height );
        this._GlobalScale = new Math.Vertex(Width / this.Resolution.X, Height / this.Resolution.Y, 1);
    }
    public Load2DScene(Scene:Engine.Scene2D) : void
    {
        this._Checked = [];
        if(this._EngineerScene)
        {
            this._EngineerScene.Events.Resize.splice(this._EngineerScene.Events.Resize.indexOf(this.Resize), 1);
        }
        this._EngineerScene = Scene;
        this._EngineerScene.Events.Resize.push(this.Resize.bind(this));
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
            else if(Drawn.DrawType == Engine.DrawObjectType.Tile)
            {
                let TileData = <Engine.Tile>Drawn;
                this.LoadTile(Scene, TileData);
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
                    color: { type:"v4", value:Sprite.Paint.ToArray() },
                    texture: { type:"tv", value: Texture }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
                fragmentShader: Shaders.ThreeJSShaders.Fragment2D,
            }
        );
        SpriteMaterial.transparent = true;
        return SpriteMaterial;
    }
    private GenerateTileMaterial(Tile:Engine.Tile, Texture:Three.Texture) : Three.ShaderMaterial
    {
        let TileMaterial = new Three.ShaderMaterial
        (
            {
                uniforms:
                {
                    index: { type:"i", value:Tile.Index },
                    color: { type:"v4", value:Tile.Paint.ToArray() },
                    texture: { type:"tv", value: Texture }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
                fragmentShader: Shaders.ThreeJSShaders.Fragment2D,
            }
        );
        TileMaterial.transparent = true;
        return TileMaterial;
    }
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    {  
        let SpriteData = <Engine.Sprite>Drawn;
        if(this.Data[Drawn.ID] == null)
        {
            this.Data[Drawn.ID + "_CurrentSet"] = SpriteData.CurrentSpriteSet;
            this.Data[Drawn.ID + "_CurrentIndex"] = SpriteData.CurrentIndex;
            let SpriteMaterial;
            if(Drawn.SpriteSets.length > 0)
            {
                for(let i = 0; i < Drawn.SpriteSets.length; i++)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    this.Data[Drawn.ID + "_Tex_" + i] = Textures;
                    let TextureUrls : string[] = SpriteData.GetSprites(i);
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                let Textures : Three.Texture[] = this.Data[Drawn.ID + "_Tex_" + Drawn.CurrentSpriteSet];
                SpriteMaterial = this.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.CurrentIndex]);
            }
            else SpriteMaterial = this.GenerateSpriteMaterial(SpriteData, null);
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
            this.Data[Drawn.ID] = Sprite;
            Sprite.visible = SpriteData.Active;
            if(!Drawn.Fixed) Sprite.position.set((this._EngineerScene.Trans.Translation.X + SpriteData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + SpriteData.Trans.Translation.Y) * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            else Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Scene.add(Sprite);
            Util.Log.Info("ThreeJS Object " + Sprite.uuid + " added to scene.");
            this._Checked.push(Sprite.uuid);
        }
        else
        {
            let Sprite:Three.Mesh = this.Data[Drawn.ID];
            if(this.Data[Drawn.ID + "_CurrentSet"] != SpriteData.CurrentSpriteSet || this.Data[Drawn.ID + "_CurrentIndex"] != SpriteData.CurrentIndex)
            {
                this.Data[Drawn.ID + "_CurrentIndex"] = SpriteData.CurrentIndex;
                this.Data[Drawn.ID + "_CurrentSet"] = SpriteData.CurrentSpriteSet;
                let Textures : Three.Texture[] = this.Data[Drawn.ID + "_Tex_" + Drawn.CurrentSpriteSet];
                Sprite.material = this.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.CurrentIndex]);
            }
            Sprite.visible = SpriteData.Active;
            if(!Drawn.Fixed) Sprite.position.set((this._EngineerScene.Trans.Translation.X + SpriteData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + SpriteData.Trans.Translation.Y) * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            else Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Checked.push(Sprite.uuid);
        }
    }
    protected LoadTile(Scene:Engine.Scene2D, Drawn:Engine.Tile) : void
    {  
        if(Drawn.Trans.Translation.X + Scene.Trans.Translation.X + Drawn.Trans.Scale.X / 2 < 0)
        {
            if(this.Data[Drawn.ID])
            {
                this._Scene.remove(this.Data[Drawn.ID]);
                this.Data[Drawn.ID].geometry.dispose();
                this.Data[Drawn.ID].material.dispose();
                this.Data[Drawn.ID] = null;
            }
            return;
        }
        if(Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y + Drawn.Trans.Scale.Y / 2 < 0)
        {
            if(this.Data[Drawn.ID])
            {
                this._Scene.remove(this.Data[Drawn.ID]);
                this.Data[Drawn.ID].geometry.dispose();
                this.Data[Drawn.ID].material.dispose();
                this.Data[Drawn.ID] = null;
            }
            return;
        }
        if(Drawn.Trans.Translation.X + Scene.Trans.Translation.X - Drawn.Trans.Scale.X / 2 > 1920)
        {
            if(this.Data[Drawn.ID])
            {
                this._Scene.remove(this.Data[Drawn.ID]);
                this.Data[Drawn.ID].geometry.dispose();
                this.Data[Drawn.ID].material.dispose();
                this.Data[Drawn.ID] = null;
            }
            return;
        }
        if(Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y - Drawn.Trans.Scale.Y / 2 > 1920)
        {
            if(this.Data[Drawn.ID])
            {
                this._Scene.remove(this.Data[Drawn.ID]);
                this.Data[Drawn.ID].geometry.dispose();
                this.Data[Drawn.ID].material.dispose();
                this.Data[Drawn.ID] = null;
            }
            return;
        }
        let TileData = <Engine.Tile>Drawn;
        if(this.Data[Drawn.ID] == null)
        {
            let TileMaterial;
            if(this.Data[TileData.Collection.ID + "_Tex"] == null)
            {
                if(TileData.Collection.Images.length > 0)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    let TextureUrls : string[] = TileData.Collection.Images;
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                    this.Data[TileData.Collection.ID + "_Tex"] = Textures;
                    TileMaterial = this.GenerateTileMaterial(TileData, Textures[TileData.Index]);
                }
                else TileMaterial = this.GenerateTileMaterial(TileData, null);
            }
            else
            {
                let Textures : Three.Texture[] = <Three.Texture[]>this.Data[TileData.Collection.ID + "_Tex"];
                TileMaterial = this.GenerateTileMaterial(TileData, Textures[TileData.Index]);
            }
            let Tile:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), TileMaterial );
            this.Data[Drawn.ID] = Tile;
            Tile.visible = TileData.Active;
            if(!Drawn.Fixed) Tile.position.set((this._EngineerScene.Trans.Translation.X + TileData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + TileData.Trans.Translation.Y) * this._GlobalScale.Y, 0);
            else Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, TileData.Trans.Translation.Z);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set(TileData.Trans.Rotation.X, TileData.Trans.Rotation.Y, TileData.Trans.Rotation.Z);
            this._Scene.add(Tile);
            Util.Log.Info("ThreeJS Object " + Tile.uuid + " added to scene.");
            this._Checked.push(Tile.uuid);
        }
        else
        {
            let Tile:Three.Mesh = this.Data[Drawn.ID];
            Tile.visible = TileData.Active;
            if(!Drawn.Fixed) Tile.position.set((this._EngineerScene.Trans.Translation.X + TileData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + TileData.Trans.Translation.Y) * this._GlobalScale.Y, 0);
            else Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, TileData.Trans.Translation.Z);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set(TileData.Trans.Rotation.X, TileData.Trans.Rotation.Y, TileData.Trans.Rotation.Z);
            this._Checked.push(Tile.uuid);
        }
    }
}