export  { DrawObjectType, DrawObject };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

enum DrawObjectType
{
    Undefined,
    Sprite
}
class DrawObject
{
    private _ID:string;
    private _Active:boolean;
    private _Type:DrawObjectType;
    private _Trans:Math.Transformation;
    public get ID():string { return this._ID; }
    public get Active():boolean { return this._Active; }
    public set Active(value:boolean) { this._Active = value; }
    public get Type():DrawObjectType { return this._Type; }
    public set Type(value:DrawObjectType) { this._Type = value; }
    public get Trans():Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public constructor(Old?:DrawObject)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Active = Old._Active;
            this._Type = Old._Type;
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Active = true;
            this._Type = DrawObjectType.Undefined;
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : DrawObject
    {
        let New:DrawObject = new DrawObject(this);
        return New;
    }
}