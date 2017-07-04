export  { Scene2D };

import * as Math from "./../../Mathematics/Mathematics";

import { Scene } from "./Scene";
import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawnSceneObject } from "./SceneObjectDrawn";
import { DrawObjectType, DrawObject } from "./../Draw/DrawObject";
import { Sprite } from "./../Draw/Sprite";

class Scene2D extends Scene
{
    private _Trans:Math.Transformation;
    public get Trans() : Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public get Sprites() : SceneObject[]
    {
        let Sprites = [];
        for(let i = 0; i < this.Objects.length; i++)
        {
            if(this.Objects[i].Type == SceneObjectType.Drawn)
            {
                if((<DrawnSceneObject>this.Objects[i]).Visual.Type = DrawObjectType.Sprite)
                {
                    Sprites.push(this.Objects[i]);
                }
            }
        }
        return Sprites;
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
            this._Trans = new Math.Transformation();
        }
    }
    public Copy() : Scene2D
    {
        let New:Scene2D = new Scene2D(this);
        return New;
    }
}