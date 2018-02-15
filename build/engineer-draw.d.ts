import * as Math from "./engineer-math";
import * as Engine from "./engineer-engine";

export enum DrawEngineType
{
    ThreeJS = 0
}

export class DrawEngine
{
    Renderer:any;
    GlobalScale:Math.Vertex;
    Resolution:Math.Vertex;
    Data: any;
    constructor(Old?:DrawEngine)
    Copy() : DrawEngine
    UpdateResolution(Resolution:Math.Vertex, FixedSize?:boolean) : void
    TransformToCanvas(X:number, Y:number) : Math.Vertex
    Draw2DScene(Scene:Engine.Scene2D, Width:number, Height:number) : void
    Draw3DScene(Scene:Engine.Scene, Width:number, Height:number) : void
    DrawSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    protected LoadSprite(Scene:Engine.Scene, Drawn:Engine.Sprite) : void
    DrawTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
    protected LoadTile(Scene:Engine.Scene, Drawn:Engine.Tile) : void
}