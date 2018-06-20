export { SceneEventPackage }

import { EventPackage } from "./EventPackage";

class SceneEventPackage extends EventPackage
{
    private _WireTouchEvents:boolean;
    public get WireTouchEvents(): boolean { return this._WireTouchEvents; }
    public set WireTouchEvents(value:boolean) { this._WireTouchEvents = value; }
    public get Load() : Function[] { return this._Data["Load"]; }
    public get Switch() : Function[] { return this._Data["Switch"]; }
    public get Leave() : Function[] { return this._Data["Leave"]; }
    public get Resize() : Function[] { return this._Data["Resize"]; }
    public get Update() : Function[] { return this._Data["Update"]; }
    public get KeyPress() : Function[] { return this._Data["KeyPress"]; }
    public get KeyDown() : Function[] { return this._Data["KeyDown"]; }
    public get KeyUp() : Function[] { return this._Data["KeyUp"]; }
    public get Click() : Function[] { return this._Data["Click"]; }
    public get MouseDown() : Function[] { return this._Data["MouseDown"]; }
    public get MouseUp() : Function[] { return this._Data["MouseUp"]; }
    public get MouseMove() : Function[] { return this._Data["MouseMove"]; }
    public get MouseWheel() : Function[] { return this._Data["MouseWheel"]; }
    public get TouchStart() : Function[] { return this._Data["TouchStart"]; }
    public get TouchEnd() : Function[] { return this._Data["TouchEnd"]; }
    public get TouchMove() : Function[] { return this._Data["TouchMove"]; }
    public get LoadProgress() : Function[] { return this._Data["LoadProgress"]; }
    public get LoadComplete() : Function[] { return this._Data["LoadComplete"]; }
    public constructor(Old?:SceneEventPackage)
    {
        super(Old);
        if(Old)
        {

        }
        else
        {
            this._Data["Load"] = [];
            this._Data["Switch"] = [];
            this._Data["Leave"] = [];
            this._Data["Resize"] = [];
            this._Data["Update"] = [];
            this._Data["KeyPress"] = [];
            this._Data["KeyDown"] = [];
            this._Data["KeyUp"] = [];
            this._Data["Click"] = [];
            this._Data["MouseDown"] = [];
            this._Data["MouseUp"] = [];
            this._Data["MouseMove"] = [];
            this._Data["MouseWheel"] = [];
            this._Data["TouchStart"] = [];
            this._Data["TouchEnd"] = [];
            this._Data["TouchMove"] = [];
            this._Data["LoadProgress"] = [];
            this._Data["LoadComplete"] = [];
        }
    }
    public Copy() : SceneEventPackage
    {
        return new SceneEventPackage(this);
    }
}