export  { ShaderManager };

import { GraphicDrawMode, ShaderProgram } from "./ShaderProgram";

class ShaderManager
{
    protected _ActiveShaderID:string;
    protected _DrawLineOffset:number;
    protected _DrawMode:GraphicDrawMode;
    protected _Shader: { [key: string]:ShaderProgram; };
    public get Active():ShaderProgram { return this._Shader[this._ActiveShaderID]; }
    public constructor(Old?:ShaderManager)
    {
        if(Old != null)
        {
            this._ActiveShaderID = "";
            this._Shader = {};
            this._DrawLineOffset = Old._DrawLineOffset;
        }
        else
        {
            this._ActiveShaderID = "";
            this._Shader = {}
            this._DrawLineOffset = 0;
        }
    }
    public Copy() : ShaderManager
    {
        // Virtual
        let New:ShaderManager = new ShaderManager(this);
        return New;
    }
    public AddShader(ID:string) : boolean { return false; /*Virtual*/ }
    public CompileShader(ID:string, VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TessellationControlCode?:string, TessellationEvaluationCode?:string) : boolean
    {
        // Virtual
        if(this._Shader[ID] == null) return false;
        return this._Shader[ID].Compile(VertexShaderCode, FragmentShaderCode, GeometryShaderCode, TessellationControlCode, TessellationEvaluationCode);
    }
    public DeleteShader(ID:string) : boolean
    {
        // Virtual
        if(this._Shader[ID] == null) return false;
        delete(this._Shader[ID]);
        return true;
    }
    public ShaderExists(ID:string) : boolean
    {
        // Virtual
        if(this._Shader[ID] == null) return false;
        return true;
    }
    public ActivateShader(ID:string) : boolean
    {
        // Virtual
        if(this._Shader[ID] == null) return false;
        this._ActiveShaderID = ID;
        return true;
    }
    public SetDrawMode(DrawMode:GraphicDrawMode) : void
    {
        this._DrawMode = DrawMode;
    }
    public Draw() : void
    {
        // Virtual
        this._Shader[this._ActiveShaderID].Draw(this._DrawMode, this._DrawLineOffset);
    }
}