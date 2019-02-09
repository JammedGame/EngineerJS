export { Reader }

import { HTTP } from "./Http";

class Reader
{
    public static Read(Path:string) : Promise<any>
    {
        return HTTP.Get(Path);
    }
}