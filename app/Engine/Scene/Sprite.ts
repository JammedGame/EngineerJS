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
    private _SubSprites:Sprite[];
    public get Index() : number { /* Override */ return this.GetIndex(); }
    public get Images() : string[] { /* Override */ return this.Collection.Images }
    public get NormalMaps() : string[] { /* Override */ return this.NormalCollection.Images }
    public get SpecularMaps() : string[] { /* Override */ return this.SpecularCollection.Images }
    public get BackUpSpriteSet():number { return this._BackUpSpriteSet; }
    public set BackUpSpriteSet(value:number) { this._BackUpSpriteSet = value; }
    public get CurrentIndex():number { return this._CurrentIndex; }
    public get CurrentSpriteSet():number { return this._CurrentSpriteSet; }
    public get Collection():SpriteSetCollection { return <SpriteSetCollection>this._Collection; }
    public set Collection(value:SpriteSetCollection) { this._Collection = value; }
    public get NormalCollection():SpriteSetCollection { return <SpriteSetCollection>this._NormalCollection; }
    public set NormalCollection(value:SpriteSetCollection) { this._NormalCollection = value; }
    public get SpecularCollection():SpriteSetCollection { return <SpriteSetCollection>this._SpecularCollection; }
    public set SpecularCollection(value:SpriteSetCollection) { this._SpecularCollection = value; }
    public get SpriteSets():SpriteSet[] { return (<SpriteSetCollection>this._Collection).SpriteSets; }
    public set SpriteSets(value:SpriteSet[]) { (<SpriteSetCollection>this._Collection).SpriteSets = value; }
    public get NormalSets():SpriteSet[] { return (<SpriteSetCollection>this._NormalCollection).SpriteSets; }
    public set NormalSets(value:SpriteSet[]) { (<SpriteSetCollection>this._NormalCollection).SpriteSets = value; }
    public get SpecularSets():SpriteSet[] { return (<SpriteSetCollection>this._SpecularCollection).SpriteSets; }
    public set SpecularSets(value:SpriteSet[]) { (<SpriteSetCollection>this._SpecularCollection).SpriteSets = value; }
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
            this._SubSprites = [];
            for(let i = 0; i < Old._SubSprites.length; i++) this._SubSprites.push(Old._SubSprites[i].Copy());
            this.Trans.Scale = Old.Trans.Scale.Copy();
        }
        else
        {
            this._Events = new SpriteEventPackage();
            this._SubSprites = [];
            this.Trans.Scale = new Math.Vertex(100, 100, 1);
            this._Collection = new SpriteSetCollection();
            this._NormalCollection = new SpriteSetCollection();
            this._SpecularCollection = new SpriteSetCollection();
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
            Index += this.SpriteSets[i].Images.length;
        }
        Index += this._CurrentIndex;
        return Index;
    }
    public CollectiveList() : string[]
    {
        let List:string[] = [];
        for(let i = 0; i < this.SpriteSets.length; i++)
        {
            for(let j = 0; j < this.SpriteSets[i].Images.length; j++)
            {
                List.push(this.SpriteSets[i].Images[j]);
            }
        }
        return List;
    }
    public RaiseIndex() : void
    {
        this._CurrentIndex++;
        if (this.SpriteSets.length <= 0) this._CurrentIndex = -1;
        else if (this._CurrentIndex >= this.SpriteSets[this._CurrentSpriteSet].Images.length)
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
        if (Index >= this.SpriteSets.length) return;
        this._CurrentSpriteSet = Index;
        this._CurrentIndex = 0;
    }
    public UpdateSpriteSet(Index:number) : void
    {
        if(Index != this._CurrentSpriteSet) this.SetSpriteSet(Index);
    }
    public SetSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this.SpriteSets.length; i++)
        {
            if(this.SpriteSets[i].Name == Name) this.SetSpriteSet(i);
        }
    }
    public UpdateSpriteSetByName(Name:string) : void
    {
        for(let i = 0; i < this.SpriteSets.length; i++)
        {
            if(this.SpriteSets[i].Name == Name) this.UpdateSpriteSet(i);
        }
    }
    public GetSprites(Set:number) : string[]
    {
        if(this.SpriteSets.length == 0) return [];
        return this.SpriteSets[Set].Images;
    }
    public GetNormalSprites(Set:number) : string[]
    {
        if(this.NormalSets.length == 0) return [];
        return this.NormalSets[Set].Images;
    }
    public Serialize() : any
    {
        // Override
        let S = super.Serialize();
        S.Index = this._CurrentSpriteSet;
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
        for(let i in Data.SubSprites)
        {
            let SS:Sprite = new Sprite();
            SS.Deserialize(Data.SubSprites[i]);
            this._SubSprites.push(SS);
        }
    }
}