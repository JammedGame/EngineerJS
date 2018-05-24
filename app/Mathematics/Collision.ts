export  { Collision, ColliderObject };

import { Axis, Vertex } from "./Vertex";
import { CollisionResult } from "./CollisionResult";
import { CollisionType, CollisionValue } from "./CollisionValue";

class ColliderObject
{
    public Position:Vertex;
    public Scale:Vertex;
    public Type:CollisionType;
}
class Collision
{
    public static FocusOffset:number = 10;
    public static Check(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        if(Collider1.Type == CollisionType.Radius)
        {
            if(Collider2.Type == CollisionType.Radius) return Collision.CheckRadiusToRadius(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Rectangular) return Collision.CheckRadiusToRectangular(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Horizontal) return Collision.CheckRadiusToHorizontal(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Vertical) return Collision.CheckRadiusToVertical(Collider1, Collider2);
        }
        if(Collider1.Type == CollisionType.Rectangular || Collider1.Type == CollisionType.Horizontal || Collider1.Type == CollisionType.Vertical)
        {
            if(Collider2.Type == CollisionType.Rectangular) return Collision.CheckRectangularToRectangular(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Radius) return Collision.CheckRectangularToRadius(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Horizontal) return Collision.CheckRectangularToHorizontal(Collider1, Collider2);
            if(Collider2.Type == CollisionType.Vertical) return Collision.CheckRectangularToVertical(Collider1, Collider2);
        }
        return new CollisionResult();
    }
    private static CheckRadiusToRadius(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        if(Collision.CheckRadius(Collider1, Collider2))
        {
            Result = Collision.GetCollision8Way(Collider1.Position, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadiusToRectangular(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
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
            Result = Collision.GetDefaultRectangularWay(Collider2, Collider1.Position);
            Result.Revert();
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadiusToHorizontal(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
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
            Result = Collision.GetDefaultRectangularWay(Collider1, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRadiusToVertical(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
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
            Result = Collision.GetDefaultRectangularWay(Collider1, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRectangularToRadius(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = Collision.CheckRadiusToRectangular(Collider2, Collider1);
        Result.Revert();
        return Result;
    }
    private static CheckRectangularToRectangular(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
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
            Result = Collision.GetDefaultRectangularWay(Collider1, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRectangularToHorizontal(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
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
            Result = Collision.GetDefaultRectangularWay(Collider1, Collider2.Position);
            Result.Collision = true;
        }
        return Result;
    }
    private static CheckRectangularToVertical(Collider1:ColliderObject, Collider2:ColliderObject) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        let Collided:boolean = false;
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y - Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X - Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
        Collided = Collided || Collision.CheckRectangleToPoint(Collider1, new Vertex(Collider2.Position.X + Collider2.Scale.X / 2.0, Collider2.Position.Y + Collider2.Scale.Y / 2.0, 0));
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
            Result = Collision.GetDefaultRectangularWay(Collider1, Collider2.Position);
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
    private static CheckRectangleToPoint(Collider:ColliderObject, Position:Vertex) : boolean
    {
        let XCollision:boolean = Collider.Position.X - Collider.Scale.X / 2.0 < Position.X && Collider.Position.X + Collider.Scale.X / 2.0 > Position.X;
        let YCollision:boolean = Collider.Position.Y - Collider.Scale.Y / 2.0 < Position.Y && Collider.Position.Y + Collider.Scale.Y / 2.0 > Position.Y;
        return XCollision && YCollision;
    }
    private static CheckRadiusToLineX(Collider:ColliderObject, X:number) : boolean
    {
        return Math.abs(Collider.Position.X - X) < Collider.Scale.X / 2.0;
    }
    private static CheckRadiusToLineY(Collider:ColliderObject, Y:number) : boolean
    {
        return Math.abs(Collider.Position.Y - Y) < Collider.Scale.Y / 2.0;
    }
    private static CheckRectangleToLineX(Collider:ColliderObject, Position:Vertex) : boolean
    {
        let XCollision:boolean = Collider.Position.X - Collider.Scale.X / 2.0 < Position.X && Collider.Position.X + Collider.Scale.X / 2.0 > Position.X;
        let YCollision:boolean = Collider.Position.Y - Collider.Scale.Y / 2.0 < Position.Y && Collider.Position.Y + Collider.Scale.Y / 2.0 > Position.Y;
        return XCollision && YCollision;
    }
    private static GetCollisionCubic(Collider:ColliderObject, Position:Vertex) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        return Result;
    }
    public static GetCollision4Way(Position1:Vertex, Position2:Vertex) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
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
    public static GetCollision8Way(Position1:Vertex, Position2:Vertex) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
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
    private static GetCollisionRectangularWay(Collider:ColliderObject, Position:Vertex) : CollisionResult
    {
        let Result:CollisionResult = new CollisionResult();
        if(Collider.Position.X - Collider.Scale.X / 2.0 > Position.X) Result.Left = true;
        if(Collider.Position.X + Collider.Scale.X / 2.0 < Position.X) Result.Right = true;
        if(Collider.Position.Y - Collider.Scale.Y / 2.0 > Position.Y) Result.Top = true;
        if(Collider.Position.Y + Collider.Scale.Y / 2.0 < Position.Y) Result.Bottom = true;
        return Result;
    }
    private static GetDefaultRectangularWay(Collider:ColliderObject, Position:Vertex) : CollisionResult
    {
        return Collision.GetCollisionRectangularWay(Collider, Position);
    }
}