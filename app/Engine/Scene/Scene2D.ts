export  { Scene2D };

import * as Math from "./../../Mathematics/Mathematics";

import { SceneType, Scene } from "./Scene";
import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawObjectType, DrawObject } from "./../Scene/DrawObject";
import { Sprite } from "./Sprite";
import { Tile } from "./Tile";

class Scene2D extends Scene
{
    private _Trans:Math.Transformation;
    public get Trans() : Math.Transformation { return this._Trans; }
    public set Trans(value:Math.Transformation) { this._Trans = value; }
    public get Sprites() : Sprite[]
    {
        return <Sprite[]>this.GetObjectsWithDrawType(DrawObjectType.Sprite);
    }
    public get Tiles() : Tile[]
    {
        return <Tile[]>this.GetObjectsWithDrawType(DrawObjectType.Tile);
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
            if((<DrawObject>Object).DrawType == DrawObjectType.Sprite || (<DrawObject>Object).DrawType == DrawObjectType.Tile || (<DrawObject>Object).DrawType == DrawObjectType.Light)
            {
                this.Data[Object.ID] = Object;
                this.Objects.push(Object);
            }
        }
    }
    public Composite(Chunk:Scene) : boolean
    {
        // Override
        if(Chunk.Type != SceneType.Scene2D) return false
        for(let i in Chunk.Objects)
        {
            if(Chunk.Objects[i].Type == SceneObjectType.Sound)
            {
                this.Objects.push(Chunk.Objects[i].Copy());
            }
            else if(Chunk.Objects[i].Type == SceneObjectType.Drawn)
            {
                let Drawn = <DrawObject> Chunk.Objects[i].Copy();
                let Chunk2D = <Scene2D> Chunk;
                Drawn.Trans.Composite(Chunk2D.Trans);
                this.Objects.push(Drawn);
            }
        }
        return true;
    }
    public Serialize() : any
    {
        // Override
        let S2D = super.Serialize();
        S2D.Transformations = this._Trans.Serialize();
        return S2D;
    }
    public Deserialize(Data:any) : void
    {
        // Override
        super.Deserialize(Data);
        this._Trans.Deserialize(Data.Transformations);
    }
}