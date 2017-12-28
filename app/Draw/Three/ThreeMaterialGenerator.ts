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
    public static GenerateLitSpriteMaterial(Scene:Engine.Scene2D, Sprite:Engine.LitSprite, Textures:Three.Texture[], Metadata:any) : Three.ShaderMaterial
    {
        let Index = Sprite.Index();
        if(Sprite.SpriteSets.length == 0) Index = -1;
        if(Sprite.NormalSets.length == 0) Index = -1;

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
        let Uniforms =
        {
            index: { type:"i", value:Index },
            color: { type:"v4", value:Sprite.Paint.ToArray() },
            texture: { type:"tv", value: Textures[0] },
            normalMap: { type:"tv", value: Textures[1] },
            locations: { type:"v3v", value: Locations },
            intensities: { type:"fv", value:Intensities },
            attenuations: { type:"v3v", value:Attenuations },
            lightColors: { type:"v4v", value:LightColors }
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
                if(Drawn.SpriteType == Engine.SpriteType.Lit)
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
            if(Drawn.SpriteType == Engine.SpriteType.Default)
            {
                let Textures : Three.Texture[] = Metadata["TOYBOX_" + Drawn.SpriteSets[Drawn.CurrentSpriteSet].ID + "_Tex"];
                SpriteMaterial = ThreeMaterialGenerator.GenerateSpriteMaterial(SpriteData, [Textures[SpriteData.CurrentIndex]]);
            }
            else if(Drawn.SpriteType == Engine.SpriteType.Lit)
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