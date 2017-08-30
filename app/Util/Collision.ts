export  { Collision };

import * as Data from "./../Data/Data";
import * as Engine from "./../Engine/Engine";
import * as Math from "./../Mathematics/Mathematics";

class Collision
{
    public static CreateColliderObject(Object:any) : any
    {
        let Collider = new Math.ColliderObject();
        Collider.Position = Object.Trans.Translation;
        Collider.Scale= Object.Trans.Scale;
        Collider.Type = Object.Data["Collision"];
        return Collider;
    }
    public static CalculateObjectCollisions(Type:string, Object:any, Colliders:any[])
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
            let Collider1 = Collision.CreateColliderObject(Object);
            let Collider2 = Collision.CreateColliderObject(Colliders[i]);
            let CollisionValue = Math.Collision.Check(Collider1, Collider2);
            if(CollisionValue.Collision)
            {
                Object.Data["Collision_"+Type] = Math.CollisionValue.CombineCollisionValues(Object.Data["Collision_"+Type], Collision);
                Object.Data["Colliders_"+Type].push(Colliders[i]);
                if(CollisionValue.Left) Object.Data["Colliders_"+Type+"_Left"].push(Colliders[i]);
                if(CollisionValue.Right) Object.Data["Colliders_"+Type+"_Right"].push(Colliders[i]);
                if(CollisionValue.Top) Object.Data["Colliders_"+Type+"_Top"].push(Colliders[i]);
                if(CollisionValue.Bottom) Object.Data["Colliders_"+Type+"_Bottom"].push(Colliders[i]);
            }
        }
    }
}