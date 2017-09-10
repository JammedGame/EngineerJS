export { MaterialGenerator }

import * as Three from 'Three';
import * as Engine from "./../../Engine/Engine";
import * as Shaders from "./Shaders";

class MaterialGenerator
{
    public static GenerateSpriteMaterial(Sprite:Engine.Sprite, Texture:Three.Texture) : Three.ShaderMaterial
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
    public static GenerateTileMaterial(Tile:Engine.Tile, Texture:Three.Texture) : Three.ShaderMaterial
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
}