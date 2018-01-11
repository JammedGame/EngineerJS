export { MaterialNodeValue, MaterialNodeValueType }

import * as Data from "./../../Data/Data";

enum MaterialNodeValueType
{
    Int = 0,
    Bool = 1,
    Float = 2,
    Vector2 = 3,
    Vector3 = 4,
    Vector4 = 5
}

class MaterialNodeValue
{
    private _ID:string;
    private _Name:string;
    private _ParentID:string;
    private _Value:any;
    private _Editable:boolean;
    private _Type:MaterialNodeValueType;
    private _InputTarget:MaterialNodeValue;
    private _OutputTargets:MaterialNodeValue[];
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get ParentID():string { return this._ParentID; }
    public get Value():any { return this._Value; }
    public set Value(value:any) { this._Value = value; }
    public get Editable():boolean { return this._Editable; }
    public set Editable(value:boolean) { this._Editable = value; }
    public get Type():MaterialNodeValueType { return this._Type; }
    public set Type(value:MaterialNodeValueType) { this._Type = value; }
    public constructor(Old?:MaterialNodeValue)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._Type = Old._Type;
            this._Editable = Old._Editable;
            this._Value = Old.CopyValue();
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Name = this._ID;
            this._Type = MaterialNodeValueType.Vector4;
            this._Editable = false;
            this._OutputTargets = [];
        }
    }
    public Copy() : MaterialNodeValue
    {
        return new MaterialNodeValue(this);
    }
    private CopyValue() : any
    {
        if (this._Type == MaterialNodeValueType.Bool || 
            this._Type == MaterialNodeValueType.Int || 
            this._Type == MaterialNodeValueType.Float)
            return this._Value; 
        if (this._Type == MaterialNodeValueType.Vector2 || 
            this._Type == MaterialNodeValueType.Vector3 || 
            this._Type == MaterialNodeValueType.Vector4)
            return this._Value.Copy(); 
        return null;
    }
}