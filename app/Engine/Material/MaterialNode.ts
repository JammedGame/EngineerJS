export  { MaterialNode };

import * as Math from "./../../Mathematics/Mathematics";

import { MaterialNodeValue } from "./MaterialNodeValue";

class MaterialNode
{
    public constructor(Old?:MaterialNode)
    {
        if(Old)
        {
        }
        else
        {
        }
    }
    public Copy() : MaterialNode
    {
        return new MaterialNode(this);
    }
}
