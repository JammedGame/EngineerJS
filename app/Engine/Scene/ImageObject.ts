export { ImageObject, ImageObjectMaterialType }

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { Material } from "./../Material/Material";
import { DrawObject, DrawObjectType } from "./DrawObject";

enum ImageObjectMaterialType
{
    Default = "Default",
    Lit = "Lit",
    NormalLit = "NormalLit",
    Custom = "Custom",
    Shader = "Shader"
}
class ImageObject extends DrawObject
{
    // Abstract
    private _FlipX:boolean;
    private _FlipY:boolean;
    private _RepeatX:number;
    private _RepeatY:number;
    private _MaterialType:ImageObjectMaterialType;
    private _CustomMaterial:Material;
    private _CustomShader:any;
    public get Index() : number { /*Virtual*/ return -1; }
    public get Images() : string[] { /*Virtual*/ return []; }
    public get NormalMaps() : string[] { /*Virtual*/ return []; }
    public get FlipX():boolean { return this._FlipX; }
    public set FlipX(value:boolean) { this._FlipX = value; this.Modified = true; }
    public get FlipY():boolean { return this._FlipY; }
    public set FlipY(value:boolean) { this._FlipY = value; this.Modified = true; }
    public get RepeatX():number { return this._RepeatX; }
    public set RepeatX(value:number) { this._RepeatX = value; this.Modified = true; }
    public get RepeatY():number { return this._RepeatY; }
    public set RepeatY(value:number) { this._RepeatY = value; this.Modified = true; }
    public get MaterialType():ImageObjectMaterialType { return this._MaterialType; }
    public set MaterialType(value:ImageObjectMaterialType) { this._MaterialType = value; this.Modified = true; }
    public get CustomMaterial():Material { return this._CustomMaterial; }
    public set CustomMaterial(value:Material) { this._CustomMaterial = value; }
    public get CustomShader():any { return this._CustomShader; }
    public set CustomShader(value:any) { this._CustomShader = value; }
    public constructor(Old?:ImageObject)
    {
        super(Old);
        if(Old != null)
        {
            this._RepeatX = Old._RepeatX;
            this._RepeatY = Old._RepeatY;
            this._MaterialType = Old._MaterialType;
            this._CustomMaterial = Old._CustomMaterial.Copy();
            this._CustomShader = Old._CustomShader;
        }
        else
        {
            this._RepeatX = 1;
            this._RepeatY = 1;
            this.DrawType = DrawObjectType.Image;
            this._MaterialType = ImageObjectMaterialType.Default;
            this._CustomMaterial = new Material();
            this._CustomShader = { VertexShader:"", FragmentShader:"" };
        }
    }
    public Copy() : ImageObject
    {
        return new ImageObject(this);
    }
    public Serialize() : any
    {
        // Override
        let IO = super.Serialize();
        IO.MaterialType = <string> this._MaterialType;
        if(this._CustomMaterial) IO.CustomMaterial = this._CustomMaterial.Serialize();
        IO.CustomShader = this._CustomShader;
        return IO;
    }
    public Deserialize(Data) : void
    {
        // Override
        super.Deserialize(Data);
        this._MaterialType = <ImageObjectMaterialType> Data.MaterialType;
        if(Data.CustomMaterial) this._CustomMaterial.Deserialize(Data.CustomMaterial);
        this._CustomShader = Data.CustomShader;
    }
}