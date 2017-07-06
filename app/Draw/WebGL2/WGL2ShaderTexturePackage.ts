export { WGL2ShaderTexturePackage }

import { ShaderTexturePackage } from "./../ShaderTexturePackage"

class WGL2ShaderTexturePackage extends ShaderTexturePackage
{
    private _GL:any;
    private _TexturesPointer:number;
    private _BufferPointer:ArrayBuffer;
    public constructor(Old?:WGL2ShaderTexturePackage)
    {
        const CANVAS: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        let GL: any = CANVAS.getContext("webgl2") as any;
        if(Old != null)
        {
            super(Old);
            this._BufferPointer = Old._BufferPointer;
            this._GL = GL;
        }
        else
        {
            super();
            this._GL = GL;
        }
    }
    public Activate() : boolean
    {
        // Override
        return true;
        // Yet to implement
    }
    public ClearData() : void
    {
        // Override
        this._Active = false;
        this._GL.deleteTexture(this._TexturesPointer);
        this._TexturesPointer = 0;
        this._Textures = null;
    }
}