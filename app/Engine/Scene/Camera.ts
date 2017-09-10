export  { Camera };

import { DrawObject, DrawObjectType } from "./DrawObject";

class Camera extends DrawObject
{
    public constructor(Old?:Camera)
    {
        super(Old);
        this.DrawType = DrawObjectType.Camera;
    }
    public Copy() : Camera
    {
        return new Camera(this);
    }
}