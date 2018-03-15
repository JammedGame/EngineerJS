export  { Log };

class Log
{
    public static Enabled:boolean = true;
    public static InfoEnabled:boolean = true;
    public static ErrorEnabled:boolean = true;
    public static WarningEnabled:boolean = true;
    public static EventEnabled:boolean = false;
    public static CustomEnabled:boolean = false;
    public static CustomTitle:string = "Custom";
    public static Out(Message:string, Data?:any, Type?:string) : void
    {
        if(!Log.Enabled) return;
        console.log(" - - - ");
        if(Type) console.log("TBX: " + Type);
        else console.log("TBX: Message");
        console.log(Message);
        if(Data) console.log(Data);
        console.log(" - - - ");
    };
    public static Info(Message:string, Data?:any, Type?:string) : void
    {
        if(!Log.Enabled) return;
        if(!Log.InfoEnabled) return;
        console.info(" - - - ");
        if(Type) console.info("TBX: " + Type + " Info");
        else console.info("TBX: Info");
        console.info(Message);
        if(Data) console.log(Data);
        console.info(" - - - ");
    };
    public static Error(Message:string, Data?:any, Type?:string) : void
    {
        if(!Log.Enabled) return;
        if(!Log.ErrorEnabled) return;
        console.error(" - - - ");
        if(Type) console.error("TBX: " + Type + " Error");
        else console.error("TBX: Error");
        console.error(Message);
        if(Data) console.log(Data);
        console.error(" - - - ");
    };
    public static Warning(Message:string, Data?:any, Type?:string) : void
    {
        if(!Log.Enabled) return;
        if(!Log.WarningEnabled) return;
        console.warn(" - - - ");
        if(Type) console.warn("TBX: " + Type + " Warning");
        else console.warn("TBX: Warning");
        console.warn(Message);
        if(Data) console.log(Data);
        console.warn(" - - - ");
    };
    public static Event(Message:string, Data?:any) : void
    {
        if(!Log.Enabled) return;
        if(!Log.EventEnabled) return;
        console.info(" - - - ");
        console.info("TBX: Event");
        console.info(Message);
        console.info(" - - - ");
    };
    public static Custom(Message:string, Data?:any, Type?:string) : void
    {
        if(!Log.Enabled) return;
        if(!Log.WarningEnabled) return;
        console.warn(" - - - ");
        if(Type) console.warn("TBX: " + Log.CustomTitle + " - " + Type);
        else console.warn("TBX: " + Log.CustomTitle);
        console.warn(Message);
        if(Data) console.log(Data);
        console.warn(" - - - ");
    };
}