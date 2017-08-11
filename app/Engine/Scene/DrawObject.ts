export  { DrawObject, DrawObjectType };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneObjectType, SceneObject } from "./SceneObject";

enum DrawObjectType
{
    Undefined = 0,
    Sprite = 1,
    Tile = 2
}
class DrawObject extends SceneObject
{
    private _Fixed:boolean;
    private _Active:boolean;
    private _DrawType:DrawObjectType;
    private _Trans:Math.Transformation;
    public get Active():boolean { return this._Active; }
    public set Active(value:boolean) { this._Active = value; }
    public get Fixed():boolean { return this._Fixed; }
    public set Fixed(value:boolean) { this._Fixed = value; }
    public get DrawType():DrawObjectType { return this._DrawType; }
    public set DrawType(value:DrawObjectType) { this._DrawType = value; }
    public get Trans():Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public constructor(Old?:DrawObject)
    {
        super(Old);
        if(Old != null)
        {
            this._Fixed = Old._Fixed;
            this._Active = Old._Active;
            this._DrawType = Old._DrawType;
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            this.Type = SceneObjectType.Drawn;
            this._Fixed = false;
            this._Active = true;
            this._DrawType = DrawObjectType.Undefined;
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : DrawObject
    {
        let New:DrawObject = new DrawObject(this);
        return New;
    }
}