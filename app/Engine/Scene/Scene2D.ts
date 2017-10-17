export  { Scene2D };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneType, Scene } from "./Scene";
import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawObjectType, DrawObject } from "./../Scene/DrawObject";
import { Tile } from "./../Scene/Tile";
import { Sprite } from "./../Scene/Sprite";

class Scene2D extends Scene
{
    private _Trans:Math.Transformation;
    public get Trans() : Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public get Sprites() : Sprite[]
    {
        let Sprites:Sprite[] = [];
        for(let i = 0; i < this.Objects.length; i++)
        {
            if(this.Objects[i].Type == SceneObjectType.Drawn)
            {
                if((<DrawObject>this.Objects[i]).DrawType == DrawObjectType.Sprite)
                {
                    Sprites.push(<Sprite>this.Objects[i]);
                }
            }
        }
        return Sprites;
    }
    public get Tiles() : Tile[]
    {
        let Tiles:Tile[] = [];
        for(let i = 0; i < this.Objects.length; i++)
        {
            if(this.Objects[i].Type == SceneObjectType.Drawn)
            {
                if((<DrawObject>this.Objects[i]).DrawType == DrawObjectType.Tile)
                {
                    Tiles.push(<Tile>this.Objects[i]);
                }
            }
        }
        return Tiles;
    }
    public constructor(Old?:Scene2D)
    {
        if(Old != null)
        {
            super(Old);
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            super();
            this.Type = SceneType.Scene2D;
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : Scene2D
    {
        let New:Scene2D = new Scene2D(this);
        return New;
    }
    public AddSceneObject(Object:SceneObject) : void
    {
        // Override
        if(Object.Type == SceneObjectType.Drawn)
        {
            if((<DrawObject>Object).DrawType == DrawObjectType.Sprite || (<DrawObject>Object).DrawType == DrawObjectType.Tile)
            {
                this.Data[Object.ID] = Object;
                this.Objects.push(Object);
            }
        }
    }
}