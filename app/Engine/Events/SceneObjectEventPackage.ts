export { SceneObjectEventPackage }

import { EventPackage } from "./EventPackage";

class SceneObjectEventPackage extends EventPackage
{
    public get MouseClick() : Function[] { return this._Data["MouseClick"]; }
    public get MouseDown() : Function[] { return this._Data["MouseDown"]; }
    public get MouseUp() : Function[] { return this._Data["MouseUp"]; }
    public get TouchStart() : Function[] { return this._Data["TouchStart"]; }
    public get TouchEnd() : Function[] { return this._Data["TouchEnd"]; }
    public constructor(Old?:SceneObjectEventPackage)
    {
        super(Old);
        if(Old)
        {

        }
        else
        {
            this._Data["Load"] = [];
            this._Data["Switch"] = [];
            this._Data["Resize"] = [];
            this._Data["Update"] = [];
            this._Data["KeyPress"] = [];
            this._Data["KeyDown"] = [];
            this._Data["KeyUp"] = [];
            this._Data["MouseClick"] = [];
            this._Data["MouseDown"] = [];
            this._Data["MouseUp"] = [];
            this._Data["TouchStart"] = [];
            this._Data["TouchEnd"] = [];
        }
    }
    public Copy() : SceneObjectEventPackage
    {
        return new SceneObjectEventPackage(this);
    }
}