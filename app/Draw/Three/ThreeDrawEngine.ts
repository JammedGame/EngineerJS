export  { ThreeDrawEngine };

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import { ThreeMaterialGenerator } from "./ThreeMaterialGenerator";
import { DrawEngine } from "./../DrawEngine";

class ThreeDrawEngine extends DrawEngine
{
    private _Checked:string[];
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
            this._GlobalScale = new Math.Vertex(this.Resolution.X / Width, this.Resolution.Y / Height, 1);
            this._Camera = new Three.OrthographicCamera( 0, this.Resolution.X * this._GlobalScale.X, 0, this.Resolution.Y * this._GlobalScale.Y, 1, 10 );
            this._Camera.position.z = 5;
        }
        else
        {
            this.Renderer.setSize( this.Resolution.X, this.Resolution.Y );
            this._GlobalScale = new Math.Vertex(1, 1, 1);
            this._Camera = new Three.OrthographicCamera( 0, this.Resolution.X, 0, this.Resolution.Y, 1, 10 );
            this._Camera.position.z = 5;
        }
    }
    public UpdateResolution(Resolution:Math.Vertex, FixedSize?:boolean)
    {
        // Override
        super.UpdateResolution(Resolution, FixedSize);
        this.Resize();
    }
    private CreateGrid(Snap:number)
    {
        if(!this.Data["TOYBOX_GRID_LINE_MAIN"])
        {
            this.Data["TOYBOX_GRID_LINE_MAIN"] = new Three.LineBasicMaterial({ color: 0x888888 });
            this.Data["TOYBOX_GRID_LINE_SIDE"] = new Three.LineBasicMaterial({ color: 0x333333 });
        }
        if(this.Data["TOYBOX_GRID_LINES"])
        {
            for(let i = 0; i < this.Data["TOYBOX_GRID_LINES"].lenght; i++)
            {
                this._Scene.remove(this.Data["TOYBOX_GRID_LINES"][i]);
            }
        }
        this.Data["TOYBOX_GRID_LINES"] = [];
        for(let i = -5; i <= 5; i++)
        {
            if(i == 0) continue;
            let HorizontalLineGeometry = new Three.Geometry();
            HorizontalLineGeometry.vertices.push(new Three.Vector3(-5 * Snap, i * Snap, -0.5));
            HorizontalLineGeometry.vertices.push(new Three.Vector3(5 * Snap, i * Snap, -0.5));
            let HorizontalLine = new Three.Line(HorizontalLineGeometry, this.Data["TOYBOX_GRID_LINE_SIDE"]);
            this._Scene.add(HorizontalLine);
            this.Data["TOYBOX_GRID_LINES"].push(HorizontalLine);
            let VerticalLineGeometry = new Three.Geometry();
            VerticalLineGeometry.vertices.push(new Three.Vector3(i * Snap, -5 * Snap, -0.5));
            VerticalLineGeometry.vertices.push(new Three.Vector3(i * Snap, 5 * Snap, -0.5));
            let VerticalLine = new Three.Line(VerticalLineGeometry, this.Data["TOYBOX_GRID_LINE_SIDE"]);
            this._Scene.add(VerticalLine);
            this.Data["TOYBOX_GRID_LINES"].push(VerticalLine);
        }
        let HorizontalLineGeometry = new Three.Geometry();
        HorizontalLineGeometry.vertices.push(new Three.Vector3(-5 * Snap, 0, -0.5));
        HorizontalLineGeometry.vertices.push(new Three.Vector3(5 * Snap, 0, -0.5));
        let HorizontalLine = new Three.Line(HorizontalLineGeometry, this.Data["TOYBOX_GRID_LINE_MAIN"]);
        this._Scene.add(HorizontalLine);
        this.Data["TOYBOX_GRID_LINES"].push(HorizontalLine);
        let VerticalLineGeometry = new Three.Geometry();
        VerticalLineGeometry.vertices.push(new Three.Vector3(0, -5 * Snap, -0.5));
        VerticalLineGeometry.vertices.push(new Three.Vector3(0, 5 * Snap, -0.5));
        let VerticalLine = new Three.Line(VerticalLineGeometry, this.Data["TOYBOX_GRID_LINE_MAIN"]);
        this._Scene.add(VerticalLine);
        this.Data["TOYBOX_GRID_LINES"].push(VerticalLine);
    }
    private UpdateGrid()
    {
        if(this.Data["TOYBOX_GRID_LINES"])
        {
            for(let i = 0; i < this.Data["TOYBOX_GRID_LINES"].length; i++)
            {
                this.Data["TOYBOX_GRID_LINES"][i].position.set(this._EngineerScene.Trans.Translation.X * this._GlobalScale.X, this._EngineerScene.Trans.Translation.Y * this._GlobalScale.Y, 0);
            }
        }
    }
    public Load2DScene(Scene:Engine.Scene2D) : void
    {
        // Override
        this._Checked = [];
        if(this._EngineerScene)
        {
            this._EngineerScene.Events.Resize.splice(this._EngineerScene.Events.Resize.indexOf(this.Resize), 1);
        }
        this._EngineerScene = Scene;
        this._EngineerScene.Events.Resize.push(this.Resize.bind(this));
        this._Scene.background = new Three.Color(Scene.BackColor.R, Scene.BackColor.G, Scene.BackColor.B);
        if(this._EngineerScene.Data["EDITOR_GRID"] == "Classic" && !this.Data["TOYBOX_GRID"])
        {
            this.CreateGrid(100);
            this.Data["TOYBOX_GRID"] = true;
        }
        if(this._EngineerScene.Data["EDITOR_GRID"] != null)
        {
            this.UpdateGrid();
        }
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
                Util.Log.Info("ThreeJS Object " + Sprite.uuid + " removed from scene.");
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
        Util.Log.Info("Scene2D " + Scene.ID + " drawn.");
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
    private LoadSpriteMaterial(Scene:Engine.Scene2D, Drawn:Engine.Sprite) : any
    {
        let SpriteData = <Engine.Sprite>Drawn;
        let SpriteMaterial;
        if(Drawn.SpriteSets.length > 0)
        {
            if(this.Data["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"] == null)
            {
                for(let i = 0; i < Drawn.SpriteSets.length; i++)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    this.Data["TOYBOX_" + Drawn.SpriteSets[i].ID + "_Tex"] = Textures;
                    let TextureUrls : string[] = SpriteData.GetSprites(i);
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                if(Drawn.SpriteType == Engine.SpriteType.Lit)
                {
                    let LitDrawn = <Engine.LitSprite>Drawn;
                    for(let i = 0; i < LitDrawn.NormalSets.length; i++)
                    {
                        let TextureLoader = new Three.TextureLoader();
                        let Textures : Three.Texture[] = [];
                        this.Data["TOYBOX_" + LitDrawn.NormalSets[i].ID + "_Normal"] = Textures;
                        let TextureUrls : string[] = LitDrawn.GetNormalSprites(i);
                        for(let j = 0; j < TextureUrls.length; j++)
                        {
                            let NewTexture = TextureLoader.load(TextureUrls[j]);
                            NewTexture.flipY = false;
                            Textures.push(NewTexture);
                        }
                    }
                }
            }
            if(Drawn.SpriteType == Engine.SpriteType.Default)
            {
                let Textures : Three.Texture[] = this.Data["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                SpriteMaterial = ThreeMaterialGenerator.GenerateSpriteMaterial(SpriteData, [Textures[SpriteData.CurrentIndex]]);
            }
            else if(Drawn.SpriteType == Engine.SpriteType.Lit)
            {
                let LitDrawn = <Engine.LitSprite>Drawn;
                if(LitDrawn.SpriteSets.length != LitDrawn.NormalSets.length)
                {
                    Util.Log.Warning("LitSprite Sets length mismatch.");
                    SpriteMaterial = ThreeMaterialGenerator.GenerateSpriteMaterial(SpriteData, null);
                }
                else
                {
                    let Textures : Three.Texture[] = this.Data["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                    let Normals : Three.Texture[] = this.Data["TOYBOX_" + LitDrawn.NormalSets[Drawn.CurrentSpriteSet].ID + "_Normal"];
                    SpriteMaterial = ThreeMaterialGenerator.GenerateLitSpriteMaterial(this._EngineerScene, LitDrawn, [Textures[SpriteData.CurrentIndex], Normals[SpriteData.CurrentIndex]]);
                }
            }
        }
        else SpriteMaterial = ThreeMaterialGenerator.GenerateSpriteMaterial(SpriteData, null);
        return SpriteMaterial;
    }
    protected LoadSprite(Scene:Engine.Scene2D, Drawn:Engine.Sprite) : void
    {  
        // Override
        let SpriteData = <Engine.Sprite>Drawn;
        if(this.Data["TOYBOX_" + Drawn.ID] == null)
        {
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentSet"] = SpriteData.CurrentSpriteSet;
            this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] = SpriteData.CurrentIndex;
            let SpriteMaterial = this.LoadSpriteMaterial(Scene, Drawn);
            let Sprite:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), SpriteMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Sprite;
            Sprite.visible = SpriteData.Active;
            if(!Drawn.Fixed) Sprite.position.set((this._EngineerScene.Trans.Translation.X + SpriteData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + SpriteData.Trans.Translation.Y) * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            else Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Sprite.rotation.set((Drawn.Trans.Rotation.X / 180) * 3.14, (Drawn.Trans.Rotation.Y / 180) * 3.14, (Drawn.Trans.Rotation.Z / 180) * 3.14);
            this._Scene.add(Sprite);
            Util.Log.Info("ThreeJS Object " + Sprite.uuid + " added to scene.");
            this._Checked.push(Sprite.uuid);
        }
        else
        {
            let Sprite:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            if(Drawn.Modified)
            {
                Sprite.material = this.LoadSpriteMaterial(Scene, Drawn);
                Drawn.Modified = false;
            }
            if(this.Data["TOYBOX_" + Drawn.ID + "_CurrentSet"] != SpriteData.CurrentSpriteSet)
            {
                this.Data["TOYBOX_" + Drawn.ID + "_CurrentSet"] = SpriteData.CurrentSpriteSet;
                let Textures : Three.Texture[] = this.Data["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                Sprite.material["uniforms"].texture.value = Textures[SpriteData.CurrentIndex];
                Sprite.material["uniforms"].color.value = SpriteData.Paint.ToArray();
            }
            else if(this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] != SpriteData.CurrentIndex)
            {
                this.Data["TOYBOX_" + Drawn.ID + "_CurrentIndex"] = SpriteData.CurrentIndex;
                let Textures : Three.Texture[] = this.Data["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                Sprite.material["uniforms"].texture.value = Textures[SpriteData.CurrentIndex];
                Sprite.material["uniforms"].color.value = SpriteData.Paint.ToArray();
            }
            Sprite.visible = SpriteData.Active;
            if(!Drawn.Fixed) Sprite.position.set((this._EngineerScene.Trans.Translation.X + SpriteData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + SpriteData.Trans.Translation.Y) * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            else Sprite.position.set(SpriteData.Trans.Translation.X * this._GlobalScale.X, SpriteData.Trans.Translation.Y * this._GlobalScale.Y, SpriteData.Trans.Translation.Z);
            Sprite.scale.set(SpriteData.Trans.Scale.X * this._GlobalScale.X, SpriteData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Sprite.rotation.set((Drawn.Trans.Rotation.X / 180) * 3.14, (Drawn.Trans.Rotation.Y / 180) * 3.14, (Drawn.Trans.Rotation.Z / 180) * 3.14);
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
        let TileData = <Engine.Tile>Drawn;
        if(this.Data["TOYBOX_" + Drawn.ID] == null || TileData.Modified)
        {
            let TileMaterial;
            TileData.Modified = false;
            if(this.Data["TOYBOX_" + TileData.Collection.ID + "_Tex"] == null || TileData.Modified)
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
                    this.Data["TOYBOX_" + TileData.Collection.ID + "_Tex"] = Textures;
                    TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(TileData, [Textures[TileData.Index]]);
                }
                else TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(TileData, null);
            }
            else
            {
                let Textures : Three.Texture[] = <Three.Texture[]>this.Data["TOYBOX_" + TileData.Collection.ID + "_Tex"];
                TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(TileData, [Textures[TileData.Index]]);
            }
            let Tile:Three.Mesh = new Three.Mesh( new Three.CubeGeometry(1,1,1), TileMaterial );
            this.Data["TOYBOX_" + Drawn.ID] = Tile;
            Tile.visible = TileData.Active;
            if(!Drawn.Fixed) Tile.position.set((this._EngineerScene.Trans.Translation.X + TileData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + TileData.Trans.Translation.Y) * this._GlobalScale.Y, 0);
            else Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, TileData.Trans.Translation.Z);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set((Drawn.Trans.Rotation.X / 180) * 3.14, (Drawn.Trans.Rotation.Y / 180) * 3.14, (Drawn.Trans.Rotation.Z / 180) * 3.14);
            this._Scene.add(Tile);
            Util.Log.Info("ThreeJS Object " + Tile.uuid + " added to scene.");
            this._Checked.push(Tile.uuid);
        }
        else
        {
            let Tile:Three.Mesh = this.Data["TOYBOX_" + Drawn.ID];
            Tile.visible = TileData.Active;
            if(!Drawn.Fixed) Tile.position.set((this._EngineerScene.Trans.Translation.X + TileData.Trans.Translation.X) * this._GlobalScale.X, (this._EngineerScene.Trans.Translation.Y + TileData.Trans.Translation.Y) * this._GlobalScale.Y, 0);
            else Tile.position.set(TileData.Trans.Translation.X * this._GlobalScale.X, TileData.Trans.Translation.Y * this._GlobalScale.Y, TileData.Trans.Translation.Z);
            Tile.scale.set(TileData.Trans.Scale.X * this._GlobalScale.X, TileData.Trans.Scale.Y * this._GlobalScale.Y, 1);
            Tile.rotation.set((Drawn.Trans.Rotation.X / 180) * 3.14, (Drawn.Trans.Rotation.Y / 180) * 3.14, (Drawn.Trans.Rotation.Z / 180) * 3.14);
            this._Checked.push(Tile.uuid);
        }
    }
}