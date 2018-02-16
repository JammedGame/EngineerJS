export { WGL2ShaderRenderer }

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { GLSLShaders } from "./Shaders"; 
import { ShaderRenderer } from "./../ShaderRenderer/ShaderRenderer"
import { WGL2ShaderProgram } from "./WGL2ShaderProgram"
import { WGL2ShaderManager } from "./WGL2ShaderManager"

class WGL2ShaderRenderer extends ShaderRenderer
{
    private _GL:any;
    public constructor(Old:WGL2ShaderRenderer, Canvas:HTMLCanvasElement)
    {
        let GL: any = Canvas.getContext("webgl2") as any;
        super(Old, Canvas);
        this._GL = GL;
        if(Old)
        {
            this._Manager = Old._Manager.Copy();
            this._ShaderPool.Vertex["2D"] = GLSLShaders.Vertex2D;
            this._ShaderPool.Fragment["2D"] = GLSLShaders.Fragment2D;
        }
        else
        {
            this._GL = GL;
            this._Manager = new WGL2ShaderManager(null, Canvas);
            //GL.enable(GL.DEPTH_TEST);
            //GL.depthFunc(GL.LESS);
            GL.enable(GL.BLEND);
            this._ShaderPool.Vertex["2D"] = GLSLShaders.Vertex2D;
            this._ShaderPool.Fragment["2D"] = GLSLShaders.Fragment2D;
        }
    }
    public Clear(Color:Math.Color) : void
    {
        // Override
        this.ClearColor(Color.ToArray());
        this._GL.clear(this._GL.COLOR_BUFFER_BIT || this._GL.DEPTH_BUFFER_BIT);
    }
    protected SetViewport(Size:Math.Vertex) : void
    {
        // Override
        this._GL.viewport(0,0,Size.X,Size.Y);
    }
    protected Toggle(Preference:any, Value:boolean) : void
    {
        let GL = this._GL;
        // Override
        if(Preference == GL.DEPTH)
        {
            if (Value) GL.Enable(GL.DEPTH);
            else GL.Disable(GL.DEPTH);
        }
    }
    protected ClearColor(Color:number[]) : void
    {
        // Override
        this._GL.clearColor(Color[0], Color[1], Color[2], Color[3]);
    }
}