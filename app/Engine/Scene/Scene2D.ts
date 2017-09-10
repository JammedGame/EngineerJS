export  { Scene2D };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneType, Scene } from "./Scene";
import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawObjectType, DrawObject } from "./../Scene/DrawObject";
import { Sprite } from "./../Scene/Sprite";
import { Tile } from "./../Scene/Tile";

class Scene2D extends Scene
{
    private _Trans:Math.Transformation;
    public get Trans() : Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public get Sprites() : Sprite[]
    {
        return this.GetObjectsWithDrawType(DrawObjectType.Sprite);
    }
    public get Tiles() : Tile[]
    {
        return this.GetObjectsWithDrawType(DrawObjectType.Tile);
    }
    public constructor(Old?:Scene2D)
    {
        super(Old);
        this.Type = SceneType.Scene2D;
        if(Old)
        {
            this._Trans = Old._Trans.Copy();
        }
        else
        {
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : Scene2D
    {
        return new Scene2D(this);
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