export  { DrawObject, DrawObjectType, DrawObjectLightType };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneObjectType, SceneObject } from "./SceneObject";

enum DrawObjectType
{
    Undefined = 0,
    Sprite = 1,
    Tile = 2,
    Light = 3
}
enum DrawObjectLightType
{
    Unlit = 0,
    Lit = 1
}
class DrawObject extends SceneObject
{
    private _Modified:boolean;
    private _Fixed:boolean;
    private _Active:boolean;
    private _DrawType:DrawObjectType;
    private _Trans:Math.Transformation;
    protected _LightType:DrawObjectLightType;
    public get Modified():boolean { return this._Modified; }
    public set Modified(value:boolean) { this._Modified = value; }
    public get Active():boolean { return this._Active; }
    public set Active(value:boolean) { this._Active = value; }
    public get Fixed():boolean { return this._Fixed; }
    public set Fixed(value:boolean) { this._Fixed = value; }
    public get DrawType():DrawObjectType { return this._DrawType; }
    public set DrawType(value:DrawObjectType) { this._DrawType = value; }
    public get LightType():DrawObjectLightType { return this._LightType; }
    public get Trans():Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public constructor(Old?:DrawObject)
    {
        super(Old);
        if(Old != null)
        {
            this._Modified = false;
            this._Fixed = Old._Fixed;
            this._Active = Old._Active;
            this._DrawType = Old._DrawType;
            this._LightType = Old._LightType;
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            this._Modified = false;
            this.Type = SceneObjectType.Drawn;
            this._Fixed = false;
            this._Active = true;
            this._DrawType = DrawObjectType.Undefined;
            this._LightType = DrawObjectLightType.Unlit;
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : DrawObject
    {
        let New:DrawObject = new DrawObject(this);
        return New;
    }
    public Serialize() : any
    {
        // Override
        let DO = super.Serialize();
        DO.Fixed = this._Fixed;
        DO.Active = this._Active;
        DO.DrawType = <number>this._DrawType;
        DO.Transformations = this._Trans.Serialize();
        return DO;
    }
    public Deserialize(Data) : void
    {
        // Override
        super.Deserialize(Data);
        this._Fixed = Data.Fixed;
        this._Active = Data.Active;
        this._DrawType = <DrawObjectType>Data.DrawType;
        this._Trans = new Math.Transformation();
        this._Trans.Deserialize(Data.Transformations);
    }
}