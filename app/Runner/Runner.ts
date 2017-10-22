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
                this._Current.Events.Invoke("Load", this._Game, {});
                this.Run();
                return;
            }
        }
        Util.Log.Warning("Scene " + SceneName + " does not exist in " + this._Game.Name + ".");
    }
    private Run() : void
    {
        this._Stop = false;
        this.OnRenderFrame();
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
        document.addEventListener("wheel", this.OnMouseWheel.bind(this), false);
        document.addEventListener("contextmenu", this.OnMouseRight.bind(this), false);
        window.addEventListener("resize", this.OnResize.bind(this), false);
    }
    private UpdateScene() : void
    {
        this._Seed++;
        if (this._Current.Type == Engine.SceneType.Scene2D)
        {
            let Current2DScene:Engine.Scene2D  = <Engine.Scene2D>this._Current;
            for (let i = 0; i < Current2DScene.Sprites.length; i++)
            {
                if (Current2DScene.Sprites[i].SpriteSets.length == 0) continue;
                let FrameUpdateRate:number = this._FrameUpdateRate;
                if (Current2DScene.Sprites[i].SpriteSets[Current2DScene.Sprites[i].CurrentSpriteSet].Seed != -1) FrameUpdateRate = Current2DScene.Sprites[i].SpriteSets[Current2DScene.Sprites[i].CurrentSpriteSet].Seed;
                if (this._Seed % FrameUpdateRate == 0) Current2DScene.Sprites[i].RaiseIndex();
            }
        }
    }
    /// TODO
    /// Export events to separate class.
    private OnRenderFrame() : void
    {
        if(this._Stop) return;
        this.UpdateScene();
        this._Current.Events.Invoke("TimeTick", this._Game, {});
        requestAnimationFrame( this.OnRenderFrame.bind(this) );
        if(this._Current.Type == Engine.SceneType.Scene2D)
        {
            // Spammer
            // Util.Log.Event("RenderFrame");
            this._DrawEngine.Draw2DScene(<Engine.Scene2D>this._Current, window.innerWidth, window.innerHeight);
            this._Current.Events.Invoke("RenderFrame", this._Game, {});
        }
        else Util.Log.Error("Scene " + this._Current.Name + " cannot be drawn .");
    }
    private OnClosing(event) : void
    {
        Util.Log.Event("Closing");
        event.preventDefault();
    }
    private OnKeyPress(event) : void
    {
        Util.Log.Event("KeyPress");
        let KeyCode:Engine.KeyType =  <Engine.KeyType>event.keyCode;
        this._Current.Events.Invoke("KeyPress", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, Key:KeyCode});
    }
    private OnKeyDown(event) : void
    {
        Util.Log.Event("KeyDown");
        let KeyCode:Engine.KeyType =  <Engine.KeyType>event.keyCode;
        this._Current.Events.Invoke("KeyDown", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, Key:KeyCode});
    }
    private OnKeyUp(event) : void
    {
        Util.Log.Event("KeyUp");
        let KeyCode:Engine.KeyType =  <Engine.KeyType>event.keyCode;
        this._Current.Events.Invoke("KeyUp", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, Key:KeyCode});
    }
    private OnMouseDown(event) : void
    {
        if(!this.CheckObjectMouseEvents(["MousePress", "MouseDown"], event))
        {
            Util.Log.Event("MousePress");
            Util.Log.Event("MouseDown");
            this._Current.Events.Invoke("MousePress", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, MouseButton:<Engine.MouseButton>event.button, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
            this._Current.Events.Invoke("MouseDown", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, MouseButton:<Engine.MouseButton>event.button, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
        }
    }
    private OnMouseUp(event) : void
    {
        if(!this.CheckObjectMouseEvents(["MouseUp"], event))
        {
            Util.Log.Event("MouseUp");
            this._Current.Events.Invoke("MouseUp", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, MouseButton:<Engine.MouseButton>event.button, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
        }
    }
    private OnMouseWheel(event) : void
    {
        Util.Log.Event("MouseWheel");
        this._Current.Events.Invoke("MouseWheel", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, Delta:event.wheelDelta, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
    }
    private OnMouseMove(event) : void
    {
        // Spammer
        // Util.Log.Event("MouseMove");
        this._Current.Events.Invoke("MouseMove", this._Game, {Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
    }
    private OnMouseRight(event) : void
    {
        Util.Log.Event("MouseRight");
        event.preventDefault();
    }
    private OnResize(event) : void
    {
        Util.Log.Event("Resize");
        this._Current.Events.Invoke("Resize", this._Game, {Width:window.innerWidth, Height:window.innerHeight});
    }
    private CheckObjectMouseEvents(EventNames:string[], event) : boolean
    {
        let Handled:boolean = false;
        if (this._Current.Type == Engine.SceneType.Scene2D)
        {
            let Current2DScene:Engine.Scene2D  = <Engine.Scene2D>this._Current;
            let STrans:Math.Vertex = Current2DScene.Trans.Translation;
            STrans = new Math.Vertex(STrans.X * Current2DScene.Trans.Scale.X * this._DrawEngine.GlobalScale.X, STrans.Y * Current2DScene.Trans.Scale.Y * this._DrawEngine.GlobalScale.Y, 0);
            for (let i = this._Current.Objects.length - 1; i >= 0; i--)
            {
                if (this._Current.Objects[i].Type == Engine.SceneObjectType.Drawn)
                {
                    let Current:Engine.DrawObject = <Engine.DrawObject>this._Current.Objects[i];
                    let Trans:Math.Vertex = Current.Trans.Translation;
                    Trans = new Math.Vertex(Trans.X * Current2DScene.Trans.Scale.X * this._DrawEngine.GlobalScale.X, Trans.Y * Current2DScene.Trans.Scale.Y * this._DrawEngine.GlobalScale.Y, 0);
                    let Scale:Math.Vertex = Current.Trans.Scale;
                    let X:number = event.x;
                    let Y:number = event.y;
                    Scale = new Math.Vertex(Scale.X * Current2DScene.Trans.Scale.X * this._DrawEngine.GlobalScale.X, Scale.Y * Current2DScene.Trans.Scale.Y * this._DrawEngine.GlobalScale.Y, 1);
                    if ((Current.Fixed && Trans.X - Scale.X / 2 < X && X < Trans.X + Scale.X / 2 && Trans.Y - Scale.Y / 2 < Y && Y < Trans.Y + Scale.Y / 2) ||
                    (STrans.X + Trans.X - Scale.X / 2 < X && X < STrans.X + Trans.X + Scale.X / 2 && STrans.Y + Trans.Y - Scale.Y / 2 < Y && Y < STrans.Y + Trans.Y + Scale.Y / 2))
                    {
                        for(let i = 0; i < EventNames.length; i++) Handled = Handled || Current.Events.Invoke(EventNames[i], this._Game, {Sender:Current, Ctrl:event.ctrlKey, Alt:event.altKey, Shift:event.shiftKey, MouseButton:<Engine.MouseButton>event.button, Location:new Math.Vertex((event.x / window.innerWidth) * 1920, (event.y / window.innerHeight) * 1080, 0)});
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
}