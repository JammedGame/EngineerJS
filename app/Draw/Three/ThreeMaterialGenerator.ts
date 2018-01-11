export { ThreeMaterialGenerator }

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import * as Shaders from "./Shaders";

const TOYBOX_MAX_LIGHTS = 8;

class ThreeMaterialGenerator
{
    private static GenerateMaterial(Scene:Engine.Scene2D, Drawn:Engine.DrawObject, Textures:Three.Texture[], Metadata:any) : Three.ShaderMaterial
    {
        let Index:number = -1;
        let Tile:Engine.Tile = null;
        let Sprite:Engine.Sprite = null;
        if(Drawn.DrawType == Engine.DrawObjectType.Tile)
        {
            Tile = <Engine.Tile> Drawn;
            Index = Tile.Index;
        }
        if(Drawn.DrawType == Engine.DrawObjectType.Sprite)
        {
            Sprite = <Engine.Sprite> Drawn;
            Index = Sprite.Index();
        }
        let Uniforms:any =
        {
            index: { type:"i", value: Index },
            color: { type:"v4", value: Drawn.Paint.ToArray() },
            texture: { type:"tv", value: Textures[0] }
        };
        let VertexShader = Shaders.ThreeJSShaders.Vertex2D;
        let FragmentShader = Shaders.ThreeJSShaders.Fragment2D;
        if(Drawn.MaterialType != Engine.DrawObjectMaterialType.Default)
        {
            VertexShader = Shaders.ThreeJSShaders.LitVertex2D;
            FragmentShader = Shaders.ThreeJSShaders.LitFragment2D;
            let LightsPack = ThreeMaterialGenerator.Pack2DLights(Scene, Metadata);
            Uniforms.locations = LightsPack.Locations;
            Uniforms.intensities = LightsPack.Intensities;
            Uniforms.attenuations = LightsPack.Attenuations;
            Uniforms.lightColors = LightsPack.LightColors;
        }
        if(Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit)
        {
            FragmentShader = Shaders.ThreeJSShaders.LitNormalFragment2D;
            Uniforms.normalMap = { type:"tv", value: Textures[1] };
            if(Sprite && Sprite.NormalSets.length == 0) Index = -1;
            if(Tile && Tile.NormalCollection.Images.length == 0) Index = -1;
        }
        let DrawnMaterial = new Three.ShaderMaterial
        (
            {
                uniforms: Uniforms,
                vertexShader: VertexShader,
                fragmentShader: FragmentShader,
            }
        );
        DrawnMaterial.transparent = true;
        return DrawnMaterial;
    }
    private static RegisterLitMaterial(Material:any, Metadata:any)
    {
        if(Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] == null) Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] = [];
        Metadata["TOYBOX_LIT_OBJECT_MATERIALS"].push(Material);
    }
    public static LoadMaterial(Scene:Engine.Scene2D, Drawn:Engine.DrawObject, Metadata:any) : Three.ShaderMaterial
    {
        let ID:string = "";
        let Index:number = -1;
        let NormalID:string = "";
        let Tile:Engine.Tile = null;
        let Sprite:Engine.Sprite = null;
        let Material:Three.ShaderMaterial = null;
        if(Drawn.DrawType == Engine.DrawObjectType.Tile)
        {
            Tile = <Engine.Tile>Drawn;
            ID = Tile.Collection.ID;
            if (Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Custom ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Shader)
            {
                NormalID = Tile.NormalCollection.ID;
            }
            Index = Tile.Index;
        }
        if(Drawn.DrawType == Engine.DrawObjectType.Sprite)
        {
            Sprite = <Engine.Sprite>Drawn;
            ID = Sprite.SpriteSets[Sprite.CurrentSpriteSet].ID;
            if (Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Custom ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Shader)
            {
                NormalID = Sprite.NormalSets[Sprite.CurrentSpriteSet].ID;
            }
            Index = Sprite.CurrentIndex;
        }
        let Textures : Three.Texture[] = Metadata["TOYBOX_" + ID + "_Tex"];
        if(Drawn.MaterialType == Engine.DrawObjectMaterialType.Default ||
           Drawn.MaterialType == Engine.DrawObjectMaterialType.Lit)
        {
            Material = ThreeMaterialGenerator.GenerateMaterial(Scene, Drawn, [Textures[Index]], Metadata);
            if(Drawn.MaterialType == Engine.DrawObjectMaterialType.Lit)
            {
                ThreeMaterialGenerator.RegisterLitMaterial(Material, Metadata);
            }
        }
        else if(Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Custom ||
                Drawn.MaterialType == Engine.DrawObjectMaterialType.Shader)
        {
            let Normals : Three.Texture[] = Metadata["TOYBOX_" + NormalID + "_Normal"];
            if(Normals) Material = ThreeMaterialGenerator.GenerateMaterial(Scene, Drawn, [Textures[Index], Normals[Index]], Metadata);
            else Material = ThreeMaterialGenerator.GenerateMaterial(Scene, Drawn, [Textures[Index]], Metadata);
            ThreeMaterialGenerator.RegisterLitMaterial(Material, Metadata);
        }
        return Material
    }
    public static LoadSpriteMaterial(Scene:Engine.Scene2D, Drawn:Engine.Sprite, Metadata:any) : any
    {
        let SpriteMaterial;
        if(Drawn.SpriteSets.length > 0)
        {
            if(Metadata["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"] == null)
            {
                for(let i = 0; i < Drawn.SpriteSets.length; i++)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    Metadata["TOYBOX_" + Drawn.SpriteSets[i].ID + "_Tex"] = Textures;
                    let TextureUrls : string[] = Drawn.GetSprites(i);
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                if(Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit ||
                    Drawn.MaterialType == Engine.DrawObjectMaterialType.Custom ||
                    Drawn.MaterialType == Engine.DrawObjectMaterialType.Shader)
                {
                    for(let i = 0; i < Drawn.NormalSets.length; i++)
                    {
                        let TextureLoader = new Three.TextureLoader();
                        let Textures : Three.Texture[] = [];
                        Metadata["TOYBOX_" + Drawn.NormalSets[i].ID + "_Normal"] = Textures;
                        let TextureUrls : string[] = Drawn.GetNormalSprites(i);
                        for(let j = 0; j < TextureUrls.length; j++)
                        {
                            let NewTexture = TextureLoader.load(TextureUrls[j]);
                            NewTexture.flipY = false;
                            Textures.push(NewTexture);
                        }
                    }
                }
            }
            SpriteMaterial = ThreeMaterialGenerator.LoadMaterial(Scene, Drawn, Metadata);
        }
        else SpriteMaterial = ThreeMaterialGenerator.GenerateMaterial(Scene, <Engine.Sprite>Drawn, [], Metadata);
        return SpriteMaterial;
    }
    public static LoadTileMaterial(Scene:Engine.Scene2D, Drawn:Engine.Tile, Metadata:any) : any
    {
        let TileMaterial;
        if(Drawn.Collection.Images.length > 0)
        {
            if(Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] == null || Drawn.Modified)
            {
                let TextureLoader = new Three.TextureLoader();
                let Textures : Three.Texture[] = [];
                let TextureUrls : string[] = Drawn.Collection.Images;
                for(let j = 0; j < TextureUrls.length; j++)
                {
                    let NewTexture = TextureLoader.load(TextureUrls[j]);
                    NewTexture.flipY = false;
                    Textures.push(NewTexture);
                }
                if(Drawn.MaterialType == Engine.DrawObjectMaterialType.NormalLit ||
                    Drawn.MaterialType == Engine.DrawObjectMaterialType.Custom ||
                    Drawn.MaterialType == Engine.DrawObjectMaterialType.Shader)
                {
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    Metadata["TOYBOX_" + Drawn.NormalCollection.ID + "_Normal"] = Textures;
                    let TextureUrls : string[] = Drawn.NormalCollection.Images;
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] = Textures;
                TileMaterial = ThreeMaterialGenerator.LoadMaterial(Scene, Drawn, Metadata);
            }
            else TileMaterial = ThreeMaterialGenerator.LoadMaterial(Scene, Drawn, Metadata);
        }
        else TileMaterial = ThreeMaterialGenerator.GenerateMaterial(Scene, Drawn, null, Metadata);
        return TileMaterial;
    }
    private static Pack2DLights(Scene:Engine.Scene2D, Metadata:any) : any
    {
        let Locations = [];
        let Intensities = [];
        let Attenuations = [];
        let LightColors = [];
        let Lights:Engine.Light[] = Scene.ActiveLights;
        for(let i = 0; i < Lights.length && i < TOYBOX_MAX_LIGHTS; i++)
        {
            Locations.push(Metadata["TOYBOX_"+Lights[i].ID+"_Light"]);
            Intensities.push(Lights[i].Intensity / 100);
            Attenuations.push(this.Vec4FromData(Lights[i].Attenuation.ToVertex().ToArray()));
            LightColors.push(this.Vec4FromData(Lights[i].Paint.ToArray()));
        }
        for(let i = Intensities.length; i < TOYBOX_MAX_LIGHTS; i++)
        {
            Locations.push(new Three.Vector3());
            Intensities.push(0.0);
            Attenuations.push(new Three.Vector3());
            LightColors.push(new Three.Vector4());
        }
        let LightsPack =
        {
            Locations: { type:"v3v", value:Locations },
            Intensities: { type:"fv", value:Intensities },
            Attenuations: { type:"v3v", value:Attenuations },
            LightColors: { type:"v4v", value:LightColors }
        }
        return LightsPack;
    }
    public static Update2DLights(Scene:Engine.Scene2D, Metadata:any)
    {
        if(Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] == null) return;
        let Materials = Metadata["TOYBOX_LIT_OBJECT_MATERIALS"];
        let LightsPack = ThreeMaterialGenerator.Pack2DLights(Scene, Metadata);
        for(let i in Materials)
        {
            Materials[i]["uniforms"].locations.value = LightsPack.Locations.value;
            Materials[i]["uniforms"].intensities.value = LightsPack.Intensities.value;
            Materials[i]["uniforms"].attenuations.value = LightsPack.Attenuations.value;
            Materials[i]["uniforms"].lightColors.value = LightsPack.LightColors.value;
        }
    }
    private static Vec3FromData(Data:number[]) : Three.Vector3
    {
        return new Three.Vector3(Data[0], Data[1], Data[2]);   
    }
    private static Vec4FromData(Data:number[]) : Three.Vector4
    {
        return new Three.Vector4(Data[0], Data[1], Data[2], Data[3]);   
    }
    public static PrepLightLoc(Location:Math.Vertex, Resolution:Math.Vertex) : Three.Vector3
    {
        let NewVector = new Three.Vector3(Location.X, Location.Y, Location.Z);
        NewVector.x -= Resolution.X / 2;
        NewVector.x /= Resolution.X;
        NewVector.x *= 2;
        NewVector.y -= Resolution.Y / 2;
        NewVector.y /= Resolution.Y;
        NewVector.y *= -2;
        return NewVector;
    }
}