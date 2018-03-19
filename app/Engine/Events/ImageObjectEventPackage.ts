export { ImageObjectEventPackage }

import { EventPackage } from "./EventPackage";

class ImageObjectEventPackage extends EventPackage
{
    public get Click() : Function[] { return this._Data["Click"]; }
    public get MouseDown() : Function[] { return this._Data["MouseDown"]; }
    public get MouseUp() : Function[] { return this._Data["MouseUp"]; }
    public get TouchStart() : Function[] { return this._Data["TouchStart"]; }
    public get TouchEnd() : Function[] { return this._Data["TouchEnd"]; }
    public constructor(Old?:ImageObjectEventPackage)
    {
        super(Old);
        if(Old)
        {

        }
        else
        {
            this._Data["Click"] = [];
            this._Data["MouseDown"] = [];
            this._Data["MouseUp"] = [];
            this._Data["TouchStart"] = [];
            this._Data["TouchEnd"] = [];
        }
    }
    public Copy() : ImageObjectEventPackage
    {
        return new ImageObjectEventPackage(this);
    }
}