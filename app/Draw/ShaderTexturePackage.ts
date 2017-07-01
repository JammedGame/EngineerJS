export  { ShaderTexturePackage };

class ShaderTexturePackage
{
    protected static _Binded:boolean = false;
    protected static _Index:number = 0;

    protected _Active:boolean;
    protected _Loaded:boolean;
    protected _TexturesNumber:number;
    protected _Textures:any;
    public constructor(Old?:ShaderTexturePackage)
    {
        if(Old != null)
        {
            this._Active = false;
            this._Loaded = false;
            this._TexturesNumber = Old._TexturesNumber;
            this._Textures = Old._Textures;
        }
        else
        {
            this._Active = false;
            this._Loaded = false;
            this._TexturesNumber = 0;
            this._Textures = null;
        }
    }
    public Copy() : ShaderTexturePackage
    {
        let New:ShaderTexturePackage = new ShaderTexturePackage(this);
        return New;
    }
    public SetData(TexturesNumber:number, Textures:any) : void
    {
        // Virtual
        this._Active = false;
        this._Loaded = false;
        this._TexturesNumber = TexturesNumber;
        this._Textures = Textures;
    }
    public ClearData() : void
    {
        // Virtual
        this._TexturesNumber = 0;
        this._Textures = null;
    }
    public Activate() : boolean { return false; /*Virtual*/ }
}