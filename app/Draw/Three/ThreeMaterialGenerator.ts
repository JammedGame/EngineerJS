export { ThreeMaterialGenerator }

import * as Three from 'three';
import * as Math from "./../../Mathematics/Mathematics";
import * as Engine from "./../../Engine/Engine";
import * as Util from "./../../Util/Util";

import { ThreeBasicShaders } from "./ThreeBasicShaders";
import { ThreeShaderGenerator } from "./ThreeShaderGenerator";

const TOYBOX_MAX_LIGHTS = 8;

class ThreeMaterialGenerator
{
    private _Metadata:any;
    private _Scene:Engine.Scene;
    private _Loader:Three.TextureLoader;
    public constructor(Old?:ThreeMaterialGenerator, Metadata?:any, Scene?:Engine.Scene)
    {
        if(Old)
        {
            this._Scene = Old._Scene;
            this._Metadata = Old._Metadata;
            this._Loader = Old._Loader;
        }
        else
        {
            this._Scene = Scene;
            this._Metadata = Metadata;
            this._Loader = new Three.TextureLoader();
        }
    }
    public Copy() : ThreeMaterialGenerator
    {
        return new ThreeMaterialGenerator(this);
    }
    private GenerateMaterial(Drawn:Engine.ImageObject, Textures:Three.Texture[]) : Three.ShaderMaterial
    {
        let Index:number = Drawn.Index;
        let Uniforms:any =
        {
            index: { type:"i", value: Index },
            color: { type:"v4", value: Drawn.Paint.ToArray() },
            texture: { type:"tv", value: (Textures) ? Textures[0] : null },
            repeatx: { type:"f", value: Drawn.RepeatX },
            repeaty: { type:"f", value: Drawn.RepeatY }
        };
        let VertexShader = ThreeBasicShaders.Vertex2D;
        let FragmentShader = ThreeBasicShaders.Fragment2D;
        if(Drawn.Material.Type != Engine.MaterialType.Default)
        {
            VertexShader = ThreeBasicShaders.LitVertex2D;
            FragmentShader = ThreeBasicShaders.LitFragment2D;
            this.PrePack2DLights(Uniforms);
            Uniforms.ambient = { type:"v4", value: Drawn.AmbientColor.ToArray() };
        }
        if(Drawn.Material.Type == Engine.MaterialType.Phong ||
            Drawn.Material.Type == Engine.MaterialType.Toon ||
            Drawn.Material.Type == Engine.MaterialType.Custom)
        {
            if(Drawn.NormalMaps.length == 0) Index = -1;
            else
            {
                FragmentShader = ThreeBasicShaders.PhongFragment2D;
                Uniforms.normalMap = { type:"tv", value: Textures[1] };
            }
        }
        if(Drawn.Material.Type == Engine.MaterialType.Custom ||
            Drawn.Material.Type == Engine.MaterialType.Shader)
        {
            for(let i in Drawn.Material.Inputs)
            {
                let Input:Engine.MaterialInput = Drawn.Material.Inputs[i];
                if(Drawn.Data[Input.ID] != null)
                {
                    if(<string>Input.Type == "tv")
                    {
                        if(this._Metadata["TOYBOX_TEXTURE_"+Input.ID] == null)
                        {
                            let Path:string = Drawn.Data[Input.ID];
                            this._Metadata["TOYBOX_TEXTURE_"+Input.ID] = this.LoadTexture(Drawn, Path);
                        }
                        Uniforms[Input.ID] = { type:<string>Input.Type, value:this._Metadata["TOYBOX_TEXTURE_"+Input.ID] };
                    }
                    else
                    {
                        Uniforms[Input.ID] = { type:<string>Input.Type, value:Drawn.Data[Input.ID] };
                    }
                }
            }
        }
        if(Drawn.Material.Type == Engine.MaterialType.Toon)
        {
            FragmentShader = ThreeBasicShaders.ToonFragment2D;
        }
        if(Drawn.Material.Type == Engine.MaterialType.Custom)
        {
            FragmentShader = ThreeShaderGenerator.GenerateFragment(Drawn.Material);
        }
        if(Drawn.Material.Type == Engine.MaterialType.Shader)
        {
            if(Drawn.Material.Shaders.Vertex != "") VertexShader = Drawn.Material.Shaders.Vertex;
            if(Drawn.Material.Shaders.Fragment != "") FragmentShader = Drawn.Material.Shaders.Fragment;
        }
        let DrawnMaterial = new Three.ShaderMaterial
        (
            {
                uniforms: Uniforms,
                vertexShader: VertexShader,
                fragmentShader: FragmentShader
            }
        );
        DrawnMaterial.transparent = true;
        return DrawnMaterial;
    }
    public LoadMaterial(Drawn:Engine.ImageObject) : Three.ShaderMaterial
    {
        let ID:string = Drawn.Collection.ID;
        let Index:number = Drawn.Index;
        let NormalID:string = "";
        let Material:Three.ShaderMaterial = null;
        if (Drawn.Material.Type == Engine.MaterialType.Phong ||
            Drawn.Material.Type == Engine.MaterialType.Toon ||
            Drawn.Material.Type == Engine.MaterialType.Custom ||
            Drawn.Material.Type == Engine.MaterialType.Shader)
        {
            NormalID = Drawn.NormalCollection.ID;
        }
        let Textures : Three.Texture[] = this._Metadata["TOYBOX_" + ID + "_Tex"];
        if(Drawn.Material.Type == Engine.MaterialType.Default ||
           Drawn.Material.Type == Engine.MaterialType.Lit)
        {
            Material = this.GenerateMaterial(Drawn, [Textures[Index]]);
            if(Drawn.Material.Type == Engine.MaterialType.Lit)
            {
                this.RegisterLitMaterial(Material);
            }
        }
        else if(Drawn.Material.Type == Engine.MaterialType.Phong ||
                Drawn.Material.Type == Engine.MaterialType.Toon ||
                Drawn.Material.Type == Engine.MaterialType.Custom ||
                Drawn.Material.Type == Engine.MaterialType.Shader)
        {
            let Normals : Three.Texture[] = this._Metadata["TOYBOX_" + NormalID + "_Normal"];
            if(Normals) Material = this.GenerateMaterial(Drawn, [Textures[Index], Normals[Index]]);
            else Material = this.GenerateMaterial(Drawn, [Textures[Index]]);
            this.RegisterLitMaterial(Material);
        }
        return Material
    }
    public LoadObjectMaterial(Drawn:Engine.ImageObject) : any
    {
        let Material;
        if(Drawn.Collection.Images.length > 0)
        {
            if(this._Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] == null || Drawn.Modified)
            {
                let Textures : Three.Texture[] = [];
                let TextureUrls : string[] = Drawn.Collection.Images;
                for(let j = 0; j < TextureUrls.length; j++)
                {
                    Textures.push(this.LoadTexture(Drawn, TextureUrls[j]));
                }
                if(Drawn.Material.Type == Engine.MaterialType.Phong ||
                    Drawn.Material.Type == Engine.MaterialType.Toon ||
                    Drawn.Material.Type == Engine.MaterialType.Custom ||
                    Drawn.Material.Type == Engine.MaterialType.Shader)
                {
                    let Textures : Three.Texture[] = [];
                    this._Metadata["TOYBOX_" + Drawn.NormalCollection.ID + "_Normal"] = Textures;
                    let TextureUrls : string[] = Drawn.NormalCollection.Images;
                    for(let j = 0; j < TextureUrls.length; j++)
                    {
                        Textures.push(this.LoadTexture(Drawn, TextureUrls[j]));
                    }
                }
                this._Metadata["TOYBOX_" + Drawn.Collection.ID + "_Tex"] = Textures;
            }
            Material = this.LoadMaterial(Drawn);
        }
        else Material = this.GenerateMaterial(Drawn, null);
        return Material;
    }
    private LoadTexture(Drawn:Engine.ImageObject, Path:string) : Three.Texture
    {
        let NewTexture = this._Loader.load(Path);
        NewTexture.flipY = false;
        let RepeatX = Drawn.RepeatX;
        if(Drawn.FlipX) RepeatX *= -1;
        let RepeatY = Drawn.RepeatY;
        if(Drawn.FlipY) RepeatY *= -1;
        if(RepeatX != 1 || RepeatY != 1)
        {
            NewTexture.wrapS = NewTexture.wrapT = Three.RepeatWrapping;
            NewTexture.offset.set( 0, 0 );
            NewTexture.repeat.set(RepeatX, RepeatY);
            NewTexture.needsUpdate = true;
        }
        NewTexture.magFilter = Three.NearestFilter;
        NewTexture.minFilter = Three.NearestMipMapNearestFilter;
        return NewTexture;
    }
    public Update2DLights() : void
    {
        if(this._Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] == null) return;
        let Materials:Three.ShaderMaterial[] = this._Metadata["TOYBOX_LIT_OBJECT_MATERIALS"];
        let LightsPack:any = this.Pack2DLights();
        for(let i in Materials)
        {
            Materials[i]["uniforms"].radii.value = LightsPack.Radii.value;
            Materials[i]["uniforms"].locations.value = LightsPack.Locations.value;
            Materials[i]["uniforms"].intensities.value = LightsPack.Intensities.value;
            Materials[i]["uniforms"].attenuations.value = LightsPack.Attenuations.value;
            Materials[i]["uniforms"].lightColors.value = LightsPack.LightColors.value;
            Materials[i]["uniforms"].lightParameters.value = LightsPack.Parameters.value;
            Materials[i]["uniforms"].lightDirections.value = LightsPack.Directions.value;
            Materials[i]["uniforms"].lightTypes.value = LightsPack.Types.value;
        }
    }
    private RegisterLitMaterial(Material:any) : void
    {
        if(this._Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] == null) this._Metadata["TOYBOX_LIT_OBJECT_MATERIALS"] = [];
        this._Metadata["TOYBOX_LIT_OBJECT_MATERIALS"].push(Material);
    }
    private PrePack2DLights(Uniforms:any) : void
    {
        let LightsPack:any = this.Pack2DLights();
        Uniforms.radii = LightsPack.Radii;
        Uniforms.locations = LightsPack.Locations;
        Uniforms.intensities = LightsPack.Intensities;
        Uniforms.attenuations = LightsPack.Attenuations;
        Uniforms.lightColors = LightsPack.LightColors;
        Uniforms.lightTypes = LightsPack.Types;
        Uniforms.lightParameters = LightsPack.Parameters;
        Uniforms.lightDirections = LightsPack.Directions;
    }
    private Pack2DLights() : any
    {
        let Radii = [];
        let Locations = [];
        let Intensities = [];
        let Attenuations = [];
        let LightColors = [];
        let Parameters = [];
        let Directions = [];
        let Types = [];
        let Lights:Engine.Light[] = this._Scene.ActiveLights;
        for(let i = 0; i < Lights.length && i < TOYBOX_MAX_LIGHTS; i++)
        {
            Radii.push(Lights[i].Radius / 100);
            Locations.push(this._Metadata["TOYBOX_"+Lights[i].ID+"_Light"]);
            Intensities.push(Lights[i].Intensity / 100);
            Attenuations.push(TMGUtil.Vec3FromData(Lights[i].Attenuation.ToVertex().ToArray()));
            LightColors.push(TMGUtil.Vec4FromData(Lights[i].Paint.ToArray()));
            Parameters.push(Lights[i].Parameter);
            Directions.push(TMGUtil.Vec3FromData(Lights[i].Direction.ToArray()));
            Types.push(TMGUtil.CodeLightType(Lights[i].LightType));
        }
        for(let i = Intensities.length; i < TOYBOX_MAX_LIGHTS; i++)
        {
            Radii.push(0.0);
            Locations.push(new Three.Vector3());
            Intensities.push(0.0);
            Attenuations.push(new Three.Vector3());
            LightColors.push(new Three.Vector4());
            Parameters.push(0.0);
            Directions.push(new Three.Vector3());
            Types.push(0);
        }
        let LightsPack =
        {
            Radii: { type:"fv", value:Radii },
            Locations: { type:"v3v", value:Locations },
            Intensities: { type:"fv", value:Intensities },
            Attenuations: { type:"v3v", value:Attenuations },
            LightColors: { type:"v4v", value:LightColors },
            Parameters: { type:"fv", value:Parameters },
            Directions: { type:"v3v", value:Directions },
            Types: { type:"iv", value:Types }
        }
        return LightsPack;
    }
    public PrepLightLoc(Location:Math.Vertex, Resolution:Math.Vertex) : Three.Vector3
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

class TMGUtil
{
    public static CodeLightType(Type:Engine.LightType) : number
    {
        if(Type == Engine.LightType.Point) return 0;
        if(Type == Engine.LightType.Spot) return 1;
        if(Type == Engine.LightType.Directional) return 2;
        return -1;
    }
    public static Vec3FromData(Data:number[]) : Three.Vector3
    {
        return new Three.Vector3(Data[0], Data[1], Data[2]);   
    }
    public static Vec4FromData(Data:number[]) : Three.Vector4
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