export  { DrawObject, DrawObjectType };

import * as Math from "./../../Mathematics/Mathematics";

import { Material } from "./../Material/Material";
import { SceneObjectType, SceneObject } from "./SceneObject";

enum DrawObjectType
{
    Undefined = "Undefined",
    Image = "Image",
    Sprite = "Sprite",
    Tile = "Tile",
    Light = "Light"
}
class DrawObject extends SceneObject
{
    // Abstract
    private _Modified:boolean;
    private _Fixed:boolean;
    private _Active:boolean;
    private _Paint:Math.Color;
    private _DrawType:DrawObjectType;
    private _Trans:Math.Transformation;
    public get Modified():boolean { return this._Modified; }
    public set Modified(value:boolean) { this._Modified = value; }
    public get Active():boolean { return this._Active; }
    public set Active(value:boolean) { this._Active = value; this.OnToggle(value); }
    public get Fixed():boolean { return this._Fixed; }
    public set Fixed(value:boolean) { this._Fixed = value; }
    public get Paint():Math.Color { return this._Paint; }
    public set Paint(value:Math.Color) { this._Paint = value; }
    public get DrawType():DrawObjectType { return this._DrawType; }
    public set DrawType(value:DrawObjectType) { this._DrawType = value; }
    public get Trans():Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public get Position():Math.Vertex { return this._Trans.Translation; }
    public set Position(value:Math.Vertex) { this._Trans.Translation = value; }
    public get Size():Math.Vertex { return this._Trans.Scale; }
    public set Size(value:Math.Vertex) { this._Trans.Scale = value; }
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
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : DrawObject
    {
        return new DrawObject(this);
    }
    public OnToggle(Value:boolean) : void
    {
        // Virtual
    }
    public Serialize() : any
    {
        // Override
        let DO = super.Serialize();
        DO.Fixed = this._Fixed;
        DO.Active = this._Active;
        DO.Paint = this._Paint.Serialize();
        DO.DrawType = <string> this._DrawType;
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
        this._Paint.Deserialize(Data.Paint);
        this._Trans = new Math.Transformation();
        this._Trans.Deserialize(Data.Transformations);
    }
}