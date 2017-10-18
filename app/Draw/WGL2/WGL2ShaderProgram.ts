export { WGL2ShaderProgram }

import { ShaderProgram } from "./../ShaderRenderer/ShaderProgram"
import { WGL2ShaderAttributePackage } from "./WGL2ShaderAttributePackage"
import { WGL2ShaderUniformPackage } from "./WGL2ShaderUniformPackage"
import { WGL2ShaderTexturePackage } from "./WGL2ShaderTexturePackage"

class WGL2ShaderProgram extends ShaderProgram
{
    private _GL:any;
    public constructor(Old:WGL2ShaderProgram, Canvas:HTMLCanvasElement)
    {
        let GL: any = Canvas.getContext("webgl2") as any;
        if(Old != null)
        {
            super(Old);
            this._GL = GL;
            this._Attributes = Old._Attributes.Copy();
            this._Uniforms = Old._Uniforms.Copy();
            this._Textures = Old._Textures.Copy();
        }
        else
        {
            super();
            this._GL = GL;
            this._Attributes = new WGL2ShaderAttributePackage();
            this._Uniforms = new WGL2ShaderUniformPackage();
            this._Textures = new WGL2ShaderTexturePackage();
        }
    }
    private CompileShader(Type:any, ShaderCode:string)
    {
        let GL = this._GL;
        let Shader = GL.createShader(Type);
        GL.shaderSource(Shader, ShaderCode);
        GL.compileShader(Shader);
        var Log = GL.getShaderInfoLog(Shader);
        if (Log) { console.log(Log); }
        return Shader;
    }
    public Compile(VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TesselationControlCode?:string, TesselationEvaluationCode?:string) : boolean
    {
        // Override
        let GL = this._GL;
        if(this._ProgramIndexer != -1) GL.deleteProgram(this._ProgramIndexer);
        this._ProgramIndexer = GL.createProgram();
        this._VertexShaderIndexer = this.CompileShader(GL.VERTEX_SHADER, VertexShaderCode);
        this._FragmentShaderIndexer = this.CompileShader(GL.FRAGMENT_SHADER, FragmentShaderCode);
        GL.attachShader(this._ProgramIndexer, this._VertexShaderIndexer);
        GL.deleteShader(this._VertexShaderIndexer);
        GL.attachShader(this._ProgramIndexer, this._FragmentShaderIndexer);
        GL.deleteShader(this._FragmentShaderIndexer);
        GL.linkProgram(this._ProgramIndexer);
        var Log = GL.getProgramInfoLog(this._ProgramIndexer);
        if (Log) { console.log(Log); }
        this.SetShaderCode(VertexShaderCode, FragmentShaderCode);
        this._Compiled = true;
        return true;
    }
    public Activate() : void
    {
        // Override
        if(this._Compiled) this._GL.useProgram(this._ProgramIndexer);
    }
    public Draw(DrawMode:any, Offset:number) : void
    {
        // Override
        let GL = this._GL;
        if(this._Compiled)
        {
            GL.useProgram(this._ProgramIndexer);
            if (!this._Uniforms.Activate(this._ProgramIndexer)) return;
            if (!this._Attributes.Activate(this._ProgramIndexer)) return;
            if (!this._Textures.Activate()) return;
            GL.drawArrays(DrawMode, Offset, this._Attributes.BufferLines);
        }
    }
}