export { DirectionalLight }

import * as Math from "./../../Mathematics/Mathematics";

import { Light, LightType } from "./Light";

class DirectionalLight extends Light
{
    private _Radius:number;
    public get Radius():number { return this._Radius; }
    public set Radius(value:number) { this._Radius = value; }
    public get Parameter() : number { /*Override*/ return this._Radius / 1000; }
    public constructor(Old?:DirectionalLight)
    {
        super(Old);
        if(Old != null)
        {
            this._Radius = Old._Radius;
        }
        else
        {
            this.LightType = LightType.Directional;
            this.Direction = new Math.Vertex(0,1,0);
            this._Radius = 100;
        }
    }
    public Copy() : DirectionalLight
    {
        return new DirectionalLight(this);
    }
    public Serialize() : any
    {
        // Override
        let DL = super.Serialize();
        DL.RadiusAngle = this._Radius;
        return DL;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._Radius = Data.RadiusAngle;
    }
}