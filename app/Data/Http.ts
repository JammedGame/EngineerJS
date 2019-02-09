export { HTTP }

enum RequestType
{
    Get = "GET",
    Post = "POST",
    Update = "PUT",
    Delete = "DELETE"
}

class HTTP
{
    public static Get(Url:string) : Promise<any>
    {
        return HTTP.Request(RequestType.Get, Url);
    }
    public static Delete(Url:string) : Promise<any>
    {
        return HTTP.Request(RequestType.Delete, Url);
    }
    public static Post(Url:string, Body?:Object) : Promise<any>
    {
        return HTTP.Request(RequestType.Post, Url, Body);
    }
    public static Update(Url:string, Body?:Object) : Promise<any>
    {
        return HTTP.Request(RequestType.Update, Url, Body);
    }
    private static Request(Type:RequestType, Url:string, Body?:Object) : Promise<any>
    {
        return new Promise((Resolve:Function, Reject:Function) =>
        {
            let Request:any = new XMLHttpRequest();
            Request.open(<string>Type, Url, false);
            Request.onreadystatechange = function ()
            {
                if(Request.readyState === 4)
                {
                    if(Request.status === 200 || Request.status == 0)
                    {
                        Resolve(Request.responseText);
                    }
                    else Reject( { Status: Request.status } );
                }
            }
            .bind(this);
            Request.send(Body);
        });
    }
}