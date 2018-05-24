export { MaterialInput, MaterialInputType }

enum MaterialInputType
{
    Integer = "i",
    Float = "f",
    Vector2 = "v2",
    Vector3 = "v3",
    Vector4 = "v4",
    Texture = "tv"
}

class MaterialInput
{
    private _ID:string;
    private _Type:MaterialInputType;
    public get ID():string { return this._ID; }
    public get Type():MaterialInputType { return this._Type; }
    public constructor(Old?:MaterialInput, ID?:string, Type?:MaterialInputType)
    {
        if(Old)
        {
            this._ID = Old._ID;
            this._Type = Old._Type;
        }
        else
        {
            this._ID = "";
            if(ID) this._ID = ID;
            this._Type = MaterialInputType.Vector4;
            if(Type) this._Type = Type;
        }
    }
    public Copy() : MaterialInput
    {
        return new MaterialInput(this);
    }
}