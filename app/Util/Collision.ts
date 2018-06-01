export  { CollisionUtil };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class CollisionUtil
{
    public static CheckCollision(Object1:Engine.DrawObject, Object2:Engine.DrawObject)
    {
        let Collider1:Math.ColliderObject = CollisionUtil.CreateColliderObject(Object1);
        let Collider2:Math.ColliderObject = CollisionUtil.CreateColliderObject(Object2);
        return Math.Collision.Check(Collider1, Collider2);
    }
    public static CreateColliderObject(Object:Engine.DrawObject) : Math.ColliderObject
    {
        let Collider:Math.ColliderObject = new Math.ColliderObject();
        Collider.Position = Object.Trans.Translation;
        Collider.Scale= Object.Trans.Scale;
        if(Object.Collision.Scale) Collider.Scale = Object.Collision.Scale;
        Collider.Type = Object.Collision.Type;
        Collider.Reference = Object;
        return Collider;
    }
    public static CalculateCollisions(Object:Engine.DrawObject, Colliders:Engine.DrawObject[]) : Math.CollisionResult
    {
        let Result:Math.CollisionResult = new Math.CollisionResult();
        let Collider:Math.ColliderObject = CollisionUtil.CreateColliderObject(Object);
        for(let i = 0; i < Colliders.length; i++)
        {
            if(Object.ID == Colliders[i].ID) continue;
            let Collider2:Math.ColliderObject = CollisionUtil.CreateColliderObject(Colliders[i]);
            let CollisionValue:Math.CollisionResult = Math.Collision.Check(Collider, Collider2);
            if(CollisionValue.Collision) Result.Combine(CollisionValue);
        }
        return Result;
    }
    public static CalculateTypeCollisions(Type:string, Object:Engine.DrawObject, Colliders:Engine.DrawObject[]) : void
    {
        let Result:Math.CollisionResult = CollisionUtil.CalculateCollisions(Object, Colliders);
        Object.Collision.Specific[Type] = Result;
    }
    public static Check(Object:Engine.DrawObject, Scene:Engine.Scene2D) : void
    {
        let Colliders:Engine.DrawObject[] = Scene.FindColliders(Object.Collision.Tags);
        Object.Collision.Result = CollisionUtil.CalculateCollisions(Object, Colliders);
    }
}