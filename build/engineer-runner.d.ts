import * as Math from "./engineer-math";
import * as Engine from "./engineer-engine";
import * as Draw from "./engineer-draw";

export class Runner
{
    Game:Engine.Game;
    DrawEngine:Draw.DrawEngine;
    static Current:Runner;
    static Resolution:Math.Vertex;
    constructor(Game:Engine.Game, EngineType:Draw.DrawEngineType)
    SwitchScene(SceneName:string, Preload:boolean) : void
    SetResolution(Resolution:Math.Vertex, FixedSize?:boolean)
    Run() : void
    EngineInit(EngineType:Draw.DrawEngineType, Resolution?:Math.Vertex) : void
    AttachEvents() : void
    UpdateScene() : void
    OnRenderFrame() : void
    PackEventArgs(event) : any
    OnClosing(event) : void
    OnKeyPress(event) : void
    OnKeyDown(event) : void
    OnKeyUp(event) : void
    OnMouseDown(event) : void
    OnMouseUp(event) : void
    OnMouseWheel(event) : void
    OnMouseMove(event) : void
    OnMouseRight(event) : void
    OnResize(event) : void
    CheckObjectMouseEvents(EventNames:string[], event) : boolean
}