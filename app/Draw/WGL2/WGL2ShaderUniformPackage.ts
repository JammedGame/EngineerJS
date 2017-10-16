export { WGL2ShaderUniformPackage }

import * as Math from "./../../Mathematics/Mathematics";

import { ShaderUniformPackage } from "./../ShaderRenderer/ShaderUniformPackage"

class WGL2ShaderUniformPackage extends ShaderUniformPackage
{
    private _GL:any;
    public constructor(Old?:WGL2ShaderUniformPackage)
    {
        const CANVAS: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        let GL: any = CANVAS.getContext("webgl2") as any;
        if(Old != null)
        {
            super(Old);
            this._GL = GL;
        }
        else
        {
            super();
            this._GL = GL;
        }
    }
    public Activate(ProgramIndexer:number) : boolean
    {
        let GL = this._GL;
        // Override
        let SomeFailed:boolean = false;
        let CurrentUniformLocation:number = -1;
        for (let i = 0; i < this._ID.length; i++)
        {
            if (this._Data[i] != null)
            {
                CurrentUniformLocation = GL.getUniformLocation(ProgramIndexer, this._ID[i]);
                if (CurrentUniformLocation != -1)
                {
                    if (this._Type[i] == "bool")
                    {
                        GL.uniform1i(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "int")
                    {
                        GL.uniform1i(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "float")
                    {
                        GL.uniform1f(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "vec2")
                    {
                        GL.uniform2fv(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "vec3")
                    {
                        GL.uniform3fv(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "vec4")
                    {
                        GL.uniform4fv(CurrentUniformLocation, this._Data[i]);
                    }
                    else if (this._Type[i] == "mat4")
                    {
                        GL.uniformMatrix4fv(CurrentUniformLocation, false, this._Data[i]);
                    }
                    else SomeFailed = true;
                }
            }
        }
        return !SomeFailed;
    }
}