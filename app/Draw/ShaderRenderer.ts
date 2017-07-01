export  { ShaderRenderer };

import * as Math from "./../Mathematics/Mathematics";

class ShaderRenderer
{
    private _PushedID:string;
    private _GridSize:number;
    private _GridVertices:any;
    private _SpriteVertices:any;
    private _SpriteUV:any;
    public constructor(Old?:ShaderRenderer)
    {
        if(Old != null)
        {
        }
        else
        {
        }
    }
    public Copy() : ShaderRenderer
    {
        let New:ShaderRenderer = new ShaderRenderer(this);
        return New;
    }
}