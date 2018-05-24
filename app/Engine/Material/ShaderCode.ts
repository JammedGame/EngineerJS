export { ShaderCode }

class ShaderCode
{
    private _Vertex:string;
    private _Fragment:string;
    public get Vertex():string { return this._Vertex; }
    public set Vertex(value:string) { this._Vertex = value; }
    public get Fragment():string { return this._Fragment; }
    public set Fragment(value:string) { this._Fragment = value; }
    public constructor(Old?:ShaderCode, Vertex?:string, Fragment?:string)
    {
        if(Old)
        {
            this._Vertex = Old._Vertex;
            this._Fragment = Old._Fragment;
        }
        else
        {
            this._Vertex = "";
            this._Fragment = "";
            if(Vertex) this._Vertex = Vertex;
            if(Fragment) this._Fragment = Fragment;
        }
    }
    public Copy() : ShaderCode
    {
        return new ShaderCode(this);
    }
}