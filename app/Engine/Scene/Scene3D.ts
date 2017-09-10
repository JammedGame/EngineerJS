export  { Scene3D };

import { SceneType, Scene } from "./Scene";
import { SceneObjectType, SceneObject } from "./SceneObject";
import { DrawObjectType, DrawObject } from "./../Scene/DrawObject";
import { Actor } from "./../Scene/Actor";
import { Camera } from "./../Scene/Camera";
import { Light } from "./../Scene/Light";

class Scene3D extends Scene
{
    public get Actors() : Actor[]
    {
        return this.GetObjectsWithDrawType(DrawObjectType.Actor);
    }
    public get Cameras() : Camera[]
    {
        return this.GetObjectsWithDrawType(DrawObjectType.Camera);
    }
    public get Lights() : Light[]
    {
        return this.GetObjectsWithDrawType(DrawObjectType.Light);
    }
    public constructor(Old?:Scene3D)
    {
        super(Old);
        this.Type = SceneType.Scene3D;
        if(Old)
        {
        }
        else
        {
        }
    }
    public Copy() : Scene3D
    {
        return new Scene3D(this);
    }
    public AddSceneObject(Object:SceneObject) : void
    {
        // Override
        if(Object.Type == SceneObjectType.Drawn)
        {
            if((<DrawObject>Object).DrawType == DrawObjectType.Actor || (<DrawObject>Object).DrawType == DrawObjectType.Camera || (<DrawObject>Object).DrawType == DrawObjectType.Light)
            {
                this.Data[Object.ID] = Object;
                this.Objects.push(Object);
            }
        }
    }
}