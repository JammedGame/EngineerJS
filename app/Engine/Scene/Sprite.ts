export  { Sprite, SpriteSet };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { SpriteSet } from "./SpriteSet";
import { SpriteSetCollection } from "./SpriteSetCollection";
import { ImageObject } from "./ImageObject";
import { DrawObject, DrawObjectType } from "./DrawObject";
import { SpriteEventPackage } from "../Events/SpriteEventPackage";

class Sprite extends ImageObject
{
    private _CurrentIndex:number;
    private _CurrentSpriteSet:number;
    private _BackUpSpriteSet:number;
    private _SpriteSets:SpriteSetCollection;
    private _NormalSets:SpriteSetCollection;
    private _SubSprites:Sprite[];
    public get Index() : number { /* Override */ return this.GetIndex(); }
    public get Images() : string[] { /* Override */ return this.GetSprites(this._CurrentSpriteSet); }
    public get NormalMaps() : string[] { /* Override */ return this.GetNormalSprites(this._CurrentSpriteSet); }
    public get BackUpSpriteSet():number { return this._BackUpSpriteSet; }
    public set BackUpSpriteSet(value:number) { this._BackUpSpriteSet = value; }
    public get CurrentIndex():number { return this._CurrentIndex; }
    public get CurrentSpriteSet():number { return this._CurrentSpriteSet; }
    public get Collection():SpriteSetCollection { return this._SpriteSets; }
    public set Collection(value:SpriteSetCollection) { this._SpriteSets = value; }
    public get NormalCollection():SpriteSetCollection { return this._NormalSets; }
    public set NormalCollection(value:SpriteSetCollection) { this._NormalSets = value; }
    public get SpriteSets():SpriteSet[] { return this._SpriteSets.SpriteSets; }
    public set SpriteSets(value:SpriteSet[]) { this._SpriteSets.SpriteSets = value; }
    public get NormalSets():SpriteSet[] { return this._NormalSets.SpriteSets; }
    public set NormalSets(value:SpriteSet[]) { this._NormalSets.SpriteSets = value; }
    public get SubSprites():Sprite[] { return this._SubSprites; }
    public set SubSprites(value:Sprite[]) { this._SubSprites = value; }
    public get Events():SpriteEventPackage { return <SpriteEventPackage>this._Events; }
    public constructor(Old?:Sprite)
    {
        super(Old);
        this.DrawType = DrawObjectType.Sprite;
        this._CurrentIndex = 0;
        this._CurrentSpriteSet = 0;
        this._BackUpSpriteSet = -1;
        if(Old != null)
        {
            this._SpriteSets = Old._SpriteSets;
            this._NormalSets = Old._NormalSets;
            this._SubSprites = [];
            this._SpriteSets = Old._SpriteSets.Copy();
            for(let i = 0; i < Old._SubSprites.length; i++) this._SubSprites.push(Old._SubSprites[i].Copy());
            this.Trans.Scale = Old.Trans.Scale.Copy();
        }
        else
        {
            this._Events = new SpriteEventPackage();
            this._SpriteSets = new SpriteSetCollection();
            this._NormalSets = new SpriteSetCollection();
            this._SubSprites = [];
            this.Trans.Scale = new Math.Vertex(100, 100, 1);
        }
    }
    public Copy() : Sprite
    {
        let New:Sprite = new Sprite(this);
        return New;
    }
    private GetIndex() : number
    {
        // Override
        let Index:number = 0;
        for(let i = 0; i < this._CurrentSpriteSet; i++)
        {
            Index += this._SpriteSets.SpriteSets[i].Images.length;
        }
        Index += this._CurrentIndex;
        return Index;
    }
    public CollectiveList() : string[]
    {
        let List:string[] = [];
        for(let i = 0; i < this._SpriteSets.SpriteSets.length; i++)
        {
            for(let j = 0; j < this._SpriteSets.SpriteSets[i].Images.length; j++)
            {
                List.push(this._SpriteSets.SpriteSets[i].Images[j]);
            }
        }
        return List;
    }
    public RaiseIndex() : void
    {
        this._CurrentIndex++;
        if (this._SpriteSets.SpriteSets.length <= 0) this._CurrentIndex = -1;
        else if (this._CurrentIndex >= this._SpriteSets.SpriteSets[this._CurrentSpriteSet].Images.length)
        {
            this.Events.Invoke("SetComplete", null, {CurrentSpriteSet:this._CurrentSpriteSet, NextSpriteSet:((this._BackUpSpriteSet!=-1)?this._BackUpSpriteSet:this._CurrentSpriteSet)});
            if (this._BackUpSpriteSet != -1)
            {
                this._CurrentSpriteSet = this._BackUpSpriteSet;
                this._BackUpSpriteSet = -1;
            }
            this._CurrentIndex = 0;
        }
    }
    public SetSpriteSet(Index:number) : void
    {
        if (Index >= this._SpriteSets.SpriteSets.length) return;
        this._CurrentSpriteSet = Index;
        this._CurrentIndex = 0;
    }
    public UpdateSpriteSet(Index:number) : void
    {
        if(Index != this._CurrentSpriteSet) this.SetSpriteSet(Index);
    }
    public SetSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this._SpriteSets.SpriteSets.length; i++)
        {
            if(this._SpriteSets.SpriteSets[i].Name == Name) this.SetSpriteSet(i);
        }
    }
    public UpdateSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this._SpriteSets.SpriteSets.length; i++)
        {
            if(this._SpriteSets.SpriteSets[i].Name == Name) this.UpdateSpriteSet(i);
        }
    }
    public GetSprites(Set:number) : string[]
    {
        if(this._SpriteSets.SpriteSets.length == 0) return [];
        return this._SpriteSets.SpriteSets[Set].Images;
    }
    public GetNormalSprites(Set:number) : string[]
    {
        if(this._NormalSets.SpriteSets.length == 0) return [];
        return this._NormalSets.SpriteSets[Set].Images;
    }
    public Serialize() : any
    {
        // Override
        let S = super.Serialize();
        S.Index = this._CurrentSpriteSet;
        S.SpriteSets = this._SpriteSets.Serialize();
        S.NormalSets = this._NormalSets.Serialize();
        S.SubSprites = [];
        for(let i in this._SubSprites)
        {
            S.SubSprites.push(this._SubSprites[i].Serialize());
        }
        return S;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._CurrentSpriteSet = Data.Index;
        this._SpriteSets.Deserialize(Data.SpriteSets);
        this._NormalSets.Deserialize(Data.NormalSets);
        for(let i in Data.SubSprites)
        {
            let SS:Sprite = new Sprite();
            SS.Deserialize(Data.SubSprites[i]);
            this._SubSprites.push(SS);
        }
    }
}