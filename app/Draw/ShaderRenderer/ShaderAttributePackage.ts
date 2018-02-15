export  { ShaderAttributePackage };

import * as Util from "./../../Util/Util";

class ShaderAttributePackage
{
    // Abstract
    protected _Activated:boolean;
    protected _DataChanged:boolean;
    protected _AttributesBound:boolean;
    protected _VertexArray:number;
    protected _BufferLines:number;
    protected _BufferLineLength:number;
    protected _Entries:ShaderAttributeEntry[];
    public get BufferLines():number { return this._BufferLines; }
    public set BufferLines(value:number) { this._BufferLines = value; }
    public constructor(Old?:ShaderAttributePackage)
    {
        if(Old != null)
        {
            this._Activated = false;
            this._DataChanged = true;
            this._VertexArray = Old._VertexArray;
            this._BufferLineLength = Old._BufferLineLength;
            this._Entries = [];
            for(let i = 0; i < Old._Entries.length; i++) this._Entries.push(Old._Entries[i].Copy());
        }
        else
        {
            this._Activated = false;
            this._DataChanged = true;
            this._VertexArray = null;
            this._BufferLineLength = 0;
            this._Entries = [];
        }
    }
    public Copy() : ShaderAttributePackage
    {
        return new ShaderAttributePackage(this);
    }
    public SetDefinition(ID:string, Size:number, Type:string) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index != -1) return false;
        let NewEntry = new ShaderAttributeEntry(null, ID, Size, Type);
        this._Entries.push(NewEntry);
        return true;
    }
    public SetData(ID:string, DataSize:number, Data:Float32Array) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index == -1) return false;
        this._Entries[Index].Data = Data;
        this._Entries[Index].DataSize = DataSize;
        this._DataChanged = true;
        return true;
    }
    public DeleteDefinition(ID:string) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index == -1) return false;
        this._Entries.splice(Index, 1);
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
        for(let i = 0; i < this._Entries.length; i++)
        {
            this._Entries[i].Data = null;
            this._Entries[i].DataSize = 0;
        }
    }
    private FindIndex(ID:string):number
    {
        let Index:number = -1;
        for(let i = 0; i < this._Entries.length; i++)
        {
            if(this._Entries[i].ID == ID) Index = i;
        }
        return Index;
    }
    public Activate(Program_Indexer:number) : boolean { return false; /*Virtual*/ }
    protected CreateBuffer(BufferData:Float32Array) : any { return null; /*Virtual*/ }
}
class ShaderAttributeEntry
{
    private _Size:number;
    private _DataSize:number;
    private _ID:string;
    private _Type:string;
    private _Data:any;
    private _Buffer:any;
    public get Size():number { return this._Size; }
    public set Size(value:number) { this._Size = value; }
    public get DataSize():number { return this._DataSize; }
    public set DataSize(value:number) { this._DataSize = value; }
    public get ID():string { return this._ID; }
    public set ID(value:string) { this._ID = value; }
    public get Type():string { return this._Type; }
    public set Type(value:string) { this._Type = value; }
    public get Data():any { return this._Data; }
    public set Data(value:any) { this._Data = value; }
    public get Buffer():any { return this._Buffer; }
    public set Buffer(value:any) { this._Buffer = value; }
    public constructor(Old?:ShaderAttributeEntry, ID?:string, Size?:number, Type?:string)
    {
        if(Old != null)
        {
            this._Size = Old._Size;
            this._DataSize = Old._DataSize;
            this._ID = Old._ID;
            this._Type = Old._Type;
            this._Data = Old._Data.slice(0);
            this._Buffer = null;
        }
        else
        {
            if(Size) this._Size = Size;
            else this._Size = 0;
            if(ID) this._ID = ID;
            else this._ID = "";
            if(Type) this._Type = Type;
            else this._Type = "none";
            this._DataSize = 0;
            this._Data = null;
            this._Buffer = null;
        }
    }
    public Copy() : ShaderAttributeEntry
    {
        return new ShaderAttributeEntry(this);
    }
}