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
    protected ActivateAttributesWithManualBuffer(ProgramIndexer:number) : boolean
    {
        let GL = this._GL;
        // Override
        let CurrentOffset:number = 0;
        GL.genVertexArrays(1, this._VertexArrayIndexer);
        GL.bindVertexArray(this._VertexArrayIndexer);
        GL.genBuffers(1, this._VertexBufferIndexer);
        GL.bindBuffer(this._GL.ARRAY_BUFFER, this._VertexBufferIndexer);
        this._BufferPointer = this._ManualDataArray;
        GL.bufferData(this._GL.ARRAY_BUFFER, this._BufferPointer, this._GL.STATIC_DRAW);
        let Offset:number = 0;
        this._BufferLines = this._ManualBufferLines;
        let LineLength = this._BufferLineLength / this._BufferLines;
        for(let i = 0; i < this._ID.length; i++)
        {
            let Attribute:number = i;
            let AttributeSize:number = this._Size[i] / 4;
            GL.enableVertexAttribArray(Attribute);
            GL.vertexAttribPointer(Attribute, AttributeSize, GL.FLOAT, false, this._BufferLineLength, Offset);
            Offset += this._Size[i];
            CurrentOffset += this._Size[i];
        }
        this._ManualBufferLines = 0;
        return true;
    }
    public Bind(ProgramIndexer:number) : void
    {
        let GL = this._GL;
        // Override
        this._BufferLineLength = 0;
        for (let i = 0; i < this._ID.length; i++)
        {
            GL.bindAttribLocation(ProgramIndexer, i, this._ID[i]);
            this._BufferLineLength += this._Size[i];
        }
    }
    public ClearData() : void
    {
        let GL = this._GL;
        // Override
        this._BufferExists = false;
        GL.deleteBuffers(1, this._VertexBufferIndexer);
        GL.deleteVertexArrays(1, this._VertexArrayIndexer);
        super.ClearData();
    }
    public Activate(ProgramIndexer:number) : boolean
    {
        let GL = this._GL;
        // Override
        if(!this._DataChanged)
        {
            GL.bindVertexArray(this._VertexArrayIndexer);
            GL.bindBuffer(GL.ARRAY_BUFFER, this._VertexBufferIndexer);
            return true;
        }
        GL.deleteBuffers(1, this._VertexBufferIndexer);
        GL.deleteVertexArrays(1, this._VertexArrayIndexer);
        if(this._ManualBufferLines > 0) return this.ActivateAttributesWithManualBuffer(ProgramIndexer);
        let CurrentOffset:number = 0;
        let Data:ArrayBuffer;
        let ByteTotalLength:number = 0;
        let ByteLineSize:number = 0;
        let BiggestRatioIndex:number = 0;
        let BiggestRatioSize:number = 0;
        for (let i = 0; i < this._ID.length; i++)
        {
            let DataSizeToAttributeSize:number = this._DataSize[i] / this._Size[i];
            if (DataSizeToAttributeSize > BiggestRatioSize)
            {
                BiggestRatioSize = DataSizeToAttributeSize;
                BiggestRatioIndex = i;
            }
            ByteLineSize += this._Size[i];
        }
        ByteTotalLength = BiggestRatioSize * ByteLineSize;
        Data = new ArrayBuffer(ByteTotalLength);
        let CurrentDataOffset:number = 0;
        for (let i = 0; i < BiggestRatioSize; i++)
        {
            CurrentDataOffset = 0;
            for (let j = 0; j < this._ID.length; j++)
            {
                for (let k = 0; k < this._Size[j]; k++)
                    Data[i * ByteLineSize + CurrentDataOffset + k] = (this._Data[j])[i * this._Size[j] + k];
                CurrentDataOffset += this._Size[j];
            }
        }
        this._BufferLines = BiggestRatioSize;
        if(this._BufferLines == 0) return false;
        GL.genVertexArrays(1, this._VertexArrayIndexer);
        GL.bindVertexArray(this._VertexArrayIndexer);
        GL.genBuffers(1, this._VertexBufferIndexer);
        GL.bindBuffer(this._GL.ARRAY_BUFFER, this._VertexBufferIndexer);
        GL.bufferData(GL.ARRAY_BUFFER, ByteTotalLength, Data, GL.STATIC_DRAW);
        let Attribute:number = 0;
        let Offset:number = 0;
        for (let i = 0; i < this._ID.length; i++)
        {
            Attribute = i;
            let AtributeSize:number = this._Size[i] / 4;
            let LineLength:number = this._BufferLineLength / this._BufferLines;
            GL.EnableVertexAttribArray(Attribute);
            GL.VertexAttribPointer(Attribute, AtributeSize, GL.FLOAT, false, this._BufferLineLength, Offset);
            Offset += this._Size[i];
            CurrentOffset += this._Size[i];
        }
        delete(this._BufferPointer);
        this._BufferExists = true;
        this._DataChanged = false;
        return true;
    }
}