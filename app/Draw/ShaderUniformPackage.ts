export  { ShaderUniformPackage };

class ShaderUniformPackage
{
    protected _Size:number[];
    protected _ID:string[];
    protected _Type:string[];
    protected _Data:any[];
    public constructor(Old?:ShaderUniformPackage)
    {
        if(Old != null)
        {
            this._Size = [];
            this._ID = [];
            this._Type = [];
            this._Data = [];
        }
        else
        {
            this._Size = [];
            this._ID = [];
            this._Type = [];
            this._Data = [];
        }
    }
    public Copy() : ShaderUniformPackage
    {
        let New:ShaderUniformPackage = new ShaderUniformPackage(this);
        return New;
    }
    public SetDefinition(ID:string, Size:number, Type:string) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index != -1) return false;
        this._ID.push(ID);
        this._Type.push(Type);
        this._Size.push(Size);
        this._Data.push(null);
        return true;
    }
    public SetData(ID:string, Data:any) : boolean
    {
        // Virtual
        let Index:number = this.FindIndex(ID);
        if(Index == -1) return false;
        this._Data[Index] = Data;
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
        for(let i = 0; i < this._ID.length; i++)
        {
            this._Data[i] = null;
        }
    }
    public Update(Package:ShaderUniformPackage) : void
    {
        // Virtual
        for(let i = 0; i < Package._ID.length; i++)
        {
            if(this.Exists(Package._ID[i])) this.SetData(Package._ID[i], Package._Data[i]);
            else
            {
                this.SetDefinition(Package._ID[i], Package._Size[i], Package._Type[i]);
                this.SetData(Package._ID[i], Package._Data[i]);
            }
        }
    }
    public Activate(Program_Indexer:number) : boolean { return true; /*Virtual*/ }
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