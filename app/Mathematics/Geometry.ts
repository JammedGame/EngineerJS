import * as Math from "./../Mathematics/Mathematics"

export  { Geometry };

class Geometry
{
    private _Name:string;
    private _Vertices:Math.Vertex[];
    private _Normals:Math.Vertex[];
    private _TexCoords:Math.Vertex[];
    private _Faces:Math.Face[];
    public constructor(Old?:Geometry, Name?:string)
    {
        if(Old)
        {
            this._Name = Old._Name;
            this._Vertices = Old._Vertices.slice();
            this._Normals = Old._Normals.slice();
            this._TexCoords = Old._TexCoords.slice();
            this._Faces = Old._Faces.slice();
        }
        else
        {
            this._Name = "";
            if(Name) this._Name = Name;
            this._Vertices = [];
            this._Normals = [];
            this._TexCoords = [];
            this._Faces = [];
        }
    }
    public Copy():Geometry
    {
        return new Geometry(this);
    }
}