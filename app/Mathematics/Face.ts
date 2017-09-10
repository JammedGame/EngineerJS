export  { Face };

class Face
{
    private _Vertices:number[];
    private _Normals:number[];
    private _TexCoords:number[];
    public get Vertices():number[] {return this._Vertices}
    public set Vertices(value:number[]) {this._Vertices = value;}
    public get Normals():number[] {return this._Normals}
    public set Normals(value:number[]) {this._Normals = value;}
    public get TexCoords():number[] {return this._TexCoords}
    public set TexCoords(value:number[]) {this._TexCoords = value;}
    public constructor(Old?:Face)
    {
        if(Old)
        {
            this._Vertices = Old._Vertices.slice();
            this._Normals = Old._Normals.slice();
            this._TexCoords = Old._TexCoords.slice();
        }
        else
        {
            this._Vertices = [];
            this._Normals = [];
            this._TexCoords = [];
        }
    }
    public Copy():Face
    {
        return new Face(this);
    }
}