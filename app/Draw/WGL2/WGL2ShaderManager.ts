export { WGL2ShaderManager }

import { ShaderManager } from "./../ShaderRenderer/ShaderManager";
import { WGL2ShaderProgram } from "./WGL2ShaderProgram";

class WGL2ShaderManager extends ShaderManager
{
    private _Canvas:HTMLCanvasElement;
    public constructor(Old:WGL2ShaderManager, Canvas:HTMLCanvasElement)
    {
        super(Old);
        this._Canvas = Canvas;
    }
    public AddShader(ID:string) : boolean
    {
        // Override
        if (this._Shader[ID] != null) return false;
        let NewProgram:WGL2ShaderProgram;
        NewProgram = new WGL2ShaderProgram(null, this._Canvas);
        this._Shader[ID] = NewProgram;
        return true;
    }
}