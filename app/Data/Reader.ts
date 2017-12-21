export { Reader }

class Reader
{
    public static ReadFile(FilePath:string, Callback:Function) : void
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