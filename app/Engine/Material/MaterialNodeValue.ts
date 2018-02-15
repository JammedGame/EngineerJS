export { MaterialNodeValue, MaterialNodeValueType }

import * as Data from "./../../Data/Data";

enum MaterialNodeValueType
{
    Int = "int",
    Bool = "bool",
    Float = "float",
    Vector2 = "vec2",
    Vector3 = "vec3",
    Vector4 = "vec4"
}

class MaterialNodeValue
{
    private _ID:string;
    private _Origin:string;
    private _Name:string;
    private _ParentName:string;
    private _Value:any;
    private _Editable:boolean;
    private _Type:MaterialNodeValueType;
    private _InputTarget:MaterialNodeValue;
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get OriginID():string { return this._Origin; }
    public get ParentName():string { return this._ParentName; }
    public set ParentName(value:string) { this._ParentName = value; }
    public get Value():any { return this._Value; }
    public set Value(value:any) { this._Value = value; }
    public get Editable():boolean { return this._Editable; }
    public set Editable(value:boolean) { this._Editable = value; }
    public get Type():MaterialNodeValueType { return this._Type; }
    public set Type(value:MaterialNodeValueType) { this._Type = value; }
    public get InputTarget():MaterialNodeValue { return this._InputTarget; }
    public set InputTarget(value:MaterialNodeValue) { this._InputTarget = value; }
    public constructor(Old?:MaterialNodeValue)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Origin = Old._ID;
            this._ParentName = Old._ParentName;
            this._Name = Old._Name;
            this._Type = Old._Type;
            this._Editable = Old._Editable;
            this._Value = Old.CopyValue();
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Origin = this._ID;
            this._ParentName = "";
            this._Name = this._ID;
            this._Type = MaterialNodeValueType.Vector4;
            this._Editable = false;
        }
    }
    public Copy() : MaterialNodeValue
    {
        return new MaterialNodeValue(this);
    }
    private CopyValue() : any
    {
        if(!this._Value) return this._Value;
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
    public Serialize() : any
    {
        // Virtual
        let MNV =
        {
            ID: this._ID,
            OriginID: this._Origin,
            Name: this._Name,
            ParentName: this._ParentName,
            Value: this._Value,
            Editable: this._Editable,
            Type: <string> this._Type,
            InputTarget: "None"
        };
        if(this._InputTarget != null) MNV.InputTarget = this._InputTarget.OriginID;
        return MNV;
    }
    public Deserialize(Data:any) : void
    {
        // Virtual
        this._ID = Data.ID;
        this._Origin = Data.OriginID;
        this._Name = Data.Name;
        this._ParentName = Data.ParentName;
        this._Value = Data.Value;
        this._Editable = Data.Editable;
        this._Type = <MaterialNodeValueType> Data.Type;
    }
}