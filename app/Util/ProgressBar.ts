export  { ProgressBar };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class ProgressBar extends Engine.Tile
{
    private _Value:number;
    private _Scene:Engine.Scene;
    private _Indicator:Engine.Tile;
    public get Value():number { return this._Value; }
    public set Value(value:number) { this._Value = value; this.UpdateValue() }
    public get Indicator():Engine.Tile { return this._Indicator; }
    public constructor(Old?:ProgressBar, TargetScene?:Engine.Scene)
    {
        super(Old);
        this._Scene = TargetScene;
        if(Old)
        {
            this._Value = Old._Value;
            this._Indicator = Old._Indicator.Copy();
        }
        else
        {
            this.Init();
        }
    }
    private Init()
    {
        this.Name = "Progress";
        this.Paint = Math.Color.Black;
        this.Fixed = true;
        this.Position = new Math.Vertex(960, 980, 0.3);
        this.Size = new Math.Vertex(1520, 30, 1);
        this._Indicator = new Engine.Tile();
        this._Indicator.Name = "ProgressIndicator";
        this._Indicator.Paint = Math.Color.White;
        this._Indicator.Position = new Math.Vertex(200, 960, 0.3);
        this._Indicator.Size = new Math.Vertex(1, 30, 1);
    }
    private OnProgress(G:Engine.Game, Args:any)
    {
        if(this._Scene)
        this.Value = Args.Progress;
    }
    private UpdateValue()
    {
        this._Indicator.Position.Y = this.Position.Y;
        this._Indicator.Size.Y = this.Size.Y;
        this._Indicator.Size.X = (this._Value / 100.0) * this.Size.X;
        this._Indicator.Position.X = this.Position.X - this.Size.X / 2 + this._Indicator.Size.X / 2;
    }
    public OnAttach(Args:any) : void
    {
        // Override
        this.InitEvents(Args.Scene);
        this.UpdateValue();
    }
    private InitEvents(Scene:Engine.Scene) : void
    {
        Scene.Attach(this._Indicator);
        this._Scene.Events.LoadProgress.push(this.OnProgress.bind(this));
    }
}