export  { Runner };

import * as Math from "./../Mathematics/Mathematics"
import * as Engine from "./../Engine/Engine";
import * as Util from "./../Util/Util";
import * as Draw from "./../Draw/Draw";
import * as Three from "./../Draw/Three/Three";

class Runner
{
    private static _Current:Runner;
    private _Stop:boolean;
    private _EngineInit:boolean;
    private _Seed:number;
    private _DrawHandle:number;
    private _LoopHandle:number;
    private _FrameUpdateRate:number;
    private _Current:Engine.Scene;
    private _Next:Engine.Scene;
    private _Game:Engine.Game;
    private _DrawEngine:Draw.DrawEngine;
    private _Canvas:HTMLCanvasElement;
    public get Game():any { return this._Game; }
    public get DrawEngine():any { return this._DrawEngine; }
    public Data: { [key: string]:any; } = {};
    public static get Current():Runner { return Runner._Current; }
    public static get Resolution():Math.Vertex { return Runner._Current._DrawEngine.Resolution; }
    public constructor(Game:Engine.Game, EngineType:Draw.DrawEngineType)
    {
        this._Stop = true;
        this._EngineInit = false;
        this._Seed = 0;
        this._FrameUpdateRate = 6;
        this._Game = Game;
        this._Canvas = document.getElementById("canvas") as HTMLCanvasElement;
        Util.Log.CustomTitle = Game.Name;
        this.EngineInit(EngineType);
        this.AttachEvents();
        Runner._Current = this;
    }
    public SwitchScene(SceneName:string, Preload:boolean) : void
    {
        for(let i = 0; i < this._Game.Scenes.length; i++)
        {
            if(this._Game.Scenes[i].Name == SceneName)
            {
                if(this._Current) this._Current.Events.Invoke("Leave", this._Game, {Next:this._Game.Scenes[i]});
                this._Current = this._Game.Scenes[i];
                this._Current.OnSwitch();
                this._Current.Events.Invoke("Switch", this._Game, {});
                return;
            }
        }
        Util.Log.Warning("Scene " + SceneName + " does not exist in " + this._Game.Name + ".", this._Game.Scenes);
    }
    public SetResolution(Resolution:Math.Vertex, FixedSize?:boolean)
    {
        this._DrawEngine.UpdateResolution(Resolution, FixedSize);
    }
    private Run() : void
    {
        this._Stop = false;
        this.Loop();
        this.OnRenderFrame();
    }
    private Loop() : void
    {
        if(this._Stop) return;
        this.UpdateScene();
        this._Current.Events.Invoke("Update", this._Game, {});
        this._LoopHandle = requestAnimationFrame( this.Loop.bind(this) );
    }
    private Stop() : void
    {
        this._Stop = true;
        cancelAnimationFrame(this._LoopHandle);
        cancelAnimationFrame(this._DrawHandle);
    }
    private EngineInit(EngineType:Draw.DrawEngineType, Resolution?:Math.Vertex) : void
    {
        if(EngineType == Draw.DrawEngineType.ThreeJS)
        {
            this._DrawEngine = new Three.ThreeDrawEngine(null, Resolution);
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
        this._Canvas.addEventListener("mousedown", this.OnMouseDown.bind(this), false);
        this._Canvas.addEventListener("mouseup", this.OnMouseUp.bind(this), false);
        this._Canvas.addEventListener("mousemove", this.OnMouseMove.bind(this), false);
        this._Canvas.addEventListener("wheel", this.OnMouseWheel.bind(this), false);
        this._Canvas.addEventListener("contextmenu", this.OnMouseRight.bind(this), false);
        this._Canvas.addEventListener("touchstart", this.OnTouchStart.bind(this), false);
        this._Canvas.addEventListener("touchend", this.OnTouchEnd.bind(this), false);
        this._Canvas.addEventListener("touchmove", this.OnTouchMove.bind(this), false);
        window.addEventListener("resize", this.OnResize.bind(this), false);
    }
    private UpdateScene() : void
    {
        this._Seed++;
        if (this._Current.Type == Engine.SceneType.Scene2D)
        {
            let Current2DScene:Engine.Scene2D  = <Engine.Scene2D>this._Current;
            let SceneSprites:Engine.Sprite[] = Current2DScene.Sprites;
            for (let i = 0; i < SceneSprites.length; i++)
            {
                if (SceneSprites[i].SpriteSets.length == 0) continue;
                let FrameUpdateRate:number = this._FrameUpdateRate;
                if (SceneSprites[i].SpriteSets[SceneSprites[i].CurrentSpriteSet].Seed != -1) FrameUpdateRate = SceneSprites[i].SpriteSets[SceneSprites[i].CurrentSpriteSet].Seed;
                if (this._Seed % FrameUpdateRate == 0) SceneSprites[i].RaiseIndex();
            }
        }
    }
    private OnRenderFrame() : void
    {
        if(this._Stop) return;
        this._DrawHandle = requestAnimationFrame( this.OnRenderFrame.bind(this) );
        if(this._Current.Type == Engine.SceneType.Scene2D)
        {
            this._DrawEngine.Draw2DScene(<Engine.Scene2D>this._Current, window.innerWidth, window.innerHeight);
        }
        else Util.Log.Error("Scene " + this._Current.Name + "is not of valid type.", this._Current);
    }
    private PackEventArgs(Event) : any
    {
        let Args = 
        {
            ID: 0,
            Ctrl:Event.ctrlKey,
            Alt:Event.altKey,
            Shift:Event.shiftKey,
            MouseButton:<Engine.MouseButton>Event.button,
            UnscaledLocation: {X:Event.offsetX, Y:Event.offsetY},
            Location:this._DrawEngine.TransformToCanvas(Event.offsetX, Event.offsetY),
            Delta:Event.wheelDelta,
            KeyCode:Event.keyCode,
            Width:window.innerWidth,
            Height:window.innerHeight
        }
        if(Event.identifier) Args.ID = Event.identifier;
        return Args;
    }
    private PackTouchEvent(Touch, Index) : any
    {
        let Event =
        {
            button: Index,
            offsetX: Touch.clientX,
            offsetY: Touch.clientY,
            identifier: Touch.identifier
        };
        return Event;
    }
    private OnClosing(Event) : void
    {
        Util.Log.Event("Closing");
        Event.preventDefault();
    }
    private OnKeyPress(Event) : void
    {
        Util.Log.Event("KeyPress");
        this._Current.Events.Invoke("KeyPress", this._Game, this.PackEventArgs(Event));
    }
    private OnKeyDown(Event) : void
    {
        Util.Log.Event("KeyDown");
        this._Current.Events.Invoke("KeyDown", this._Game, this.PackEventArgs(Event));
    }
    private OnKeyUp(Event) : void
    {
        Util.Log.Event("KeyUp");
        this._Current.Events.Invoke("KeyUp", this._Game, this.PackEventArgs(Event));
    }
    private OnMouseDown(Event) : void
    {
        if(!this.CheckObjectMouseEvents(["Click", "MouseDown"], Event))
        {
            Util.Log.Event("Click");
            Util.Log.Event("MouseDown");
            this._Current.Events.Invoke("Click", this._Game, this.PackEventArgs(Event));
            this._Current.Events.Invoke("MouseDown", this._Game, this.PackEventArgs(Event));
        }
    }
    private OnMouseUp(Event) : void
    {
        if(!this.CheckObjectMouseEvents(["MouseUp"], Event))
        {
            Util.Log.Event("MouseUp");
            this._Current.Events.Invoke("MouseUp", this._Game, this.PackEventArgs(Event));
        }
    }
    private OnMouseWheel(Event) : void
    {
        Util.Log.Event("MouseWheel");
        this._Current.Events.Invoke("MouseWheel", this._Game, this.PackEventArgs(Event));
    }
    private OnMouseMove(Event) : void
    {
        this._Current.Events.Invoke("MouseMove", this._Game, this.PackEventArgs(Event));
    }
    private OnMouseRight(Event) : void
    {
        Util.Log.Event("MouseRight");
        Event.preventDefault();
    }
    private OnTouchStart(Event) : void
    {
        for(let i = 0; i < Event.touches.length; i++)
        {
            let TouchEvent:any = this.PackTouchEvent(Event.touches[i], i);
            if(this._Current.Events.WireTouchEvents) this.OnMouseDown(TouchEvent);
            else if(!this.CheckObjectMouseEvents(["TouchStart"], TouchEvent))
            {
                Util.Log.Event("TouchStart");
                this._Current.Events.Invoke("TouchStart", this._Game, this.PackEventArgs(TouchEvent));
            }
        }
    }
    private OnTouchEnd(Event) : void
    {
        for(let i = 0; i < Event.changedTouches.length; i++)
        {
            let TouchEvent:any = this.PackTouchEvent(Event.changedTouches[i], i);
            if(this._Current.Events.WireTouchEvents) this.OnMouseUp(TouchEvent);
            else if(!this.CheckObjectMouseEvents(["TouchEnd"], TouchEvent))
            {
                Util.Log.Event("TouchEnd");
                this._Current.Events.Invoke("TouchEnd", this._Game, this.PackEventArgs(TouchEvent));
            }
        }
    }
    private OnTouchMove(Event) : void
    {
        for(let i = 0; i < Event.touches.length; i++)
        {
            let TouchEvent:any = this.PackTouchEvent(Event.touches[i], i);
            if(this._Current.Events.WireTouchEvents) this.OnMouseMove(TouchEvent);
            else this._Current.Events.Invoke("TouchMove", this._Game, this.PackEventArgs(TouchEvent));
        }
    }
    private OnResize(Event) : void
    {
        Util.Log.Event("Resize");
        this._Current.Events.Invoke("Resize", this._Game, this.PackEventArgs(Event));
    }
    private CheckObjectMouseEvents(EventNames:string[], Event) : boolean
    {
        let Handled:boolean = false;
        if (this._Current.Type == Engine.SceneType.Scene2D)
        {
            let Current2DScene:Engine.Scene2D  = <Engine.Scene2D>this._Current;
            let STrans:Math.Vertex = Current2DScene.Trans.Translation;
            STrans = new Math.Vertex(STrans.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, STrans.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 0);
            for (let i = this._Current.Objects.length - 1; i >= 0; i--)
            {
                if(!this._Current.Objects[i]) continue;
                if (this._Current.Objects[i].Type == Engine.SceneObjectType.Drawn)
                {
                    let Current:Engine.DrawObject = <Engine.DrawObject>this._Current.Objects[i];
                    let Trans:Math.Vertex = Current.Trans.Translation;
                    Trans = new Math.Vertex(Trans.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, Trans.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 0);
                    let Scale:Math.Vertex = Current.Trans.Scale;
                    let X:number = Event.offsetX;
                    let Y:number = Event.offsetY;
                    Scale = new Math.Vertex(Scale.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, Scale.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 1);
                    if ((Current.Fixed && Trans.X - Scale.X / 2 < X && X < Trans.X + Scale.X / 2 && Trans.Y - Scale.Y / 2 < Y && Y < Trans.Y + Scale.Y / 2) ||
                    (STrans.X + Trans.X - Scale.X / 2 < X && X < STrans.X + Trans.X + Scale.X / 2 && STrans.Y + Trans.Y - Scale.Y / 2 < Y && Y < STrans.Y + Trans.Y + Scale.Y / 2))
                    {
                        for(let i = 0; i < EventNames.length; i++)
                        {
                            let Args:any = this.PackEventArgs(Event);
                            Args.Sender = Current;
                            Handled = Handled || Current.Events.Invoke(EventNames[i], this._Game, Args);
                        }
                        if(true || Handled)
                        {
                            for(let i = 0; i < EventNames.length; i++) Util.Log.Event(EventNames[i] + " " + Current.ID);
                        }
                    }
                }
            }
        }
        return Handled;
    }
    public PickSceneObject(Position:any) : Engine.SceneObject
    {
        let Handled:boolean = false;
        if (this._Current.Type == Engine.SceneType.Scene2D)
        {
            let Current2DScene:Engine.Scene2D  = <Engine.Scene2D>this._Current;
            let STrans:Math.Vertex = Current2DScene.Trans.Translation;
            STrans = new Math.Vertex(STrans.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, STrans.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 0);
            for (let i = this._Current.Objects.length - 1; i >= 0; i--)
            {
                if (this._Current.Objects[i].Type == Engine.SceneObjectType.Drawn)
                {
                    let Current:Engine.DrawObject = <Engine.DrawObject>this._Current.Objects[i];
                    let Trans:Math.Vertex = Current.Trans.Translation;
                    Trans = new Math.Vertex(Trans.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, Trans.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 0);
                    let Scale:Math.Vertex = Current.Trans.Scale;
                    let X:number = Position.X;
                    let Y:number = Position.Y;
                    Scale = new Math.Vertex(Scale.X * Current2DScene.Trans.Scale.X / this._DrawEngine.GlobalScale.X, Scale.Y * Current2DScene.Trans.Scale.Y / this._DrawEngine.GlobalScale.Y, 1);
                    if ((Current.Fixed && Trans.X - Scale.X / 2 < X && X < Trans.X + Scale.X / 2 && Trans.Y - Scale.Y / 2 < Y && Y < Trans.Y + Scale.Y / 2) ||
                    (STrans.X + Trans.X - Scale.X / 2 < X && X < STrans.X + Trans.X + Scale.X / 2 && STrans.Y + Trans.Y - Scale.Y / 2 < Y && Y < STrans.Y + Trans.Y + Scale.Y / 2))
                    {
                        if(Current.Data["Pickable"]) return Current;
                    }
                }
            }
        }
        return null;
    }
    public TouchscreenDevice() : boolean
    {
        if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) return true;
        else return false;
    }
}