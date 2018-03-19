export { SpriteEventPackage }

import { ImageObjectEventPackage } from "./ImageObjectEventPackage";

class SpriteEventPackage extends ImageObjectEventPackage
{
    public get SetComplete() : Function[] { return this._Data["SetComplete"]; }
    public constructor(Old?:SpriteEventPackage)
    {
        super(Old);
        if(Old)
        {

        }
        else
        {
            this._Data["SetComplete"] = [];
        }
    }
    public Copy() : SpriteEventPackage
    {
        return new SpriteEventPackage(this);
    }
}