export { ThreeMaterialGenerator }

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import * as Shaders from "./Shaders";

const TOYBOX_MAX_LIGHTS = 8;

class ThreeMaterialGenerator
{
    public static GenerateSpriteMaterial(Sprite:Engine.Sprite, Textures:Three.Texture[]) : Three.ShaderMaterial
    {
        return ThreeMaterialGenerator.GenerateDefaultSpriteMaterial(Sprite, Textures);
    }
    private static GenerateDefaultSpriteMaterial(Sprite:Engine.Sprite, Textures:Three.Texture[]) : Three.ShaderMaterial
    {
        let Index = Sprite.Index();
        if(Sprite.SpriteSets.length == 0) Index = -1;
        let SpriteMaterial = new Three.ShaderMaterial
        (
            {
                uniforms:
                {
                    index: { type:"i", value:Index },
                    color: { type:"v4", value:Sprite.Paint.ToArray() },
                    texture: { type:"tv", value: Textures[0] }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
                fragmentShader: Shaders.ThreeJSShaders.Fragment2D,
            }
        );
        SpriteMaterial.transparent = true;
        return SpriteMaterial;
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
    public static GenerateLitSpriteMaterial(Scene:Engine.Scene2D, Sprite:Engine.LitSprite, Textures:Three.Texture[], Metadata:any) : Three.ShaderMaterial
    {
        let Index = Sprite.Index();
        if(Sprite.SpriteSets.length == 0) Index = -1;
        if(Sprite.NormalSets.length == 0) Index = -1;
        let LightsPack = ThreeMaterialGenerator.Pack2DLights(Scene, Metadata);
        let Uniforms =
        {
            index: { type:"i", value:Index },
            color: { type:"v4", value:Sprite.Paint.ToArray() },
            texture: { type:"tv", value: Textures[0] },
            normalMap: { type:"tv", value: Textures[1] },
            locations: LightsPack.Locations,
            intensities: LightsPack.Intensities,
            attenuations: LightsPack.Attenuations,
            lightColors: LightsPack.LightColors
        }
        let SpriteMaterial = new Three.ShaderMaterial
        (
            {
                uniforms: Uniforms,
                vertexShader: Shaders.ThreeJSShaders.LitVertex2D,
                fragmentShader: Shaders.ThreeJSShaders.LitFragment2D,
            }
        );
        SpriteMaterial.transparent = true;
        return SpriteMaterial;
    }
    public static GenerateTileMaterial(Tile:Engine.Tile, Textures:Three.Texture[]) : Three.ShaderMaterial
    {
        let TileMaterial = new Three.ShaderMaterial
        (
            {
                uniforms:
                {
                    index: { type:"i", value:Tile.Index },
                    color: { type:"v4", value:Tile.Paint.ToArray() },
                    texture: { type:"tv", value: Textures[0] }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
                fragmentShader: Shaders.ThreeJSShaders.Fragment2D,
            }
        );
        TileMaterial.transparent = true;
        return TileMaterial;
    }
    public static GenerateLitTileMaterial(Scene:Engine.Scene2D, Tile:Engine.LitTile, Textures:Three.Texture[], Metadata:any) : Three.ShaderMaterial
    {
        let Index = Tile.Index;
        if(Tile.Collection.Images.length == 0) Index = -1;
        if(Tile.NormalCollection.Images.length == 0) Index = -1;
        let LightsPack = ThreeMaterialGenerator.Pack2DLights(Scene, Metadata);
        let Uniforms =
        {
            index: { type:"i", value:Index },
            color: { type:"v4", value:Tile.Paint.ToArray() },
            texture: { type:"tv", value: Textures[0] },
            normalMap: { type:"tv", value: Textures[1] },
            locations: LightsPack.Locations,
            intensities: LightsPack.Intensities,
            attenuations: LightsPack.Attenuations,
            lightColors: LightsPack.LightColors
        }
        let TileMaterial = new Three.ShaderMaterial
        (
            {
                uniforms: Uniforms,
                vertexShader: Shaders.ThreeJSShaders.LitVertex2D,
                fragmentShader: Shaders.ThreeJSShaders.LitFragment2D,
            }
        );
        TileMaterial.transparent = true;
        return TileMaterial;
    }
    private static RegisterLitMaterial(Material:any, Metadata:any)
    {
        if(Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] == null) Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] = [];
        Metadata["TOYBOX_LIT_OBJECT_MATERIALS"].push(Material);
    }
    public static LoadSpriteMaterial(Scene:Engine.Scene2D, Drawn:Engine.Sprite, Metadata:any) : any
    {
        let SpriteData = <Engine.Sprite>Drawn;
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
                    let TextureUrls : string[] = SpriteData.GetSprites(i);
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                if(Drawn.LightType == Engine.DrawObjectLightType.Lit)
                {
                    let LitDrawn = <Engine.LitSprite>Drawn;
                    for(let i = 0; i < LitDrawn.NormalSets.length; i++)
                    {
                        let TextureLoader = new Three.TextureLoader();
                        let Textures : Three.Texture[] = [];
                        Metadata["TOYBOX_" + LitDrawn.NormalSets[i].ID + "_Normal"] = Textures;
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
            if(Drawn.LightType == Engine.DrawObjectLightType.Unlit)
            {
                let Textures : Three.Texture[] = Metadata["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                SpriteMaterial = ThreeMaterialGenerator.GenerateSpriteMaterial(SpriteData, [Textures[SpriteData.CurrentIndex]]);
            }
            else if(Drawn.LightType == Engine.DrawObjectLightType.Lit)
            {
                let LitDrawn = <Engine.LitSprite>Drawn;
                if(LitDrawn.SpriteSets.length != LitDrawn.NormalSets.length)
                {
                    Util.Log.Warning("LitSprite Sets length mismatch.");
                    SpriteMaterial = ThreeMaterialGenerator.GenerateLitSpriteMaterial(Scene, LitDrawn, [], Metadata);
                    ThreeMaterialGenerator.RegisterLitMaterial(SpriteMaterial, Metadata);
                }
                else
                {
                    let Textures : Three.Texture[] = Metadata["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                    let Normals : Three.Texture[] = Metadata["TOYBOX_" + LitDrawn.NormalSets[Drawn.CurrentSpriteSet].ID + "_Normal"];
                    SpriteMaterial = ThreeMaterialGenerator.GenerateLitSpriteMaterial(Scene, LitDrawn, [Textures[SpriteData.CurrentIndex], Normals[SpriteData.CurrentIndex]], Metadata);
                    ThreeMaterialGenerator.RegisterLitMaterial(SpriteMaterial, Metadata);
                }
            }
        }
        else SpriteMaterial = ThreeMaterialGenerator.GenerateLitSpriteMaterial(Scene, <Engine.LitSprite>Drawn, [], Metadata);
        return SpriteMaterial;
    }
    public static LoadTileMaterial(Scene:Engine.Scene2D, Drawn:Engine.Tile, Metadata:any) : any
    {
        let TileMaterial;
        if(Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] == null || Drawn.Modified)
        {
            if(Drawn.Collection.Images.length > 0)
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
                if(Drawn.LightType == Engine.DrawObjectLightType.Lit)
                {
                    let LitDrawn = <Engine.LitTile>Drawn;
                    let TextureLoader = new Three.TextureLoader();
                    let Textures : Three.Texture[] = [];
                    Metadata["TOYBOX_" + LitDrawn.NormalCollection.ID + "_Normal"] = Textures;
                    let TextureUrls : string[] = LitDrawn.NormalCollection.Images;
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        let NewTexture = TextureLoader.load(TextureUrls[j]);
                        NewTexture.flipY = false;
                        Textures.push(NewTexture);
                    }
                }
                Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] = Textures;
                if(Drawn.LightType == Engine.DrawObjectLightType.Unlit)
                {
                    TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(Drawn, [Textures[Drawn.Index]]);
                }
                else if(Drawn.LightType == Engine.DrawObjectLightType.Lit)
                {
                    let LitDrawn = <Engine.LitTile>Drawn;
                    if(LitDrawn.Collection.Images.length != LitDrawn.NormalCollection.Images.length)
                    {
                        Util.Log.Warning("LitTile Collections length mismatch.");
                        TileMaterial = ThreeMaterialGenerator.GenerateLitTileMaterial(Scene, LitDrawn, [], Metadata);
                        ThreeMaterialGenerator.RegisterLitMaterial(TileMaterial, Metadata);
                    }
                    else
                    {
                        let Textures : Three.Texture[] = Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"];
                        let Normals : Three.Texture[] = Metadata["TOYBOX_" + LitDrawn.NormalCollection.ID + "_Normal"];
                        TileMaterial = ThreeMaterialGenerator.GenerateLitTileMaterial(Scene, LitDrawn, [Textures[Drawn.Index], Normals[Drawn.Index]], Metadata);
                        ThreeMaterialGenerator.RegisterLitMaterial(TileMaterial, Metadata);
                    }
                }
            }
            else TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(Drawn, null);
        }
        else
        {
            let Textures : Three.Texture[] = <Three.Texture[]>Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"];
            TileMaterial = ThreeMaterialGenerator.GenerateTileMaterial(Drawn, [Textures[Drawn.Index]]);
        }
        return TileMaterial;
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