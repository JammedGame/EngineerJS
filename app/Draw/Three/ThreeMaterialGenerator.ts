export { ThreeMaterialGenerator }

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import * as Shaders from "./Shaders";

class ThreeMaterialGenerator
{
    public static GenerateSpriteMaterial(Sprite:Engine.Sprite, Textures:Three.Texture[]) : Three.ShaderMaterial
    {
        if(Sprite.SpriteType == Engine.SpriteType.Default) return ThreeMaterialGenerator.GenerateDefaultSpriteMaterial(Sprite, Textures);
        else if(Sprite.SpriteType == Engine.SpriteType.Lit) return ThreeMaterialGenerator.GenerateLitSpriteMaterial(Sprite, Textures);
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
    private static GenerateLitSpriteMaterial(Sprite:Engine.Sprite, Textures:Three.Texture[]) : Three.ShaderMaterial
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
                    texture: { type:"tv", value: Textures[1] }
                },
                vertexShader: Shaders.ThreeJSShaders.Vertex2D,
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
}