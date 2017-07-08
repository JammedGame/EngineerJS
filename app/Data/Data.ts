import { Uuid } from "./Uuid";
import { ImageContainer } from "./ImageContainer";

class Reader
{
    public static Read(FilePath:string, Callback:Function) : void
    {
        let RawFile:any = new XMLHttpRequest();
        RawFile.open("GET", FilePath, false);
        RawFile.onreadystatechange = function ()
        {
            if(RawFile.readyState === 4)
            {
                if(RawFile.status === 200 || RawFile.status == 0)
                {
                    var AllText = RawFile.responseText;
                    Callback(AllText);
                }
            }
        }.bind(this);
        RawFile.send(null);
    }
}

export  { Reader, Uuid, /*DataStream,*/ ImageContainer };