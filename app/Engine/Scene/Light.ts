export  { Light, LightAttenuation };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Light extends DrawObject
{
    private _Intensity:number;
    private _Paint:Math.Color;
    private _Attenuation:LightAttenuation;
    public get Intensity():number { return this._Intensity; }
    public set Intensity(value:number) { this._Intensity = value; }
    public get Paint():Math.Color { return this._Paint; }
    public set Paint(value:Math.Color) { this._Paint = value; }
    public get Attenuation():LightAttenuation { return this._Attenuation; }
    public set Attenuation(value:LightAttenuation) { this._Attenuation = value; }
    public constructor(Old?:Light)
    {
        super(Old);
        this.DrawType = DrawObjectType.Light;
        if(Old != null)
        {
            this._Intensity = Old._Intensity;
            this._Paint = Old._Paint.Copy();
            this._Attenuation = Old._Attenuation.Copy();
        }
        else
        {
            this._Intensity = 100;
            this._Paint = Math.Color.FromRGBA(255, 255, 255, 255);
            this._Attenuation = new LightAttenuation();
        }
    }
    public Copy() : Light
    {
        return new Light(this);
    }
    public Serialize() : any
    {
        // Override
        let T = super.Serialize();
        T.Paint = this._Paint.Serialize();
        T.Intensity = this._Intensity;
        T.Attenuation = this._Attenuation.Copy();
        return T;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._Paint.Deserialize(Data.Paint);
        this._Intensity = Data.Intensity;
        this._Attenuation.Deserialize(Data.Attenuation);
    }
}
class LightAttenuation
{
    private _Constant:number;
    private _Linear:number;
    private _Quadratic:number;
    public constructor(Old?:LightAttenuation, Constant?:number, Linear?:number, Quadratic?:number)
    {
        if(Old != null)
        {
            this._Constant = Old._Constant;
            this._Linear = Old._Linear;
            this._Quadratic = Old._Quadratic;
        }
        else
        {
            if(Constant != null) this._Constant = Constant;
            else this._Constant = 0.3;
            if(Linear != null) this._Linear = Linear;
            else this._Linear = 0.3;
            if(Quadratic != null) this._Quadratic = Quadratic;
            else this._Quadratic = 0.3;  
        }
    }
    public Copy() : LightAttenuation
    {
        return new LightAttenuation(this);
    }
    public ToVertex() : Math.Vertex
    {
        return new Math.Vertex(this._Constant, this._Linear, this._Quadratic);
    }
    public Serialize() : any
    {
        let LA =
        {
            Constant: this._Constant,
            Linear: this._Linear,
            Quadratic: this._Quadratic
        };
        return LA;
    }
    public Deserialize(Data:any) : void
    {
        this._Constant = Data.Constant;
        this._Linear = Data.Linear;
        this._Quadratic = Data.Quadratic;
    }
}