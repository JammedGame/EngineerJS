export  { GraphicDrawMode, ShaderProgram };

import { ShaderUniformPackage } from "./ShaderUniformPackage";
import { ShaderAttributePackage } from "./ShaderAttributePackage";
import { ShaderTexturePackage } from "./ShaderTexturePackage";

enum GraphicDrawMode
{
    Points = 0,
    Lines = 1,
    LineLoop = 2,
    LineStrip = 3,
    Triangles = 4,
    TriangleStrip = 5,
    TriangleFan = 6,
    Quads = 7,
    QuadsExt = 7,
    LinesAdjacency = 10,
    LinesAdjacencyArb = 10,
    LinesAdjacencyExt = 10,
    LineStripAdjacency = 11,
    LineStripAdjacencyArb = 11,
    LineStripAdjacencyExt = 11,
    TrianglesAdjacency = 12,
    TrianglesAdjacencyArb = 12,
    TrianglesAdjacencyExt = 12,
    TriangleStripAdjacency = 13,
    TriangleStripAdjacencyArb = 13,
    TriangleStripAdjacencyExt = 13,
    Patches = 14,
    PatchesExt = 14
}
class ShaderProgram
{
    protected _Compiled:boolean;
    protected _ProgramIndexer:number;
    protected _VertexShaderIndexer:number;
    protected _FragmentShaderIndexer:number;
    protected _GeometryShaderIndexer:number;
    protected _TessellationControlIndexer:number;
    protected _TessellationEvaluationIndexer:number;
    protected _ShaderID:string;
    private _VertexShaderCode:string;
    private _FragmentShaderCode:string;
    private _GeometryShaderCode:string;
    private _TessellationControlCode:string;
    private _TessellationEvaluationCode:string;
    protected _Uniforms:ShaderUniformPackage;
    protected _Attributes:ShaderAttributePackage;
    protected _Textures:ShaderTexturePackage;
    public get Compiled():boolean { return this._Compiled; }
    public get ShaderID():string { return this._ShaderID; }
    public set ShaderID(value:string) { this._ShaderID = value; }
    public get VertexShaderCode():string { return this._VertexShaderCode; }
    public get FragmentShaderCode():string { return this._FragmentShaderCode; }
    public get GeometryShaderCode():string { return this._GeometryShaderCode; }
    public get TessellationControlCode():string { return this._TessellationEvaluationCode; }
    public get TessellationEvaluationCode():string { return this._TessellationEvaluationCode; }
    public get Uniforms():ShaderUniformPackage { return this._Uniforms; }
    public get Attributes():ShaderAttributePackage { return this._Attributes; }
    public get Textures():ShaderTexturePackage { return this._Textures; }
    public constructor(Old?:ShaderProgram, ShaderID?:string)
    {
        if(Old != null)
        {
            this._Compiled = Old._Compiled;
            this._ProgramIndexer = Old._ProgramIndexer;
            this._VertexShaderIndexer = Old._VertexShaderIndexer;
            this._FragmentShaderIndexer = Old._FragmentShaderIndexer;
            this._GeometryShaderIndexer = Old._GeometryShaderIndexer;
            this._TessellationControlIndexer = Old._TessellationControlIndexer;
            this._TessellationEvaluationIndexer = Old._TessellationEvaluationIndexer;
            this._ShaderID = Old._ShaderID;
            this._VertexShaderCode = Old._VertexShaderCode;
            this._FragmentShaderCode = Old._FragmentShaderCode;
            this._GeometryShaderCode = Old._GeometryShaderCode;
            this._TessellationControlCode = Old._TessellationControlCode;
            this._TessellationEvaluationCode = Old._TessellationEvaluationCode;
            this._Attributes = Old._Attributes.Copy();
            this._Uniforms = Old._Uniforms.Copy();
            this._Textures = Old._Textures.Copy();
        }
        else
        {
            this._Compiled = false;
            this._ProgramIndexer = -1;
            this._VertexShaderIndexer = -1;
            this._FragmentShaderIndexer = -1;
            this._GeometryShaderIndexer = -1;
            this._TessellationControlIndexer = -1;
            this._TessellationEvaluationIndexer = -1;
            if(ShaderID != null) this._ShaderID = ShaderID;
            else this._ShaderID = "";
            this._Attributes = new ShaderAttributePackage();
            this._Uniforms = new ShaderUniformPackage();
            this._Textures = new ShaderTexturePackage();
        }
    }
    public Copy() : ShaderProgram
    {
        let New:ShaderProgram = new ShaderProgram(this);
        return New;
    }
    protected SetShaderCode(VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TessellationControlCode?:string, TessellationEvaluationCode?:string) : void
    {
        this._VertexShaderCode = VertexShaderCode;
        this._FragmentShaderCode = FragmentShaderCode;
        this._GeometryShaderCode = GeometryShaderCode;
        this._TessellationControlCode = TessellationControlCode;
        this._TessellationEvaluationCode = TessellationEvaluationCode;
    }
    public Activate() { /*Virtual*/ }
    public Draw(DrawMode:GraphicDrawMode, Offset:number) { /*Virtual*/ }
    public Compile(VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TessellationControlCode?:string, TessellationEvaluationCode?:string) : boolean { return false; /*Virtual*/ }
    public ReCompile(VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TessellationControlCode?:string, TessellationEvaluationCode?:string) : boolean { return false; /*Virtual*/ }
}