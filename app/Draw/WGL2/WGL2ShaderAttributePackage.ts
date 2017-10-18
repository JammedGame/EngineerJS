export { WGL2ShaderAttributePackage }

import { ShaderAttributePackage } from "./../ShaderRenderer/ShaderAttributePackage"

class WGL2ShaderAttributePackage extends ShaderAttributePackage
{
    private _GL:any;
    private _BufferPointer:ArrayBuffer;
    public constructor(Old?:WGL2ShaderAttributePackage)
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
    public Bind(ProgramIndexer:number) : void
    {
        // Override
        this._BufferLineLength = 0;
        for (let i = 0; i < this._Entries.length; i++)
        {
            this._GL.bindAttribLocation(ProgramIndexer, i, this._Entries[i].ID);
            this._BufferLineLength += this._Entries[i].Size;
        }
        this._AttributesBound = true;
    }
    public ClearData() : void
    {
        // Override
        let GL = this._GL;
        this._Activated = false;
        for(let i = 0; i < this._Entries.length; i++)
        {
            if(!this._Entries[i].Buffer) continue;
            GL.deleteBuffer(this._Entries[i].Buffer);
            this._Entries[i].Buffer = null;
        }
        GL.deleteVertexArray(this._VertexArray);
        super.ClearData();
    }
    protected CreateBuffer(BufferData:Float32Array) : any
    {
        // Override
        let GL = this._GL;
        let NewBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, NewBuffer);
        GL.bufferData(GL.ARRAY_BUFFER, BufferData, GL.STATIC_DRAW);
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
        return NewBuffer;
    }
    public Activate(ProgramIndexer:number) : boolean
    {
        // Override
        let GL = this._GL;
        if(!this._DataChanged)
        {
            GL.bindVertexArray(this._VertexArray);
            return true;
        }
        if(this._Activated)
        {
            this._Activated = false;
            for(let i = 0; i < this._Entries.length; i++)
            {
                if(!this._Entries[i].Buffer) continue;
                GL.deleteBuffer(this._Entries[i].Buffer);
                this._Entries[i].Buffer = null;
            }
            GL.deleteVertexArray(this._VertexArray);
        }
        for(let i = 0; i < this._Entries.length; i++)
        {
            this._Entries[i].Buffer = this.CreateBuffer(this._Entries[i].Data);
        }
        this._VertexArray = GL.createVertexArray();
        GL.bindVertexArray(this._VertexArray);
        let Attribute:number = 0;
        let Offset:number = 0;
        for (let i = 0; i < this._Entries.length; i++)
        {
            Attribute = i;
            let AtributeSize:number = this._Entries[i].Size / 4;
            GL.enableVertexAttribArray(Offset);
            GL.bindBuffer(GL.ARRAY_BUFFER, this._Entries[i].Buffer);
            GL.vertexAttribPointer(Attribute, AtributeSize, GL.FLOAT, false, 0, 0);
            GL.bindBuffer(GL.ARRAY_BUFFER, null);
            Offset += this._Entries[i].Size;
        }
        this._Activated = true;
        this._DataChanged = false;
        return true;
    }
}