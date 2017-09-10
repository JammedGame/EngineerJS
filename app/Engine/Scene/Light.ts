export  { Light };

import * as Math from "../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Light extends DrawObject
{
    private _Intensity:number;
    private _Color:Math.Color;
    private _Attenuation:Math.Vertex;
    public get Intensity(): number { return this._Intensity; }
	public set Intensity(value: number) { this._Intensity = value; }
	public get Color(): Math.Color { return this._Color; }
	public set Color(value: Math.Color) { this._Color = value; }
	public get Attenuation(): Math.Vertex { return this._Attenuation; }
	public set Attenuation(value: Math.Vertex) { this._Attenuation = value; }
    public constructor(Old?:Light)
    {
        super(Old);
        this.DrawType = DrawObjectType.Light;
        if(Old)
        {
            this._Intensity = Old._Intensity;
            this._Color = Old._Color.Copy();
            this._Attenuation = Old._Attenuation.Copy();
        }
        else
        {
            this._Intensity = 1.0;
            this._Color = Math.Color.FromRGBA(255,255,255,255);
            this._Attenuation = new Math.Vertex(1.0, 0, 0);
        }
    }
    public Copy() : Light
    {
        return new Light(this);
    }
}