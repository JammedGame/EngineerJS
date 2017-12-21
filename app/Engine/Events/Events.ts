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
        this._SpriteSetAnimationComplete = [];
        if(Old != null)
        {
            for(let i in Old._Closing) this._Closing.push(Old._Closing[i]);
            for(let i in Old._KeyPress) this._KeyPress.push(Old._KeyPress[i]);
            for(let i in Old._KeyDown) this._KeyDown.push(Old._KeyDown[i]);
            for(let i in Old._KeyUp) this._KeyUp.push(Old._KeyUp[i]);
            for(let i in Old._Load) this._Load.push(Old._Load[i]);
            for(let i in Old._MouseClick) this._MouseClick.push(Old._MouseClick[i]);
            for(let i in Old._MouseDown) this._MouseDown.push(Old._MouseDown[i]);
            for(let i in Old._MouseUp) this._MouseUp.push(Old._MouseUp[i]);
            for(let i in Old._MouseMove) this._MouseMove.push(Old._MouseMove[i]);
            for(let i in Old._RenderFrame) this._RenderFrame.push(Old._RenderFrame[i]);
            for(let i in Old._Resize) this._Resize.push(Old._Resize[i]);
            for(let i in Old._TimeTick) this._TimeTick.push(Old._TimeTick[i]);
            for(let i in Old._OperationProgress) this._OperationProgress.push(Old._OperationProgress[i]);
            for(let i in Old._OperationFinished) this._OperationFinished.push(Old._OperationFinished[i]);
            for(let i in Old._SpriteSetAnimationComplete) this._SpriteSetAnimationComplete.push(Old._SpriteSetAnimationComplete[i]);
        }
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
        if(Events.length == 0) return false;
        for(let i = 0; i < Events.length; i++)
        {
            Events[i](CurrentGame, Args);
        }
        return true;
    }
}