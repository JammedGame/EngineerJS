export  { SceneObjectUtil };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class SceneObjectUtil
{
    public static CreateSprite(Name?:string, Images?:string[], Position?:Math.Vertex, Size?:Math.Vertex) : Engine.Sprite
    {
        let NewSprite:Engine.Sprite = new Engine.Sprite();
        if(Name) NewSprite.Name = Name;
        if(Images)
        {
            let NewSpriteSet:Engine.SpriteSet = new Engine.SpriteSet(null, Images, "Default");
            NewSprite.SpriteSets.push(NewSpriteSet);
            NewSprite.SetSpriteSet(0);
        }
        if(Position) NewSprite.Trans.Translation = Position;
        if(Size) NewSprite.Trans.Scale = Size;
        return NewSprite;
    }
    public static CreateTile(Name?:string, Images?:string[], Position?:Math.Vertex, Size?:Math.Vertex) : Engine.Tile
    {
        let NewTile:Engine.Tile = new Engine.Tile();
        if(Name) NewTile.Name = Name;
        if(Images)
        {
            let NewCollection:Engine.ImageCollection = new Engine.ImageCollection(null, Images);
            NewTile.Collection = NewCollection;
            NewTile.Index = 0;
        }
        if(Position) NewTile.Trans.Translation = Position;
        if(Size) NewTile.Trans.Scale = Size;
        return NewTile;
    }
}