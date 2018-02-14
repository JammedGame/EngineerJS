export { SpriteSet }

import * as Data from "./../../Data/Data";

import { ImageCollection } from "./ImageCollection";

class SpriteSet extends ImageCollection
{
    private _Name:string;
    private _Seed:number;
    private _Sprites:string[];
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Seed():number { return this._Seed; }
    public set Seed(value:number) { this._Seed = value; }
    public constructor(Old?:SpriteSet, Images?:string[], Name?:string)
    {
        super(Old, Images);
        if(Old != null)
        {
            this._Name = Old._Name;
            this._Seed = Old._Seed;
            this._Sprites = Old._Sprites;
        }
        else
        {
            if(Name != null) this._Name = Name;
            else this._Name = "";
            this._Seed = -1;
        }
    }
    public Copy() : SpriteSet
    {
        let New:SpriteSet = new SpriteSet(this);
        return New;
    }
    public Serialize() : any
    {
        // Override
        let SS = super.Serialize();
        SS.Name = this._Name;
        SS.Seed = this._Seed;
        return SS;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._Name = Data.Name;
        this._Seed = Data.Seed;
    } 
}