export  { Sprite };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Sprite extends DrawObject
{
    private _Modified:boolean;
    private _CurrentIndex:number;
    private _CurrentSpriteSet:number;
    private _SpriteSets:SpriteSet[];
    private _SubSprites:Sprite[];
    public constructor(Old?:Sprite)
    {
        if(Old != null)
        {
            super();
            this._CurrentIndex = 0;
            this._CurrentSpriteSet = 0;
            this.Type = DrawObjectType.Sprite;
            this._SpriteSets = Old._SpriteSets;
            this._SubSprites = [];
            for(let i = 0; i < Old._SubSprites.length; i++) this._SubSprites.push(Old._SubSprites[i].Copy());
            this.Trans.Scale = Old.Trans.Scale.Copy();
        }
        else
        {
            super(Old);
            this._CurrentIndex = 0;
            this._CurrentSpriteSet = 0;
            this.Type = DrawObjectType.Sprite;
            this._SpriteSets = [];
            this._SubSprites = [];
            this.Trans.Scale = new Math.Vertex(100, 100, 1);
        }
    }
    public Copy() : Sprite
    {
        let New:Sprite = new Sprite(this);
        return New;
    }
    public CollectiveList() : string[]
    {
        let List:string[] = [];
        for(let i = 0; i < this._SpriteSets.length; i++)
        {
            for(let j = 0; j < this._SpriteSets[i].Sprites.length; j++)
            {
                List.push(this._SpriteSets[i].Sprites[j]);
            }
        }
        return List;
    }
    public RaiseIndex() : void
    {
        this._CurrentIndex++;
        if (this._SpriteSets.length <= 0) this._CurrentIndex = -1;
        else if (this._CurrentIndex >= this._SpriteSets[this._CurrentSpriteSet].Sprites.length) this._CurrentIndex = 0;
    }
    public SetSpriteSet(Index:number) : void
    {
        if (Index >= this._SpriteSets.length) return;
        this._CurrentSpriteSet = Index;
        this._CurrentIndex = 0;
    }
    public UpdateSpriteSet(Index:number) : void
    {
        if(Index != this._CurrentSpriteSet) this.SetSpriteSet(Index);
    }
    public SetSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this._SpriteSets.length; i++)
        {
            if(this._SpriteSets[i].Name == Name) this.SetSpriteSet(i);
        }
    }
    public UpdateSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this._SpriteSets.length; i++)
        {
            if(this._SpriteSets[i].Name == Name) this.UpdateSpriteSet(i);
        }
    }
}
class SpriteSet
{
    private _ID:string;
    private _Name:string;
    private _Sprites:string[];
    public get ID():string { return this._ID; }
    public get Name():string { return this._Name; }
    public set Name(value:string) { this._Name = value; }
    public get Sprites():string[] { return this._Sprites; }
    public set Sprites(value:string[]) { this._Sprites = value; }
    public constructor(Old?:SpriteSet, Name?:string, Image?:string)
    {
        if(Old != null)
        {
            this._ID = Data.Uuid.Create();
            this._Name = Old._Name;
            this._Sprites = Old._Sprites;
        }
        else
        {
            this._ID = Data.Uuid.Create();
            if(Name != null) this._Name = Name;
            else this._Name = "";
            this._Sprites = [];
            if(Image != null) this._Sprites.push(Image);
        }
    }
    public Copy() : SpriteSet
    {
        let New:SpriteSet = new SpriteSet(this);
        return New;
    }
}