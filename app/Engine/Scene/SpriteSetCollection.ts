export { SpriteSetCollection }

import * as Data from "./../../Data/Data";

import { SpriteSet } from "./SpriteSet";

class SpriteSetCollection
{
    private _ID:string;
    private _Origin:string;
    private _SpriteSets:SpriteSet[];
    public get ID():string { return this._ID; }
    public get Origin():string { return this._Origin; }
    public get SpriteSets():SpriteSet[] { return this._SpriteSets; }
    public set SpriteSets(value:SpriteSet[]) { this._SpriteSets = value; }
    public constructor(Old?:SpriteSetCollection, SpriteSets?:SpriteSet[])
    {
        this._SpriteSets = [];
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Origin = Old._Origin;
            for(let i in Old._SpriteSets) this._SpriteSets.push(Old._SpriteSets[i].Copy());
        }
        else
        {
            this._ID = Data.Uuid.Create();
            this._Origin = this._ID;
            if(SpriteSets) this._SpriteSets = SpriteSets;
        }
    }
    public Copy() : SpriteSetCollection
    {
        return new SpriteSetCollection(this);
    }
    public Serialize() : any
    {
        let SSC =
        {
            ID: this._ID,
            Origin: this._Origin,
            SpriteSets: []
        };
        for(let i in this._SpriteSets)
        {
            SSC.SpriteSets.push(this._SpriteSets[i].Serialize());
        }
        return SSC;
    }
    public Deserialize(Data:any) : void
    {
        this._Origin = Data.Origin;
        for(let i in Data.SpriteSets)
        {
            let SS:SpriteSet = new SpriteSet();
            SS.Deserialize(Data.SpriteSets[i]);
            this._SpriteSets.push(SS);
        }
    }
}