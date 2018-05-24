export { DirectionalLight }

import * as Math from "./../../Mathematics/Mathematics";

import { Light, LightType } from "./Light";

class DirectionalLight extends Light
{
    public constructor(Old?:DirectionalLight)
    {
        super(Old);
        if(Old != null)
        {
        }
        else
        {
            this.LightType = LightType.Directional;
            this.Direction = new Math.Vertex(0,1,0);
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
        return DL;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
    }
}