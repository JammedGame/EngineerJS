export { SpriteEventPackage }

import { SceneObjectEventPackage } from "./SceneObjectEventPackage";

class SpriteEventPackage extends SceneObjectEventPackage
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