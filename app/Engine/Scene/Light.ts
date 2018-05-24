export  { Light, LightType, LightAttenuation };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

enum LightType
{
    Point = "Point",
    Spot = "Spot",
    Directional = "Directional"
}
class Light extends DrawObject
{
    private _Radius:number;
    private _Intensity:number;
    private _LightType:LightType;
    private _Direction:Math.Vertex;
    private _Attenuation:LightAttenuation;
    public get Radius():number { return this._Radius; }
    public set Radius(value:number) { this._Radius = value; }
    public get Intensity():number { return this._Intensity; }
    public set Intensity(value:number) { this._Intensity = value; }
    public get LightType():LightType { return this._LightType; }
    public set LightType(value:LightType) { this._LightType = value; }
    public get Direction():Math.Vertex { return this._Direction; }
    public set Direction(value:Math.Vertex) { this._Direction = value; }
    public get Attenuation():LightAttenuation { return this._Attenuation; }
    public set Attenuation(value:LightAttenuation) { this._Attenuation = value; }
    public get Parameter() : number { /*Virtual*/ return -1; }
    public constructor(Old?:Light)
    {
        super(Old);
        this.DrawType = DrawObjectType.Light;
        if(Old != null)
        {
            this._Radius = Old._Radius;
            this._Intensity = Old._Intensity;
            this._LightType = Old._LightType;
            this._Attenuation = Old._Attenuation.Copy();
        }
        else
        {
            this._Radius = 100;
            this._Intensity = 100;
            this._LightType = LightType.Point;
            this._Direction = new Math.Vertex(0,0,0);
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
        let L = super.Serialize();
        L.Radius = this._Radius;
        L.Intensity = this._Intensity;
        L.LightType = <string> this._LightType;
        L.Direction = this._Direction.Serialize();
        L.Attenuation = this._Attenuation.Serialize();
        return L;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._Radius = Data.Radius;
        this._Intensity = Data.Intensity;
        this._LightType = <LightType> Data.LightType;
        this._Direction.Deserialize(Data.Direction);
        this._Attenuation.Deserialize(Data.Attenuation);
    }
}
class LightAttenuation
{
    private _Constant:number;
    private _Linear:number;
    private _Quadratic:number;
    public get Constant():number { return this._Constant; }
    public set Constant(value:number) { this._Constant = value; }
    public get Linear():number { return this._Linear; }
    public set Linear(value:number) { this._Linear = value; }
    public get Quadratic():number { return this._Quadratic; }
    public set Quadratic(value:number) { this._Quadratic = value; }
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