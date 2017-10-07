export  { EventPackage };

import { Game } from "./../Game/Game";


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
    private _TimeTick:Function[];
    private _OperationProgress:Function[];
    private _OperationFinished:Function[];
    private _SpriteSetAnimationComplete:Function[];
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
    public get TimeTick() : Function[] { return this._TimeTick; }
    public get OperationProgress() : Function[] { return this._OperationProgress; }
    public get OperationFinished() : Function[] { return this._OperationFinished; }
    public get SpriteSetAnimationComplete() : Function[] { return this._SpriteSetAnimationComplete; }
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
        this._TimeTick = [];
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
        if (EventName == "MouseDown") return this.InvokeEvents(this._MouseDown, CurrentGame, Args);
        if (EventName == "MouseUp") return this.InvokeEvents(this._MouseUp, CurrentGame, Args);
        if (EventName == "MouseClick") return this.InvokeEvents(this._MouseClick, CurrentGame, Args);
        if (EventName == "MouseMove") return this.InvokeEvents(this._MouseMove, CurrentGame, Args);
        if (EventName == "MouseWheel") return this.InvokeEvents(this._MouseWheel, CurrentGame, Args);
        if (EventName == "RenderFrame") return this.InvokeEvents(this._RenderFrame, CurrentGame, Args);
        if (EventName == "Resize") return this.InvokeEvents(this._Resize, CurrentGame, Args);
        if (EventName == "TimeTick") return this.InvokeEvents(this._TimeTick, CurrentGame, Args);
        if (EventName == "OperationProgress") return this.InvokeEvents(this._OperationProgress, CurrentGame, Args);
        if (EventName == "OperationFinished") return this.InvokeEvents(this._OperationFinished, CurrentGame, Args);
        if (EventName == "SpriteSetAnimationComplete") return this.InvokeEvents(this._SpriteSetAnimationComplete, CurrentGame, Args);
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