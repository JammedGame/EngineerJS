export  { DrawObject, DrawObjectType, DrawObjectMaterialType };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneObjectType, SceneObject } from "./SceneObject";

enum DrawObjectType
{
    Undefined = 0,
    Sprite = 1,
    Tile = 2,
    Light = 3
}
enum DrawObjectMaterialType
{
    Default = 0,
    Lit = 1,
    NormalLit = 2,
    Custom = 3,
    Shader = 4
}
class DrawObject extends SceneObject
{
    private _Modified:boolean;
    private _Fixed:boolean;
    private _Active:boolean;
    private _Paint:Math.Color;
    private _DrawType:DrawObjectType;
    private _MaterialType:DrawObjectMaterialType;
    private _Trans:Math.Transformation;
    public get Modified():boolean { return this._Modified; }
    public set Modified(value:boolean) { this._Modified = value; }
    public get Active():boolean { return this._Active; }
    public set Active(value:boolean) { this._Active = value; }
    public get Fixed():boolean { return this._Fixed; }
    public set Fixed(value:boolean) { this._Fixed = value; }
    public get Paint():Math.Color { return this._Paint; }
    public set Paint(value:Math.Color) { this._Paint = value; }
    public get DrawType():DrawObjectType { return this._DrawType; }
    public set DrawType(value:DrawObjectType) { this._DrawType = value; }
    public get MaterialType():DrawObjectMaterialType { return this._MaterialType; }
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
            this._Paint = Old._Paint.Copy();
            this._DrawType = Old._DrawType;
            this._MaterialType = Old._MaterialType;
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            this._Modified = false;
            this.Type = SceneObjectType.Drawn;
            this._Fixed = false;
            this._Active = true;
            this._Paint = Math.Color.FromRGBA(255, 255, 255, 255);
            this._DrawType = DrawObjectType.Undefined;
            this._MaterialType = DrawObjectMaterialType.Default;
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
        DO.Paint = this._Paint.Serialize();
        DO.DrawType = <number>this._DrawType;
        DO.MaterialType = <number>this._MaterialType;
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
        this._MaterialType = <DrawObjectMaterialType>Data.MaterialType;
        this._Paint.Deserialize(Data.Paint);
        this._Trans = new Math.Transformation();
        this._Trans.Deserialize(Data.Transformations);
    }
}