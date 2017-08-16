export  { Actor };

import * as Data from "./../../Data/Data";
import * as Math from "./../../Mathematics/Mathematics";

import { DrawObject, DrawObjectType } from "./DrawObject";

class Actor extends DrawObject
{
    public constructor(Old?:Actor)
    {
        super(Old);
    }
    public Copy() : Actor
    {
        let New:Actor= new Actor(this);
        return New;
    }
}