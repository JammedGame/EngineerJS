export  { Transformation };

import { Vertex } from "./Vertex";

class Transformation
{
    private _Translation:Vertex;
    private _Rotation:Vertex;
    private _Scale:Vertex;
    public get Translation():Vertex { return this._Translation; }
    public set Translation(value:Vertex) { this._Translation = value; }
    public get Rotation():Vertex { return this._Rotation; }
    public set Rotation(value:Vertex) { this._Rotation = value; }
    public get Scale():Vertex { return this._Scale; }
    public set Scale(value:Vertex) { this._Scale = value; }
    public constructor(Old?:Transformation)
    {
        if(Old != null)
        {
            this._Translation = Old._Translation.Copy();
            this._Rotation = Old._Rotation.Copy();
            this._Scale = Old._Scale.Copy();
        }
        else
        {
            this._Translation = new Vertex(0,0,0);
            this._Rotation = new Vertex(0,0,0);
            this._Scale = new Vertex(1,1,1);
        }
    }
    public Copy():Transformation
    {
        let New:Transformation = new Transformation(this);
        return New;
    }
    public Serialize() : any
    {
        let T =
        {
            Translation: this._Translation.Serialize(),
            Rotation: this._Rotation.Serialize(),
            Scale: this._Scale.Serialize()
        };
        return T;
    }
    public Deserialize(Data) : void
    {
        this._Translation = new Vertex(Data.Translation.X, Data.Translation.Y, Data.Translation.Z);
        this._Rotation = new Vertex(Data.Rotation.X, Data.Rotation.Y, Data.Rotation.Z);
        this._Scale = new Vertex(Data.Scale.X, Data.Scale.Y, Data.Scale.Z);
    }
}