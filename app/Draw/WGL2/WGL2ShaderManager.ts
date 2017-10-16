export { WGL2ShaderManager }

import { ShaderManager } from "./../ShaderRenderer/ShaderManager";
import { WGL2ShaderProgram } from "./WGL2ShaderProgram";

class WGL2ShaderManager extends ShaderManager
{
    public constructor(Old?:WGL2ShaderManager)
    {
        super(Old);
    }
    public AddShader(ID:string) : boolean
    {
        // Override
        if (this._Shader[ID] != null) return false;
        let NewProgram:WGL2ShaderProgram;
        NewProgram = new WGL2ShaderProgram();
        this._Shader[ID] = NewProgram;
        return true;
    }
}