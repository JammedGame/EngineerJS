export { LitSprite }

import { SpriteType, Sprite, SpriteSet } from "./Sprite";

class LitSprite extends Sprite
{
    private _NormalSets:SpriteSet[];
    public get NormalSets():SpriteSet[] { return this._NormalSets; }
    public set NormalSets(value:SpriteSet[]) { this._NormalSets = value; }
    public constructor(Old?:LitSprite)
    {
        super(Old);
        this.SpriteType = SpriteType.Lit;
        if(Old != null)
        {
            this._NormalSets = Old._NormalSets;
        }
        else
        {
            this._NormalSets = [];
        }
    }
}