export  { DPad };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class DPad extends Engine.Tile
{
    private _Touch:boolean;
    private _TouchID:number;
    public static All:DPad[] = [];
    private _Up:Engine.Tile;
    private _Right:Engine.Tile;
    private _Down:Engine.Tile;
    private _Left:Engine.Tile;
    private _Press:Function[];
    public get Press():Function[] { return this._Press; }
    public constructor(Old?:DPad, Position?:Math.Vertex, Size?:Math.Vertex)
    {
        super(Old);
        this._Touch = false;
        this._Press = [];
        if(Old)
        {
            this._Up = Old._Up.Copy();
            this._Right = Old._Right.Copy();
            this._Down = Old._Down.Copy();
        }
        else
        {
            this.Update(Position, Size);
            this.Init();
        }
        DPad.All.push(this);
    }
    private Init()
    {
        let DPadCollection = new Engine.ImageCollection(null, ["Resources/ToyBox/DPad/DPad.png", "Resources/ToyBox/DPad/Up.png", "Resources/ToyBox/DPad/Right.png", "Resources/ToyBox/DPad/Down.png", "Resources/ToyBox/DPad/Left.png"]);
        this.Name = "DPad";
        this.Collection = DPadCollection;
        this.Index = 0;
        this._Up = this.CreateDirection(1);
        this._Right = this.CreateDirection(2);
        this._Down = this.CreateDirection(3);
        this._Left = this.CreateDirection(4);
        this.Fixed = true;
    }
    private CreateDirection(Index:number) : Engine.Tile
    {
        let Direction:Engine.Tile = new Engine.Tile();
        Direction.Name = "DPad Direction " + Index;
        Direction.Trans = this.Trans.Copy();
        Direction.Collection = this.Collection;
        Direction.Index = Index;
        Direction.Active = false;
        Direction.Fixed = true;
        return Direction;
    }
    public Update(Position:Math.Vertex, Size:Math.Vertex) : void
    {
        if (Position) this.Trans.Translation = Position.Copy();
        if (Size) this.Trans.Scale = Size.Copy();
    }
    public SetColors(DPad:Math.Color, Directions:Math.Color) : void
    {
        this.Paint = DPad;
        this._Up.Paint = Directions;
        this._Right.Paint = Directions;
        this._Down.Paint = Directions;
        this._Left.Paint = Directions;
    }
    public OnAddedToScene(Args:any) : void
    {
        // Override
        this.InitEvents(Args.Scene);
    }
    private InitEvents(Scene:Engine.Scene) : void
    {
        Scene.AddSceneObject(this._Up);
        Scene.AddSceneObject(this._Right);
        Scene.AddSceneObject(this._Left);
        Scene.AddSceneObject(this._Down);
        this.Events.TouchStart.push(this.TouchStart.bind(this));
        this.Events.TouchEnd.push(this.TouchEnd.bind(this));
        Scene.Events.TouchMove.push(this.TouchMove.bind(this));
    }
    private TouchStart(G:Engine.Game, Args:any) : void
    {
        this._Touch = true;
        this._TouchID = Args.ID;
    }
    private TouchEnd() : void
    {
        this.OnPress({});
        this._Touch = false;
    }
    private TouchMove(G:Engine.Game, Args:any) : boolean
    {
        if(this._TouchID != Args.ID) return;
        if(!this._Touch) return false;
        if(Math.Vertex.Distance(Args.Location, this.Trans.Translation) > this.Trans.Scale.X / 2)
        {
            this.OnPress({});
            this._Touch = false;
            return false;
        }
        let CollisionResult:Math.CollisionValue = Math.Collision.GetCollision8Way(this.Trans.Translation, Args.Location);
        let Directions = this.ConvertDirections(CollisionResult);
        this.OnPress(Directions);
        return true;
    }
    private ConvertDirections(Collision:any) : any
    {
        let Direction:any = {};
        if(Collision.Top != null) Direction.Up = true;
        if(Collision.Bottom != null) Direction.Down = true;
        if(Collision.Left != null) Direction.Left = true;
        if(Collision.Right != null) Direction.Right = true;
        return Direction;
    }
    private OnPress(Directions:any) : void
    {
        this._Up.Active = Directions.Up;
        this._Right.Active = Directions.Right;
        this._Down.Active = Directions.Down;
        this._Left.Active = Directions.Left;
        for(let i in this._Press)
        {
            this.Press[i](Directions);
        }
    }
}