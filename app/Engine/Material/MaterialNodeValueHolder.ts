export  { MaterialNodeValueHolder };

import * as Math from "./../../Mathematics/Mathematics";

enum MaterialNodeValueType
{
    Input = 0,
    Output = 1,
    Value = 2,
    BoolValue = 3,
    IntValue = 4,
    FloatValue = 5,
    VertexValue = 6,
    ColorValue = 7,
    TextureValue = 8
}
class MaterialNodeValueHolder
{
    private _X:number;
    private _Y:number;
    private _Z:number;
    private _W:number;
    private _Value:any;
    private _Type:MaterialNodeValueType;
    public get X():number { return this._X; }
    public set X(value:number) { this._X = value; }
    public get Y():number { return this._Y; }
    public set Y(value:number) { this._Y = value; }
    public get Z():number { return this._Z; }
    public set Z(value:number) { this._Z = value; }
    public get W():number { return this._W; }
    public set W(value:number) { this._W = value; }
    public get Value():any { return this._Value; }
    public set Value(value:any) { this._Value = value; }
    public get Type():MaterialNodeValueType { return this._Type; }
    public set Type(value:MaterialNodeValueType) { this._Type = value; }
    public constructor(Old?:MaterialNodeValueHolder)
    {
        if(Old)
        {
            this._X = Old._X;
            this._Y = Old._Y;
            this._Z = Old._Z;
            this._W = Old._W;
            this._Value = Old._Value;
            this._Type = Old._Type;
        }
        else
        {
            this._X = 0;
            this._Y = 0;
            this._Z = 0;
            this._W = 0;
            this._Value = null;
            this._Type = MaterialNodeValueType.Value;
        }
    }
    public Copy() : MaterialNodeValueHolder
    {
        return new MaterialNodeValueHolder(this);
    }
    public static FromBoolean(B:boolean) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH.X = (B)?1:0;
        MNVH.Y = 0.0;
        MNVH.Z = 0.0;
        MNVH.W = 1.0;
        MNVH.Type = MaterialNodeValueType.IntValue;
        return MNVH;        
    }
    public static FromInteger(N:number) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH.X = N;
        MNVH.Y = 0.0;
        MNVH.Z = 0.0;
        MNVH.W = 1.0;
        MNVH.Type = MaterialNodeValueType.IntValue;
        return MNVH;        
    }
    public static FromFloat(N:number) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH.X = N;
        MNVH.Y = 0.0;
        MNVH.Z = 0.0;
        MNVH.W = 1.0;
        MNVH.Type = MaterialNodeValueType.FloatValue;
        return MNVH;        
    }
    public static FromVertex(V:Math.Vertex) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH.X = V.X;
        MNVH.Y = V.Y;
        MNVH.Z = V.Z;
        MNVH.W = 1.0;
        MNVH.Type = MaterialNodeValueType.VertexValue;
        return MNVH;        
    }
    public static FromVertex4(V:Math.Vertex, W:number) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH.X = V.X;
        MNVH.Y = V.Y;
        MNVH.Z = V.Z;
        MNVH.W = W;
        MNVH.Type = MaterialNodeValueType.VertexValue;
        return MNVH;        
    }
    public static FromColor(C:Math.Color) : MaterialNodeValueHolder
    {
        let MNVH:MaterialNodeValueHolder = new MaterialNodeValueHolder();
        MNVH._X = (C.R * 1.0 + 1) / 256;
        MNVH._Y = (C.G * 1.0 + 1) / 256;
        MNVH._Z = (C.B * 1.0 + 1) / 256;
        MNVH._W = (C.A * 1.0 + 1) / 256;
        MNVH.Type = MaterialNodeValueType.ColorValue;
        return MNVH;
    }

}