export { ImageObject, ImageObjectSamplingType }

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { Material } from "./../Material/Material";
import { DrawObject, DrawObjectType } from "./DrawObject";
import { ImageCollection } from "./ImageCollection";
import { ImageObjectEventPackage } from "./../Events/ImageObjectEventPackage";

enum ImageObjectSamplingType
{
    Linear = "Linear",
    Nearest = "Nearest"
}
class ImageObject extends DrawObject
{
    // Abstract
    private _FlipX:boolean;
    private _FlipY:boolean;
    private _RepeatX:number;
    private _RepeatY:number;
    private _AmbientColor:Math.Color;
    private _Sampling:ImageObjectSamplingType;
    private _Material:Material;
    private _CustomShader:any;
    protected _Collection:ImageCollection;
    public get Index() : number { /*Virtual*/ return -1; }
    public set Index(value:number) { /*Virtual*/ }
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
    public get AmbientColor():Math.Color { return this._AmbientColor; }
    public set AmbientColor(value:Math.Color) { this._AmbientColor = value; }
    public get Sampling():ImageObjectSamplingType { return this._Sampling; }
    public set Sampling(value:ImageObjectSamplingType) { this._Sampling = value; }
    public get Material():Material { return this._Material; }
    public set Material(value:Material) { this._Material = value; }
    public get CustomShader():any { return this._CustomShader; }
    public set CustomShader(value:any) { this._CustomShader = value; }
    public get Events():ImageObjectEventPackage { return <ImageObjectEventPackage>this._Events; }
    public constructor(Old?:ImageObject)
    {
        super(Old);
        if(Old != null)
        {
            this._FlipX = Old._FlipX;
            this._FlipY = Old._FlipY;
            this._RepeatX = Old._RepeatX;
            this._RepeatY = Old._RepeatY;
            this._Sampling = Old._Sampling;
            this._AmbientColor = Old._AmbientColor.Copy();
            this._Material = Old._Material.Copy();
        }
        else
        {
            this._Events = new ImageObjectEventPackage();
            this._FlipX = false;
            this._FlipY = false;
            this._RepeatX = 1;
            this._RepeatY = 1;
            this._AmbientColor = Math.Color.FromRGBA(50,50,50,255);
            this._Sampling = ImageObjectSamplingType.Linear;
            this.DrawType = DrawObjectType.Image;
            this._Material = new Material();
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
        IO.FlipX = this._FlipX;
        IO.FlipY = this._FlipY;
        IO.RepeatX = this._RepeatX;
        IO.RepeatY = this._RepeatY;
        IO.AmbientColor = this._AmbientColor.Serialize();
        IO.Sampling = <string> this._Sampling;
        if(this._Material) IO.CustomMaterial = this._Material.Serialize();
        return IO;
    }
    public Deserialize(Data) : void
    {
        // Override
        super.Deserialize(Data);
        this._FlipX = Data.FlipX;
        this._FlipY = Data.FlipY;
        this._RepeatX = Data.RepeatX;
        this._RepeatY = Data.RepeatY;
        this._AmbientColor.Deserialize(Data.AmbientColor);
        this._Sampling = <ImageObjectSamplingType> Data.Sampling;
        if(Data.CustomMaterial) this._Material.Deserialize(Data.CustomMaterial);
    }
}