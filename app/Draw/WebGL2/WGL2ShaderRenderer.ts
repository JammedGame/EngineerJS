export { WGL2ShaderRenderer }

import * as Data from "./../../Data/Data";

import { ShaderRenderer } from "./../ShaderRenderer"
import { WGL2ShaderProgram } from "./WGL2ShaderProgram"
import { WGL2ShaderManager } from "./WGL2ShaderManager"

class WGL2ShaderRenderer extends ShaderRenderer
{
    private _GL:any;
    private _VertexShaderCode:string;
    private _FragmentShaderCode:string;
    public constructor()
    {
        const CANVAS: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        let GL: any = CANVAS.getContext("webgl2") as any;
        super();
        this._GL = GL;
        this._Manager = new WGL2ShaderManager();
        GL.enable(GL.DEPTH_TEST);
        GL.enable(GL.BLEND);
        this._VertexShaderCode = "";
        this._FragmentShaderCode = "";
        Data.Reader.Read("./GLSL/Vertex.shader", this.SetVertexShader.bind(this));
        Data.Reader.Read("./GLSL/Fragment.shader", this.SetFragmentShader.bind(this));
    }
    private SetVertexShader(Code:string):void
    {
        this._VertexShaderCode = Code;
        if(this._FragmentShaderCode != "") this.SetShaders();
    }
    private SetFragmentShader(Code:string):void
    {
        this._FragmentShaderCode = Code;
        if(this._VertexShaderCode != "") this.SetShaders();
    }
    private SetShaders():void
    {
        this.SetUpShader("Default", [this._VertexShaderCode, this._FragmentShaderCode, null, null, null ]);
    }
    public SetViewport(Width:number, Height:number) : void
    {
        // Override
        this._GL.viewport(0,0,Width,Height);
    }
    public Clear() : void
    {
        // Override
        this._GL.clear(this._GL.COLOR_BUFFER_BIT || this._GL.DEPTH_BUFFER_BIT);
    }
    public ClearColor(Color:number[]) : void
    {
        // Override
        this._GL.clearColor(Color[0], Color[1], Color[2], Color[3]);
    }
    public Toggle(Preference:any, Value:boolean) : void
    {
        let GL = this._GL;
        // Override
        if(Preference == GL.DEPTH)
        {
            if (Value) GL.Enable(GL.DEPTH);
            else GL.Disable(GL.DEPTH);
        }
    }
}