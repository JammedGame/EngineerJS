export  { Analog };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class Analog extends Engine.Tile
{
    private _Touch:boolean;
    public static All:Analog[] = [];
    private _Pointer:Engine.Tile;
    private _Press:Function[];
    public get Press():Function[] { return this._Press; }
    public constructor(Old?:Analog, Position?:Math.Vertex, Size?:Math.Vertex)
    {
        super(Old);
        this._Touch = false;
        this._Press = [];
        if(Old)
        {
            this._Pointer = Old._Pointer.Copy();
        }
        else
        {
            this.Update(Position, Size);
            this.Init();
        }
        Analog.All.push(this);
    }
    private Init()
    {
        let AnalogCollection = new Engine.ImageCollection(null, ["Resources/ToyBox/Analog/Stick.png", "Resources/ToyBox/Analog/Pointer.png"]);
        this.Name = "Analog";
        this.Collection = AnalogCollection;
        this.Index = 0;
        this.CreatePointer();
        this.Fixed = true;
    }
    private CreatePointer() : void
    {
        let Pointer:Engine.Tile = new Engine.Tile();
        Pointer.Name = "Analog Pointer";
        Pointer.Trans.Translation = this.Trans.Translation.Copy();
        Pointer.Trans.Scale = this.Trans.Scale.Copy().Scalar(0.25);
        Pointer.Collection = this.Collection;
        Pointer.Index = 1;
        Pointer.Active = false;
        Pointer.Fixed = true;
        this._Pointer = Pointer;
    }
    public Update(Position:Math.Vertex, Size:Math.Vertex)
    {
        if (Position) this.Trans.Translation = Position.Copy();
        if (Size) this.Trans.Scale = Size.Copy();
    }
    public SetColors(Stick:Math.Color, Pointer:Math.Color) : void
    {
        this.Paint = Stick;
        this._Pointer.Paint = Pointer;
    }
    public OnAddedToScene(Args:any) : void
    {
        // Override
        this.InitEvents(Args.Scene);
    }
    private InitEvents(Scene:Engine.Scene) : void
    {
        Scene.AddSceneObject(this._Pointer);
        this.Events.TouchStart.push(this.TouchStart.bind(this));
        this.Events.TouchEnd.push(this.TouchEnd.bind(this));
        Scene.Events.TouchMove.push(this.TouchMove.bind(this));
    }
    private TouchStart()
    {
        this._Touch = true;
    }
    private TouchEnd()
    {
        this.OnPress({Pressed:false});
        this._Touch = false;
    }
    private TouchMove(G:Engine.Game, Args:any)
    {
        if(!this._Touch) return false;
        if(Math.Vertex.Distance(Args.Location, this.Trans.Translation) > this.Trans.Scale.X / 2)
        {
            this.OnPress({Pressed:false});
            this._Touch = false;
            return false;
        }
        let Angle:number = Math.Vertex.Angle(this.Trans.Translation, Args.Location);
        this._Pointer.Trans.Translation = new Math.Vertex(Args.Location.X, Args.Location.Y, this.Trans.Translation.Z + 0.1);
        this.OnPress({Pressed:true, Angle:Angle});
        return true;
    }
    private OnPress(Args:any) : void
    {
        this._Pointer.Active = Args.Pressed;
        for(let i in this._Press)
        {
            this.Press[i](Args);
        }
    }
}