export  { MouseButton, EventPackage };

import { Game } from "./../Game/Game";

enum MouseButton
{
    Left = 0,
    Middle = 1,
    Right = 2
}
class EventPackage
{
    private _Closing:Function[];
    private _KeyPress:Function[];
    private _KeyDown:Function[];
    private _KeyUp:Function[];
    private _Load:Function[];
    private _MouseClick:Function[];
    private _MouseDown:Function[];
    private _MouseUp:Function[];
    private _MouseMove:Function[];
    private _MouseWheel:Function[];
    private _RenderFrame:Function[];
    private _Resize:Function[];
    private _TimerTick:Function[];
    private _OperationProgress:Function[];
    private _OperationFinished:Function[];
    public get Closing() : Function[] { return this._Closing; }
    public get KeyPress() : Function[] { return this._KeyPress; }
    public get KeyDown() : Function[] { return this._KeyDown; }
    public get KeyUp() : Function[] { return this._KeyUp; }
    public get Load() : Function[] { return this._Load; }
    public get MouseClick() : Function[] { return this._MouseClick; }
    public get MouseDown() : Function[] { return this._MouseDown; }
    public get MouseUp() : Function[] { return this._MouseUp; }
    public get MouseMove() : Function[] { return this._MouseMove; }
    public get MouseWheel() : Function[] { return this._MouseMove; }
    public get RenderFrame() : Function[] { return this._RenderFrame; }
    public get Resize() : Function[] { return this._Resize; }
    public get TimerTick() : Function[] { return this._TimerTick; }
    public get OperationProgress() : Function[] { return this._OperationProgress; }
    public get OperationFinished() : Function[] { return this._OperationFinished; }
    public constructor(Old?:EventPackage)
    {
        this._Closing = [];
        this._KeyPress = [];
        this._KeyDown = [];
        this._KeyUp = [];
        this._Load = [];
        this._MouseClick = [];
        this._MouseDown = [];
        this._MouseUp = [];
        this._MouseMove = [];
        this._MouseWheel = [];
        this._RenderFrame = [];
        this._Resize = [];
        this._TimerTick = [];
        this._OperationProgress = [];
        this._OperationFinished = [];

        //TODO: Need to duplicate old
    }
    public Copy() : EventPackage
    {
        return new EventPackage(this);
    }
    public Invoke(EventName:string, CurrentGame:Game, Args) : boolean
    {
        if (EventName == "Closing") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "KeyDown") return this.InvokeEvents(this._KeyDown, CurrentGame, Args);
        if (EventName == "KeyUp") return this.InvokeEvents(this._KeyUp, CurrentGame, Args);
        if (EventName == "KeyPress") return this.InvokeEvents(this._KeyPress, CurrentGame, Args);
        if (EventName == "Load") return this.InvokeEvents(this._Load, CurrentGame, Args);
        if (EventName == "MouseDown") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "MouseUp") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "MouseClick") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "MouseMove") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "MouseWheel") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "RenderFrame") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "Resize") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "TimerTick") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "OperationProgress") return this.InvokeEvents(this._Closing, CurrentGame, Args);
        if (EventName == "OperationFinished") return this.InvokeEvents(this._Closing, CurrentGame, Args);
    }
    private InvokeEvents(Events:Function[], CurrentGame:Game, Args) : boolean
    {
        for(let i = 0; i < Events.length; i++)
        {
            Events[i](CurrentGame, Args);
        }
        return true;
    }
}