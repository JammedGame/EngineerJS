export  { ThreeDrawEngine };

import * as Three from 'three';
import * as Mathematics from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import { ThreeMaterialGenerator } from "./ThreeMaterialGenerator";
import { ThreeGridManager } from "./ThreeGridManager";
import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Loaded:boolean;
    private _Preload:boolean;
    private _Checked:string[];
    private _Camera:Three.Camera;
    private _Scene:Three.Scene;
    private _PreloadScene:Three.Scene;
    private _ToyBoxScene:Engine.Scene2D;
    private _ToyBoxPreloadScene:Engine.Scene2D;
    private _Generator:ThreeMaterialGenerator;
    public constructor(Old?:ThreeDrawEngine, Resolution?:Mathematics.Vertex)
    {
        super(Old);
        this._Preload = false;
        this._Scene = new Three.Scene();
        this._GlobalScale = new Mathematics.Vertex(1,1,1);
        this._GlobalOffset = new Mathematics.Vertex(0,0,0);
        if(Resolution) this._Resolution = Resolution;
        else this._Resolution = new Mathematics.Vertex(1920, 1080, 1);
        this._Target = document.getElementById("canvas");
        this._Parent = document.getElementById("canvas-parent");
        this.Renderer = new Three.WebGLRenderer({canvas:this._Target});
        this.Renderer.setPixelRatio( window.devicePixelRatio );
        this.Resize();
    }
    public Resize()
    {
        let Width:number = this._Parent.clientWidth;
        let Height:number = this._Parent.clientHeight;
        if(!this._FixedSize)
        {
            this.Renderer.setSize( Width, Height );
            this._GlobalScale = new Mathematics.Vertex(this.Resolution.X / Width, this.Resolution.Y / Height, 1);
            this._Camera = new Three.OrthographicCamera( 0, this.Resolution.X * this._GlobalScale.X, 0, this.Resolution.Y * this._GlobalScale.Y, 1, 100 );
            this._Camera.position.z = 5;
        }
        else
        {
            this.Renderer.setSize( this.Resolution.X, this.Resolution.Y );
            this._GlobalScale = new Mathematics.Vertex(1, 1, 1);
            this._Camera = new Three.OrthographicCamera( 0, this.Resolution.X, 0, this.Resolution.Y, 1, 100 );
            this._Camera.position.z = 5;
        }
        if(this._ToyBoxScene) this._ToyBoxScene.OnResize({GlobalScale:this._GlobalScale, Scale:this._ToyBoxScene.Trans.Scale});
    }
    public UpdateResolution(Resolution?:Mathematics.Vertex, FixedSize?:boolean)
    {
        // Override
        super.UpdateResolution(Resolution, FixedSize);
        this.Resize();
    }
    public Load2DScene(Scene:Engine.Scene2D) : void
    {
        // Override
        this._Checked = [];
        this._Generator = new ThreeMaterialGenerator(null, this.Data, Scene);
        if(this._ToyBoxScene != Scene)
        {
            if(this._ToyBoxScene)
            {
                this._ToyBoxScene.Events.Resize.splice(this._ToyBoxScene.Events.Resize.indexOf(this.Resize), 1);
            }
            this._ToyBoxScene = Scene;
            this._ToyBoxScene.Events.Resize.push(this.Resize.bind(this));
            if(this._Preload && this._ToyBoxPreloadScene == Scene)
            {
                this._Scene = this._PreloadScene;
                this._Preload = false;
            }
            else
            {
                this._Scene = new Three.Scene();
            }
            this.Resize();
        }
        let LoadData:any = { Scene:this._Scene, Checked:this._Checked, Generator:this._Generator };
        this.Load2DSceneData(Scene, LoadData);
    }
    public Preload2DScene(Scene:Engine.Scene2D, ReportProgress:Function) : void
    {
        this._Preload = true;
        this._PreloadScene = new Three.Scene();
        this._ToyBoxPreloadScene = Scene;
        let LoadData:any =
        {
            Preload: true,
            Scene:this._PreloadScene,
            Checked:[],
            Report:ReportProgress,
            Generator:new ThreeMaterialGenerator(null, this.Data, Scene)
        };
        this.Load2DSceneData(Scene, LoadData);
    }
    public Load2DSceneData(Scene:Engine.Scene2D, LoadData:any) : void
    {
        LoadData.Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        ThreeGridManager.CheckGrid(LoadData.Scene, this._ToyBoxScene, this.Data, this._GlobalScale);
        for(let i = 0; i < Scene.Objects.length; i++)
        {
            if(LoadData.Report)
            {
                LoadData.Report(Math.ceil(i * 100.0 / Scene.Objects.length));
            }
            if(Scene.Objects[i].Type != Engine.SceneObjectType.Drawn) continue;
            let Drawn:Engine.DrawObject = <Engine.DrawObject>Scene.Objects[i];
            if(Drawn.DrawType == Engine.DrawObjectType.Sprite || Drawn.DrawType == Engine.DrawObjectType.Tile)
            {
                this.LoadImage(Scene, <Engine.ImageObject>Drawn, LoadData);
            }
            else if(Drawn.DrawType == Engine.DrawObjectType.Light)
            {
                this.LoadLight(Scene, <Engine.Light>Drawn, LoadData);
            }
        }
        this._Generator.Update2DLights();
        for(let i = 0; i < LoadData.Scene.children.length; i++)
        {
            let Found = false;
            let Drawn:any = LoadData.Scene.children[i];
            for(let i = 0; i < LoadData.Checked.length; i++)
            {
                if(LoadData.Checked[i] == Drawn.uuid) Found = true;
            }
            if(this.Data["TOYBOX_GRID"] != null)
            {
                for(let i = 0; i < this.Data["TOYBOX_GRID_LINES"].length; i++)
                {
                    if(this.Data["TOYBOX_GRID_LINES"][i].uuid == Drawn.uuid) Found = true;
                }
            }
            if(!Found)
            {
                LoadData.Scene.remove(Drawn);
            }
        }
    }
    public Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    {
        // Override
        if(this.Data["TOYBOX_Width"] == null || this.Data["TOYBOX_Width"] != Width || this.Data["TOYBOX_Height"] != Height)
        {
            this.Data["TOYBOX_Width"] = Width;
            this.Data["TOYBOX_Height"] = Height;
        }
        this.Load2DScene(Scene);
        this.Renderer.render( this._Scene, this._Camera );
    }
    private DrawThree() : void
    {
        this.Renderer.clear();
        this.Renderer.render(this._Scene, this._Camera);
    }
    public Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    {
        // Override
        if(this._Camera == null)
        {
            this._Camera = new Three.PerspectiveCamera( 45, Width / Height, 1, 10000 );
	        this._Camera.position.z = 1000;
        }
    }
    private DrawObjectTranslationTransform(Drawn:Engine.DrawObject) : Three.Vector3
    {
        let Translate:Three.Vector3 = new Three.Vector3();
        if(!Drawn.Fixed) Translate.set((this._ToyBoxScene.Trans.Translation.X + Drawn.Trans.Translation.X) * this._GlobalScale.X, (this._ToyBoxScene.Trans.Translation.Y + Drawn.Trans.Translation.Y) * this._GlobalScale.Y, Drawn.Trans.Translation.Z);
        else Translate.set(Drawn.Trans.Translation.X * this._GlobalScale.X, Drawn.Trans.Translation.Y * this._GlobalScale.Y, Drawn.Trans.Translation.Z);
        return Translate;
    }
    private DrawObjectValueCheck(ThreeObject:Three.Mesh, Drawn:Engine.DrawObject)
    {
        ThreeObject.visible = Drawn.Active;
        ThreeObject.position.copy(this.DrawObjectTranslationTransform(Drawn));
        ThreeObject.scale.set(Drawn.Trans.Scale.X * this._GlobalScale.X, Drawn.Trans.Scale.Y * this._GlobalScale.Y, 1);
        ThreeObject.rotation.set((Drawn.Trans.Rotation.X / 180) * 3.14, (Drawn.Trans.Rotation.Y / 180) * 3.14, (Drawn.Trans.Rotation.Z / 180) * 3.14);
    }
    protected LoadImage(Scene:Engine.Scene2D, Drawn:Engine.ImageObject, LoadData:any) : void
    {
        // Override
        if(!Drawn.Fixed && !LoadData.Preload)
        {
            if(Drawn.Trans.Translation.X + Scene.Trans.Translation.X + Drawn.Trans.Scale.X / 2 < 0 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y + Drawn.Trans.Scale.Y / 2 < 0 ||
                Drawn.Trans.Translation.X + Scene.Trans.Translation.X - Drawn.Trans.Scale.X / 2 > 1920 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y - Drawn.Trans.Scale.Y / 2 > 1920)
            {
                if(this.Data["TOYBOX_" + Drawn.ID] && LoadData.Scene.children.indexOf(this.Data["TOYBOX_" + Drawn.ID]) != -1)
                {
                    LoadData.Scene.remove(this.Data["TOYBOX_" + Drawn.ID]);
                    //this.Data["TOYBOX_" + Drawn.ID].geometry.dispose();
                    //this.Data["TOYBOX_" + Drawn.ID].material.dispose();
                    //this.Data["TOYBOX_" + Drawn.ID] = null;
                }
                return;
            }
        }
        if(Drawn.DrawType == Engine.DrawObjectType.Sprite)
        {
            this.LoadSprite(Scene, <Engine.Sprite>Drawn, LoadData);
        }
        else if(Drawn.DrawType == Engine.DrawObjectType.Tile)
        {
            this.LoadTile(Scene, <Engine.Tile>Drawn, LoadData);
        }
    }
    protected LoadSprite(Scene:Engine.Scene2D, Drawn:Engine.Sprite, LoadData:any) : void
    {  
        // Override
        if(this.Data["TOYBOX_" + Drawn.ID] == null)
        {
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentSet"] = Drawn.CurrentSpriteSet;
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] = Drawn.Index;
            let SpriteMaterial = LoadData.Generator.LoadObjectMaterial(Drawn);
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Sprite;
            this.DrawObjectValueCheck(Sprite, Drawn);
            LoadData.Scene.add(Sprite);
            LoadData.Checked.push(Sprite.uuid);
        }
        else
        {
            let Sprite:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            if(LoadData.Scene.children.indexOf(Sprite) == -1) LoadData.Scene.add(Sprite);
            if(Drawn.Modified)
            {
                Sprite.material = LoadData.Generator.LoadObjectMaterial(Drawn);
                Drawn.Modified = false;
            }
            if(this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] != Drawn.Index)
            {
                this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] = Drawn.Index;
                let Textures : Three.Texture[] = this.Data["TOYBOX_" + Drawn.Collection.ID + "_Tex"];
                Sprite.material["uniforms"].texture.value = Textures[Drawn.Index];
                if(Drawn.Material.Type == Engine.MaterialType.Phong || Drawn.Material.Type == Engine.MaterialType.Custom || Drawn.Material.Type == Engine.MaterialType.Shader)
                {
                    let Normals : Three.Texture[] = this.Data["TOYBOX_" + Drawn.NormalCollection.ID + "_Normal"];
                    Sprite.material["uniforms"].normalMap.value = Normals[Drawn.Index];
                }
                Sprite.material["uniforms"].color.value = Drawn.Paint.ToArray();
            }
            this.DrawObjectValueCheck(Sprite, Drawn);
            LoadData.Checked.push(Sprite.uuid);
        }
    }
    protected LoadTile(Scene:Engine.Scene2D, Drawn:Engine.Tile, LoadData:any) : void
    {  
        // Override
        if(this.Data["TOYBOX_" + Drawn.ID] == null || Drawn.Modified)
        {
            Drawn.Modified = false;
            let TileMaterial = LoadData.Generator.LoadObjectMaterial(Drawn);
            let Tile:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), TileMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Tile;
            this.DrawObjectValueCheck(Tile, Drawn);
            LoadData.Scene.add(Tile);
            LoadData.Checked.push(Tile.uuid);
        }
        else
        {
            let Tile:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            if(LoadData.Scene.children.indexOf(Tile) == -1) LoadData.Scene.add(Tile);
            this.DrawObjectValueCheck(Tile, Drawn);
            LoadData.Checked.push(Tile.uuid);
        }
    }
    protected LoadLight(Scene:Engine.Scene2D, Drawn:Engine.Light, LoadData:any) : void
    {
        let TransLoc = new Mathematics.Vertex(Drawn.Trans.Translation.X + Scene.Trans.Translation.X, Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y, Drawn.Trans.Translation.Z + Scene.Trans.Translation.Z);
        this.Data["TOYBOX_"+Drawn.ID+"_Light"] = LoadData.Generator.PrepLightLoc(TransLoc, this.Resolution);
    }
}