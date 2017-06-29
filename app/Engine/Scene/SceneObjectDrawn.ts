export  { DrawnSceneObject };

import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawObject } from "./../Draw/DrawObject"

class DrawnSceneObject extends SceneObject
{
    private _Visual:DrawObject;
    public get Visual():DrawObject { return this._Visual; }
    public set Visual(value:DrawObject) { this._Visual = value; }
    public constructor(Old?:DrawnSceneObject)
    {
        if(Old != null)
        {
            super(Old);
            this._Visual = Old._Visual.Copy();
        }
        else
        {
            super();
            this.Type = SceneObjectType.Drawn;
            this._Visual = new DrawObject();
        }
    }
    public Copy() : DrawnSceneObject
    {
        let New:DrawnSceneObject = new DrawnSceneObject(this);
        return New;
    }
}