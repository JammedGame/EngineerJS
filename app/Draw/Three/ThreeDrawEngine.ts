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
    private _Checked:string[];
    private _Scene:Three.Scene;
    private _ToyBoxScene:Engine.Scene2D;
    private _Camera:Three.Camera;
    private _Generator:ThreeMaterialGenerator;
    public constructor(Old?:ThreeDrawEngine, Resolution?:Mathematics.Vertex)
    {
        super(Old);
        this._Loaded = false;
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
    public UpdateResolution(Resolution:Mathematics.Vertex, FixedSize?:boolean)
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
        }
        if(!this._Loaded)
        {
            this.Resize();
            this._Loaded = true;
        }
        this._ToyBoxScene.Events.Resize.push(this.Resize.bind(this));
        this._Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        ThreeGridManager.CheckGrid(this._Scene, this._ToyBoxScene, this.Data, this._GlobalScale);
        for(let i = 0; i < Scene.Objects.length; i++)
        {
            if(Scene.Objects[i].Type != Engine.SceneObjectType.Drawn) continue;
            let Drawn:Engine.DrawObject = <Engine.DrawObject>Scene.Objects[i];
            if(Drawn.DrawType == Engine.DrawObjectType.Sprite)
            {
                this.LoadSprite(Scene, <Engine.Sprite>Drawn);
            }
            else if(Drawn.DrawType == Engine.DrawObjectType.Tile)
            {
                this.LoadTile(Scene, <Engine.Tile>Drawn);
            }
            else if(Drawn.DrawType == Engine.DrawObjectType.Light)
            {
                this.LoadLight(Scene, <Engine.Light>Drawn);
            }
        }
        this._Generator.Update2DLights();
        for(let i = 0; i < this._Scene.children.length; i++)
        {
            let Found = false;
            let Sprite:any = this._Scene.children[i];
            for(let i = 0; i < this._Checked.length; i++)
            {
                if(this._Checked[i] == Sprite.uuid) Found = true;
            }
            if(this.Data["TOYBOX_GRID"] != null)
            {
                for(let i = 0; i < this.Data["TOYBOX_GRID_LINES"].length; i++)
                {
                    if(this.Data["TOYBOX_GRID_LINES"][i].uuid == Sprite.uuid) Found = true;
                }
            }
            if(!Found)
            {
                this._Scene.remove(Sprite);
                //Util.Log.Info("ThreeJS Object " + Sprite.uuid + " removed from scene.");
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
    protected LoadSprite(Scene:Engine.Scene2D, Drawn:Engine.Sprite) : void
    {  
        // Override
        if(!Drawn.Fixed)
        {
            if(Drawn.Trans.Translation.X + Scene.Trans.Translation.X + Drawn.Trans.Scale.X / 2 < 0 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y + Drawn.Trans.Scale.Y / 2 < 0 ||
                Drawn.Trans.Translation.X + Scene.Trans.Translation.X - Drawn.Trans.Scale.X / 2 > 1920 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y - Drawn.Trans.Scale.Y / 2 > 1920)
            {
                if(this.Data["TOYBOX_" + Drawn.ID])
                {
                    this._Scene.remove(this.Data["TOYBOX_" + Drawn.ID]);
                    this.Data["TOYBOX_" + Drawn.ID].geometry.dispose();
                    this.Data["TOYBOX_" + Drawn.ID].material.dispose();
                    this.Data["TOYBOX_" + Drawn.ID] = null;
                }
                return;
            }
        }
        if(this.Data["TOYBOX_" + Drawn.ID] == null)
        {
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentSet"] = Drawn.CurrentSpriteSet;
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] = Drawn.Index;
            let SpriteMaterial = this._Generator.LoadObjectMaterial(Drawn);
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Sprite;
            this.DrawObjectValueCheck(Sprite, Drawn);
            this._Scene.add(Sprite);
            this._Checked.push(Sprite.uuid);
        }
        else
        {
            let Sprite:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            if(Drawn.Modified)
            {
                Sprite.material = this._Generator.LoadObjectMaterial(Drawn);
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
            this._Checked.push(Sprite.uuid);
        }
    }
    protected LoadTile(Scene:Engine.Scene2D, Drawn:Engine.Tile) : void
    {  
        // Override
        if(!Drawn.Fixed)
        {
            if(Drawn.Trans.Translation.X + Scene.Trans.Translation.X + Drawn.Trans.Scale.X / 2 < 0 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y + Drawn.Trans.Scale.Y / 2 < 0 ||
                Drawn.Trans.Translation.X + Scene.Trans.Translation.X - Drawn.Trans.Scale.X / 2 > 1920 ||
                Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y - Drawn.Trans.Scale.Y / 2 > 1920)
            {
                if(this.Data["TOYBOX_" + Drawn.ID])
                {
                    this._Scene.remove(this.Data["TOYBOX_" + Drawn.ID]);
                    this.Data["TOYBOX_" + Drawn.ID].geometry.dispose();
                    this.Data["TOYBOX_" + Drawn.ID].material.dispose();
                    this.Data["TOYBOX_" + Drawn.ID] = null;
                }
                return;
            }
        }
        if(this.Data["TOYBOX_" + Drawn.ID] == null || Drawn.Modified)
        {
            Drawn.Modified = false;
            let TileMaterial = this._Generator.LoadObjectMaterial(Drawn);
            let Tile:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), TileMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Tile;
            this.DrawObjectValueCheck(Tile, Drawn);
            this._Scene.add(Tile);
            //Util.Log.Info("ThreeJS Object " + Tile.uuid + " added to scene.");
            this._Checked.push(Tile.uuid);
        }
        else
        {
            let Tile:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            this.DrawObjectValueCheck(Tile, Drawn);
            this._Checked.push(Tile.uuid);
        }
    }
    protected LoadLight(Scene:Engine.Scene2D, Drawn:Engine.Light) : void
    {
        let TransLoc = new Mathematics.Vertex(Drawn.Trans.Translation.X + Scene.Trans.Translation.X, Drawn.Trans.Translation.Y + Scene.Trans.Translation.Y, Drawn.Trans.Translation.Z + Scene.Trans.Translation.Z);
        this.Data["TOYBOX_"+Drawn.ID+"_Light"] = this._Generator.PrepLightLoc(TransLoc, this.Resolution);
    }
}