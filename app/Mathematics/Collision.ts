export  { Collision, CollisionType, CollisionValue, ColliderObject };

import { Axis, Vertex } from "./Vertex";

enum CollisionType
{
    Radius2D,
    Rectangular2D,
    Horizontal2D,
    Vertical2D
}
class CollisionValue
{
    public Collision:boolean;
    public Top:boolean;
    public Bottom:boolean;
    public Left:boolean;
    public Right:boolean;
    public Front:boolean;
    public Back:boolean;
    public Revert():void
    {
        let Store:boolean = this.Top;
        this.Top = this.Bottom;
        this.Bottom = Store;
        Store = this.Left;
        this.Left = this.Right;
        this.Right = Store;
        Store = this.Front;
        this.Front = this.Back;
        this.Back = Store;
    }
}
class ColliderObject
{
    public Position:Vertex;
    public Scale:Vertex;
    public Type:CollisionType;
}
class Collision
{
    public static FocusOffset:number = 10;
    public static Check(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        if(Collider1.Type == CollisionType.Radius2D)
        {
            if(Collider2.Type == CollisionType.Radius2D) return Collision.CheckRadius2DToRadius2D(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Rectangular2D) return Collision.CheckRadius2DToRectangular2D(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Horizontal2D) return Collision.CheckRadius2DToHorizontal2D(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Vertical2D) return Collision.CheckRadius2DToVertical2D(Collider1, Collider2);
        }
        if(Collider1.Type == CollisionType.Rectangular2D || Collider1.Type == CollisionType.Horizontal2D || Collider1.Type == CollisionType.Vertical2D)
        {
            if(Collider2.Type == CollisionType.Rectangular2D) return Collision.CheckRectangular2DToRectangular2D(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Radius2D) return Collision.CheckRectangular2DToRadius2D(Collider1, Collider2);
        }
        return new CollisionValue();
    }
    private static CheckRadius2DToRadius2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        if(Collision.CheckRadius(Collider1, Collider2))
        {
            Result = Collision.GetCollision8Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadius2DToRectangular2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        if(Collider1.Position.Y > Collider2.Position.Y - Collider2.Scale.Y / 2.0 && Collider1.Position.Y < Collider2.Position.Y + Collider2.Scale.Y / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineX(Collider1, Collider2.Position.X - Collider2.Scale.X / 2.0);
            Collided = Collided || Collision.CheckRadiusToLineX(Collider1, Collider2.Position.X + Collider2.Scale.X / 2.0);
        }
        if(Collider1.Position.X > Collider2.Position.X - Collider2.Scale.X / 2.0 && Collider1.Position.X < Collider2.Position.X + Collider2.Scale.X / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineY(Collider1, Collider2.Position.Y - Collider2.Scale.Y / 2.0);
            Collided = Collided || Collision.CheckRadiusToLineY(Collider1, Collider2.Position.Y + Collider2.Scale.Y / 2.0);
        }
        if(Collided)
        {
            Result = Collision.GetCollision4Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadius2DToHorizontal2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        if(Collider1.Position.Y > Collider2.Position.Y - Collider2.Scale.Y / 2.0 && Collider1.Position.Y < Collider2.Position.Y + Collider2.Scale.Y / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineX(Collider1, Collider2.Position.X - Collider2.Scale.X / 2.0);
            Collided = Collided || Collision.CheckRadiusToLineX(Collider1, Collider2.Position.X + Collider2.Scale.X / 2.0);
        }
        if(Collider1.Position.X > Collider2.Position.X - Collider2.Scale.X / 2.0 && Collider1.Position.X < Collider2.Position.X + Collider2.Scale.X / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineY(Collider1, Collider2.Position.Y);
        }
        if(Collided)
        {
            Result = Collision.GetCollision4Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadius2DToVertical2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRadiusToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        if(Collider1.Position.Y > Collider2.Position.Y - Collider2.Scale.Y / 2.0 && Collider1.Position.Y < Collider2.Position.Y + Collider2.Scale.Y / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineX(Collider1, Collider2.Position.X);
        }
        if(Collider1.Position.X > Collider2.Position.X - Collider2.Scale.X / 2.0 && Collider1.Position.X < Collider2.Position.X + Collider2.Scale.X / 2.0)
        {
            Collided = Collided || Collision.CheckRadiusToLineY(Collider1, Collider2.Position.Y - Collider2.Scale.Y / 2.0);
            Collided = Collided || Collision.CheckRadiusToLineY(Collider1, Collider2.Position.Y + Collider2.Scale.Y / 2.0);
        }
        if(Collided)
        {
            Result = Collision.GetCollision4Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRectangular2DToRadius2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = Collision.CheckRadius2DToRectangular2D(Collider2, Collider1);
        Result.Revert();
        return Result;
    }
    private static CheckRectangular2DToRectangular2D(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let XCollision:boolean = Collider1.Position.X <= Collider2.Position.X && Collider1.Position.X + Collider1.Scale.X >= Collider2.Position.X;
        XCollision = XCollision || Collider2.Position.X <= Collider1.Position.X && Collider2.Position.X + Collider2.Scale.X >= Collider1.Position.X;
        let YCollision:boolean = Collider1.Position.Y <= Collider2.Position.Y && Collider1.Position.Y + Collider1.Scale.Y >= Collider2.Position.Y;
        YCollision = YCollision || Collider2.Position.Y <= Collider1.Position.Y && Collider2.Position.Y + Collider2.Scale.Y >= Collider1.Position.Y;
        if(XCollision && YCollision)
        {
            Result = Collision.GetCollision4Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadius(Collider1:ColliderObject, Collider2:ColliderObject) : boolean
    {
        let Collider1Radius:number = (Collider1.Scale.X > Collider1.Scale.Y) ? Collider1.Scale.Y / 2.0 : Collider1.Scale.X / 2.0;
        let Collider2Radius:number = (Collider2.Scale.X > Collider2.Scale.Y) ? Collider2.Scale.Y / 2.0 : Collider2.Scale.X / 2.0;
        let Distance:number = Vertex.Distance(Collider1.Position, Collider2.Position);
        return Distance < Collider1Radius + Collider2Radius;
    }
    private static CheckRadiusToPoint(Collider:ColliderObject, Position:Vertex) : boolean
    {
        let ColliderRadius:number = (Collider.Scale.X > Collider.Scale.Y) ? Collider.Scale.Y / 2.0 : Collider.Scale.X / 2.0;
        let Distance:number = Vertex.Distance(Collider.Position, Position);
        return Distance < ColliderRadius;
    }
    private static CheckRadiusToLineX(Collider:ColliderObject, X:number) : boolean
    {
        return Math.abs(Collider.Position.X - X) < Collider.Scale.X / 2.0;
    }
    private static CheckRadiusToLineY(Collider:ColliderObject, Y:number) : boolean
    {
        return Math.abs(Collider.Position.Y - Y) < Collider.Scale.Y / 2.0;
    }
    private static GetCollisionCubic(Collider:ColliderObject, Position:Vertex) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        return Result;
    }
    private static GetCollision4Way(Position1:Vertex, Position2:Vertex) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let Angle:number = Vertex.Angle(Position2, Position1);
        if(Angle < 45)
        {
            Result.Left = true;
        }
        else if (Angle < 135)
        {
            Result.Top = true;
        }
        else if (Angle < 225)
        {
            Result.Right = true;
        }
        else if (Angle < 315)
        {
            Result.Bottom = true;
        }
        else
        {
            Result.Left = true;
        }
        return Result;
    }
    private static GetCollision8Way(Position1:Vertex, Position2:Vertex) : CollisionValue
    {
        let Result:CollisionValue = new CollisionValue();
        let Angle:number = Vertex.Angle(Position2, Position1);
        if(Angle < 22.5)
        {
            Result.Left = true;
        }
        else if (Angle < 67.5)
        {
            Result.Top = true;
            Result.Left = true;
        }
        else if (Angle < 112.5)
        {
            Result.Top = true;
        }
        else if (Angle < 157.5)
        {
            Result.Right = true;
            Result.Top = true;
        }
        else if (Angle < 202.5)
        {
            Result.Right = true;
        }
        else if (Angle < 247.5)
        {
            Result.Right = true;
            Result.Bottom = true;
        }
        else if (Angle < 292.5)
        {
            Result.Bottom = true;
        }
        else if (Angle < 337.5)
        {
            Result.Bottom = true;
            Result.Left = true;
        }
        else
        {
            Result.Left = true;
        }
        return Result;
    }
}