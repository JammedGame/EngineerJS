export { SpriteSetCollection }

import * as Data from "./../../Data/Data";

import { SpriteSet } from "./SpriteSet";
import { ImageCollection } from "./ImageCollection";

class SpriteSetCollection extends ImageCollection
{
    private _SpriteSets:SpriteSet[];
    public get SpriteSets():SpriteSet[] { return this._SpriteSets; }
    public set SpriteSets(value:SpriteSet[]) { this._SpriteSets = value; }
    public get Images():string[] { return this.PackImages(); }
    public constructor(Old?:SpriteSetCollection, SpriteSets?:SpriteSet[])
    {
        super(Old);
        this._SpriteSets = [];
        if(Old != null)
        {
            for(let i in Old._SpriteSets) this._SpriteSets.push(Old._SpriteSets[i].Copy());
        }
        else
        {
            if(SpriteSets) this._SpriteSets = SpriteSets;
        }
    }
    public Copy() : SpriteSetCollection
    {
        return new SpriteSetCollection(this);
    }
    public PackImages() : string[]
    {
        let Images:string[] = [];
        for(let i in this._SpriteSets)
        {
            for(let j in this._SpriteSets[i].Images)
            {
                Images.push(this._SpriteSets[i].Images[j]);
            }
        }
        return Images;
    }
    public Serialize() : any
    {
        let SSC = super.Serialize();
        SSC.SpriteSets = [];
        for(let i in this._SpriteSets)
        {
            SSC.SpriteSets.push(this._SpriteSets[i].Serialize());
        }
        return SSC;
    }
    public Deserialize(Data:any) : void
    {
        super.Deserialize(Data);
        for(let i in Data.SpriteSets)
        {
            let SS:SpriteSet = new SpriteSet();
            SS.Deserialize(Data.SpriteSets[i]);
            this._SpriteSets.push(SS);
        }
    }
}