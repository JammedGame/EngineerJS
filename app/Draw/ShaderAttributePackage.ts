export  { ShaderAttributePackage };

import * as Util from "./../Util/Util";

class ShaderAttributePackage
{
    protected _BufferExists:boolean;
    protected _DataChanged:boolean;
    protected _AttributesBound:boolean;
    protected _BufferLines:number;
    protected _BufferLineLength:number;
    protected _VertexArrayIndexer:number;
    protected _VertexBufferIndexer:number;
    protected _ManualBufferLines:number;
    protected _ManualDataArray:ArrayBuffer;
    protected _Size:number[];
    protected _DataSize:number[];
    protected _ID:string[];
    protected _Type:string[];
    protected _Data:ArrayBuffer[];
    public get BufferExists():boolean { return this._BufferExists; }
    public set BufferExists(value:boolean) { this._BufferExists = value; }
    public get BufferLines():number { return this._BufferLines; }
    public set BufferLines(value:number) { this._BufferLines = value; }
    public constructor(Old?:ShaderAttributePackage)
    {
        if(Old != null)
        {
            this._DataChanged = true;
            this._AttributesBound = Old._AttributesBound;
            this._BufferLines = Old._BufferLines;
            this._BufferLineLength = Old._BufferLineLength;
            this._VertexArrayIndexer = Old._VertexArrayIndexer;
            this._VertexBufferIndexer = Old._VertexBufferIndexer;
            this._ManualBufferLines = Old._ManualBufferLines;
            this._ManualDataArray = new ArrayBuffer(Old._ManualDataArray.byteLength);
            this._ManualDataArray = Old._ManualDataArray.slice(0);
            this._Size = [];
            this._DataSize = [];
            this._ID = [];
            this._Type = [];
            this._Data = [];
        }
        else
        {
            this._DataChanged = true;
            this._Size = [];
            this._DataSize = [];
            this._ID = [];
            this._Type = [];
            this._Data = [];
        }
    }
    public Copy() : ShaderAttributePackage
    {
        let New:ShaderAttributePackage = new ShaderAttributePackage(this);
        return New;
    }
    public SetDefinition(ID:string, Size:number, Type:string) : boolean
    {
        // Virtual
        if(this._AttributesBound) return false;
        let Index:number = this.FindIndex(ID);
        if(Index != -1) return false;
        this._ID.push(ID);
        this._Type.push(Type);
        this._Size.push(Size);
        this._DataSize.push(0);
        this._Data.push(null);
        return true;
    }
    public SetData(ID:string, DataSize:number, Data:ArrayBuffer) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index == -1) return false;
        this._Data[Index] = Data;
        this._DataSize[Index] = DataSize;
        this._DataChanged = true;
        return true;
    }
    public DeleteDefinition(ID:string) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index == -1) return false;
        this._ID.splice(Index, 1);
        this._Type.splice(Index, 1);
        this._Size.splice(Index, 1);
        this._DataSize.splice(Index, 1);
        this._Data.splice(Index, 1);
        return true;
    }
    public Exists(ID:string) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        return Index != -1;
    }
    public ClearData() : void
    {
        // Virtual
        this._AttributesBound = false;
        for(let i = 0; i < this._ID.length; i++)
        {
            this._Data[i] = null;
            this._DataSize[i] = 0;
        }
    }
    public SetDataManually(BufferLines:number, Data:any)
    {
        // Virtual
        this._ManualBufferLines = BufferLines;
        this._ManualDataArray = Data;
    }
    protected ActivateAttributesWithManualBuffer(ProgramIndexer:number) : boolean  { return false; /*Virtual*/ }
    public Bind(Program_Indexer:number) : void { /*Virtual*/ }
    public Activate(Program_Indexer:number) : boolean { return false; /*Virtual*/ }
    private FindIndex(ID:string):number
    {
        let Index:number = -1;
        for(let i = 0; i < this._ID.length; i++)
        {
            if(this._ID[i] == ID) Index = i;
        }
        return Index;
    }
}