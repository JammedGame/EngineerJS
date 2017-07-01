export  { DrawEngine };

import * as Engine from "./../Engine/Engine";

class DrawEngine
{
    public constructor(Old?:DrawEngine)
    {
    }
    public Copy() : DrawEngine
    {
        let New:DrawEngine = new DrawEngine(this);
        return New;
    }
    public Draw2DScene(Scene:Engine.Scene) : void
    {

    }
    public Draw3DScene(Scene:Engine.Scene) : void
    {

    }
    private DrawSprite(Sprite:Engine.Sprite) : void
    {

    }
}