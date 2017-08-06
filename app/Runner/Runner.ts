export  { Runner };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";
import * as Draw from "./../Draw/Draw";
import * as Three from "./../Draw/Three/Three";

class Runner
{
    private _Stop:boolean;
    private _EngineInit:boolean;
    private _Seed:number;
    private _FrameUpdateRate:number;
    private _Current:Engine.Scene;
    private _Next:Engine.Scene;
    private _Game:Engine.Game;
    private _DrawEngine:Draw.DrawEngine;
    public get Game():any { return this._Game; }
    public Data: { [key: string]:any; } = {};
    public constructor(Game:Engine.Game, EngineType:Draw.DrawEngineType)
    {
        this._Stop = true;
        this._EngineInit = false;
        this._Seed = 0;
        this._FrameUpdateRate = 6;
        this._Game = Game;
        this.EngineInit(EngineType);
        this.AttachEvents();
    }
    public SwitchScene(SceneName:string, Preload:boolean) : void
    {
        for(let i = 0; i < this._Game.Scenes.length; i++)
        {
            if(this._Game.Scenes[i].Name == SceneName)
            {
                this._Current = this._Game.Scenes[i];
            }
        }
    }
    public Run()
    {
        if(this._Current.Type == Engine.SceneType.Scene2D) this._DrawEngine.Draw2DScene(<Engine.Scene2D>this._Current, window.innerWidth, window.innerHeight);
    }
    private EngineInit(EngineType:Draw.DrawEngineType) : void
    {
        if(EngineType == Draw.DrawEngineType.ThreeJS)
        {
            this._DrawEngine = new Three.ThreeDrawEngine();
            this._EngineInit = true;
        }
        else this._EngineInit = false;
    }
    private AttachEvents() : void
    {
        document.addEventListener("beforeunload", this.OnClosing.bind(this), false);
        document.addEventListener("keypress", this.OnKeyPress.bind(this), false);
        document.addEventListener("keydown", this.OnKeyDown.bind(this), false);
        document.addEventListener("keyup", this.OnKeyUp.bind(this), false);
        document.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
        document.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
        document.addEventListener("mousemove", this.OnMouseMove.bind(this), false);
        document.addEventListener("contextmenu", this.OnMouseRight.bind(this), false);
        window.addEventListener("resize", this.OnResize.bind(this), false);
    }
    private OnClosing(event) : void
    {
        Util.Log.Event("Closing");
        event.preventDefault();
    }
    private OnKeyPress(event) : void
    {
        Util.Log.Event("KeyPress");
        event.preventDefault();
    }
    private OnKeyDown(event) : void
    {
        Util.Log.Event("KeyDown");
        event.preventDefault();
    }
    private OnKeyUp(event) : void
    {
        Util.Log.Event("KeyUp");
        event.preventDefault();
    }
    private OnMouseDown(event) : void
    {
        Util.Log.Event("MouseDown");
        event.preventDefault();
    }
    private OnMouseUp(event) : void
    {
        Util.Log.Event("MouseUp");
        event.preventDefault();
    }
    private OnMouseMove(event) : void
    {
        Util.Log.Event("MouseMove");
        event.preventDefault();
    }
    private OnMouseRight(event) : void
    {
        Util.Log.Event("MouseRight");
        event.preventDefault();
    }
    private OnResize(event) : void
    {
        Util.Log.Event("Resize");
        event.preventDefault();
    }
}