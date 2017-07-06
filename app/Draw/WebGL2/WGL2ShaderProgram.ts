export { WGL2ShaderProgram }

import { ShaderProgram } from "./../ShaderProgram"
import { WGL2ShaderAttributePackage } from "./WGL2ShaderAttributePackage"
import { WGL2ShaderUniformPackage } from "./WGL2ShaderUniformPackage"
import { WGL2ShaderTexturePackage } from "./WGL2ShaderTexturePackage"

class WGL2ShaderProgram extends ShaderProgram
{
    private _GL:any;
    public constructor(Old?:WGL2ShaderProgram)
    {
        const CANVAS: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        let GL: any = CANVAS.getContext("webgl2") as any;
        if(Old != null)
        {
            super(Old);
            this._Attributes = (<WGL2ShaderAttributePackage>Old._Attributes).Copy();
            this._Uniforms = (<WGL2ShaderUniformPackage>Old._Uniforms).Copy();
            this._Textures = (<WGL2ShaderTexturePackage>Old._Textures).Copy();
        }
        else
        {
            super();
            this._Attributes = new WGL2ShaderAttributePackage();
            this._Uniforms = new WGL2ShaderUniformPackage();
            this._Textures = new WGL2ShaderTexturePackage();
        }
    }
    public Compile(VertexShaderCode:string, FragmentShaderCode:string, GeometryShaderCode?:string, TesselationControlCode?:string, TesselationEvaluationCode?:string) : boolean
    {
        let GL = this._GL;
        // Override
        GL.deleteProgram(this._ProgramIndexer);
        this._ProgramIndexer = GL.createProgram();
        this._VertexShaderIndexer = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(this._VertexShaderIndexer, VertexShaderCode);
        GL.compileShader(this._VertexShaderIndexer);
        this._FragmentShaderIndexer = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(this._FragmentShaderIndexer, FragmentShaderCode);
        GL.compileShader(this._FragmentShaderIndexer);
        GL.attachShader(this._ProgramIndexer, this._VertexShaderIndexer);
        GL.deleteShader(this._VertexShaderIndexer);
        GL.attachShader(this._ProgramIndexer, this._FragmentShaderIndexer);
        GL.deleteShader(this._FragmentShaderIndexer);
        GL.linkProgram(this._ProgramIndexer);
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
        let GL = this._GL;
        // Override
        if(this._Compiled)
        {
            GL.useProgram(this._ProgramIndexer);
            if (!this._Uniforms.Activate(this._ProgramIndexer)) return;
            if (!this._Attributes.Activate(this._ProgramIndexer)) return;
            if (!this._Textures.Activate()) return;
            GL.drawArrays(DrawMode, Offset, this._Attributes.BufferLines);
            GL.useProgram(0);
        }
    }
}