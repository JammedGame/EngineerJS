export { SpotLight }

import * as Math from "./../../Mathematics/Mathematics";

import { Light, LightType } from "./Light";

class SpotLight extends Light
{
    private _RadiusAngle:number;
    public get RadiusAngle():number { return this._RadiusAngle; }
    public set RadiusAngle(value:number) { this._RadiusAngle = value; }
    public get Parameter() : number { /*Override*/ return this._RadiusAngle; }
    public constructor(Old?:SpotLight)
    {
        super(Old);
        if(Old != null)
        {
            this._RadiusAngle = Old._RadiusAngle;
        }
        else
        {
            this.LightType = LightType.Spot;
            this.Direction = new Math.Vertex(0,1,0);
            this._RadiusAngle = 60;
        }
    }
    public Copy() : SpotLight
    {
        return new SpotLight(this);
    }
    public Serialize() : any
    {
        // Override
        let SL = super.Serialize();
        SL.RadiusAngle = this._RadiusAngle;
        return SL;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._RadiusAngle = Data.RadiusAngle;
    }
}