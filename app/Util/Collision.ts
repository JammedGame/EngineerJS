export  { CollisionUtil };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class CollisionUtil
{
    public static Check(Object1:Engine.DrawObject, Object2:Engine.DrawObject)
    {
        let Collider1:Math.ColliderObject = CollisionUtil.CreateColliderObject(Object1);
        let Collider2:Math.ColliderObject = CollisionUtil.CreateColliderObject(Object2);
        return Math.Collision.Check(Collider1, Collider2);
    }
    public static CreateColliderObject(Object:Engine.DrawObject) : Math.ColliderObject
    {
        let Collider = new Math.ColliderObject();
        Collider.Position = Object.Trans.Translation;
        Collider.Scale= Object.Trans.Scale;
        if(Object.Data["Collision_Scale"]) Collider.Scale = Object.Data["Collision_Scale"];
        Collider.Type = Object.Data["Collision"];
        return Collider;
    }
    public static CalculateObjectCollisions(Type:string, Object:Engine.DrawObject, Colliders:Engine.DrawObject[])
    {
        Object.Data["Collision_"+Type] = new Math.CollisionValue();
        Object.Data["Colliders_"+Type] = [];
        Object.Data["Colliders_"+Type+"_Left"] = [];
        Object.Data["Colliders_"+Type+"_Right"] = [];
        Object.Data["Colliders_"+Type+"_Top"] = [];
        Object.Data["Colliders_"+Type+"_Bottom"] = [];
        for(let i = 0; i < Colliders.length; i++)
        {
            if(Object.ID == Colliders[i].ID) continue;
            let Collider1 = CollisionUtil.CreateColliderObject(Object);
            let Collider2 = CollisionUtil.CreateColliderObject(Colliders[i]);
            let CollisionValue = Math.Collision.Check(Collider1, Collider2);
            if(CollisionValue.Collision)
            {
                Object.Data["Collision_"+Type] = Math.CollisionValue.Combine(Object.Data["Collision_"+Type], CollisionValue);
                Object.Data["Colliders_"+Type].push(Colliders[i]);
                if(CollisionValue.Left) Object.Data["Colliders_"+Type+"_Left"].push(Colliders[i]);
                if(CollisionValue.Right) Object.Data["Colliders_"+Type+"_Right"].push(Colliders[i]);
                if(CollisionValue.Top) Object.Data["Colliders_"+Type+"_Top"].push(Colliders[i]);
                if(CollisionValue.Bottom) Object.Data["Colliders_"+Type+"_Bottom"].push(Colliders[i]);
            }
        }
    }
}