export  { ThreeDrawEngine };

import * as Three from 'Three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";
import * as Shaders from "./Shaders";

import { MaterialGenerator } from "./MaterialGenerator";
import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Checked:string[];
    private _Target:HTMLCanvasElement;
    private _Parent:HTMLCanvasElement;
    private _Scene:Three.Scene;
    private _EngineerScene:Engine.Scene;
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
    public LoadScene(Scene:Engine.Scene) : void
    {
        this._Checked = [];
        this.LoadResizeEvent(Scene);
        this._Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        if(Scene.Type == Engine.SceneType.Scene2D) this.Load2DScene(<Engine.Scene2D>Scene);
        else if(Scene.Type == Engine.SceneType.Scene3D) this.Load3DScene(<Engine.Scene3D>Scene);
        for(let i = 0; i < this._Scene.children.length; i++)
        {
            let Found = false;
            let Object:any = this._Scene.children[i];
            for(let i = 0; i < this._Checked.length; i++)
            {
                if(this._Checked[i] == Object.uuid) Found = true;
            }
            if(!Found)
            {
                this._Scene.remove(Object);
                Util.Log.Info("ThreeJS Object " + Object.uuid + " removed from scene.");
            }
        }
    }
    private LoadResizeEvent(Scene:Engine.Scene) : void
    {
        if(this._EngineerScene == Scene) return;
        if(this._EngineerScene)
        {
            this._EngineerScene.Events.Resize.splice(this._EngineerScene.Events.Resize.indexOf(this.Resize), 1);
        }
        this._EngineerScene = Scene;
        this._EngineerScene.Events.Resize.push(this.Resize.bind(this));
    }
    protected Load2DScene(Scene:Engine.Scene2D) : void
    {
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
    }
    protected Load3DScene(Scene:Engine.Scene3D) : void
    {
        for(let i = 0; i < Scene.Objects.length; i++)
        {
            if(Scene.Objects[i].Type != Engine.SceneObjectType.Drawn) continue;
            let Drawn:Engine.DrawObject = <Engine.DrawObject>Scene.Objects[i];
            if(Drawn.DrawType == Engine.DrawObjectType.Actor)
            {
                let ActorData = <Engine.Actor>Drawn;
                this.LoadActor(Scene, ActorData);
            }
            else if(Drawn.DrawType == Engine.DrawObjectType.Camera)
            {
                let CameraData = <Engine.Camera>Drawn;
                this.LoadCamera(Scene, CameraData);
            }
            else if(Drawn.DrawType == Engine.DrawObjectType.Light)
            {
                let LightData = <Engine.Light>Drawn;
                this.LoadLight(Scene, LightData);
            }
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
                this.Data[Drawn.ID + "_Tex"] = Textures;
                let TextureUrls : string[] = SpriteData.GetActiveSprites();
                for(let j = 0; j < TextureUrls.length; j++)
                {
                    let NewTexture = TextureLoader.load(TextureUrls[j]);
                    NewTexture.flipY = false;
                    Textures.push(NewTexture);
                }
                SpriteMaterial = MaterialGenerator.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.Index()]);
            }
            else SpriteMaterial = MaterialGenerator.GenerateSpriteMaterial(SpriteData, null);
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
            this.Data[Drawn.ID] = Sprite;
            Sprite.visible = SpriteData.Active;
            Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
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
                Sprite.material = MaterialGenerator.GenerateSpriteMaterial(SpriteData, Textures[SpriteData.Index()]);
            }
            else Sprite.material = MaterialGenerator.GenerateSpriteMaterial(SpriteData, null);
            Sprite.visible = SpriteData.Active;
            Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Sprite.rotation.set(SpriteData.Trans.Rotation.X, SpriteData.Trans.Rotation.Y, SpriteData.Trans.Rotation.Z);
            this._Checked.push(Sprite.uuid);
        }
    }
    protected LoadTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    {  
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
                    TileMaterial = MaterialGenerator.GenerateTileMaterial(TileData, Textures[TileData.Index]);
                }
                else TileMaterial = MaterialGenerator.GenerateTileMaterial(TileData, null);
            }
            else
            {
                let Textures : Three.Texture[] = <Three.Texture[]>this.Data[TileData.Collection.ID + "_Tex"];
                TileMaterial = MaterialGenerator.GenerateTileMaterial(TileData, Textures[TileData.Index]);
            }
            let Tile:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), TileMaterial );
            this.Data[Drawn.ID] = Tile;
            Tile.visible = TileData.Active;
            Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set(TileData.Trans.Rotation.X, TileData.Trans.Rotation.Y, TileData.Trans.Rotation.Z);
            this._Scene.add(Tile);
            Util.Log.Info("ThreeJS Object " + Tile.uuid + " added to scene.");
            this._Checked.push(Tile.uuid);
        }
        else
        {
            let Tile:Three.Mesh = this.Data[Drawn.ID];
            if(this.Data[TileData.Collection.ID + "_Tex"])
            {
                let Textures : Three.Texture[] = <Three.Texture[]>this.Data[TileData.Collection.ID + "_Tex"];
                Tile.material = MaterialGenerator.GenerateTileMaterial(TileData, Textures[TileData.Index]);
            }
            else Tile.material = MaterialGenerator.GenerateTileMaterial(TileData, null);
            Tile.visible = TileData.Active;
            Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set(TileData.Trans.Rotation.X, TileData.Trans.Rotation.Y, TileData.Trans.Rotation.Z);
            this._Checked.push(Tile.uuid);
        }
    }
    protected LoadActor(Scene:Engine.Scene, Drawn:Engine.Actor) : void
    {  
        let ActorData = <Engine.Actor>Drawn;
        if(this.Data[Drawn.ID] == null)
        {
            let ActorMaterial = new Three.MeshBasicMaterial( { color: 0xe22636 } );//new Three.MeshPhongMaterial();
            let JSONLoader = new Three.JSONLoader();
            let Geometry = JSONLoader.parse(ActorData.ExternData).geometry;
            let Actor:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(100,100,100), ActorMaterial );
            this.Data[Drawn.ID] = Actor;
            Actor.visible = ActorData.Active;
            Actor.position.set(ActorData.Trans.Translation.X * this._GlobalScale.X, ActorData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Actor.scale.set(ActorData.Trans.Scale.X * this._GlobalScale.X, ActorData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Actor.rotation.set(ActorData.Trans.Rotation.X, ActorData.Trans.Rotation.Y, ActorData.Trans.Rotation.Z);
            this._Scene.add(Actor);
            Util.Log.Info("ThreeJS Object " + Actor.uuid + " added to scene.");
            this._Checked.push(Actor.uuid);
        }
        else
        {
            let Actor:Three.Mesh = this.Data[Drawn.ID];
            Actor.visible = ActorData.Active;
            Actor.position.set(ActorData.Trans.Translation.X * this._GlobalScale.X, ActorData.Trans.Translation.Y * this._GlobalScale.Y, 0);
            Actor.scale.set(ActorData.Trans.Scale.X * this._GlobalScale.X, ActorData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Actor.rotation.set(ActorData.Trans.Rotation.X, ActorData.Trans.Rotation.Y, ActorData.Trans.Rotation.Z);
            this._Checked.push(Actor.uuid);
        }
    }
    protected LoadCamera(Scene:Engine.Scene, Drawn:Engine.Camera) : void
    {  
        //TODO
    }
    protected LoadLight(Scene:Engine.Scene, Drawn:Engine.Light) : void
    {  
        //TODO
    }
    public DrawScene(Scene:Engine.Scene, Width:number, Height:number)
    {
        if(Scene.Type == Engine.SceneType.Scene2D) this.Draw2DScene(<Engine.Scene2D>Scene, Width, Height);
        else if(Scene.Type == Engine.SceneType.Scene3D) this.Draw3DScene(<Engine.Scene3D>Scene, Width, Height);
    }
    protected Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        if(this._Camera == null)
        {
            this._Camera = new Three.OrthographicCamera( 0, Width, 0, Height, 1, 10 );
            this._Camera.position.z = 5;
        }
        this.LoadScene(Scene);
        this.Renderer.render( this._Scene, this._Camera );
        Util.Log.Info("Scene2D " + Scene.ID + " drawn.");
    }
    protected Draw3DScene(Scene:Engine.Scene3D, Width:number, Height:number) : void
    {
        if(this._Camera == null)
        {
            this._Camera = new Three.PerspectiveCamera( 45, Width / Height, 1, 10000 );
	        this._Camera.position.z = 1000;
        }
        this.LoadScene(Scene);
        this.Renderer.render( this._Scene, this._Camera );
        Util.Log.Info("Scene3D " + Scene.ID + " drawn.");
    }
}