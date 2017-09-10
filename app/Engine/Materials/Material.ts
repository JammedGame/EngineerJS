export { Material }

import * as Math from "./../../Mathematics/Mathematics";

import { MaterialNode } from "./MaterialNode";
import { MaterialNodeValue } from "./MaterialNodeValue";
import { MaterialNodeValueHolder } from "./MaterialNodeValueHolder";

class Material
{
    public constructor(Old?:Material)
    {
        if(Old)
        {
        }
        else
        {
        }
    }
    public Copy() : Material
    {
        return new Material(this);
    }
}

