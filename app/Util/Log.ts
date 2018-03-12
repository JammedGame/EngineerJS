export  { Log };

class Log
{
    public static LogOut:boolean = true;
    public static LogInfo:boolean = true;
    public static LogError:boolean = true;
    public static LogWarning:boolean = true;
    public static LogEvent:boolean = false;
    public static Out(Message:string, Object?:any, Type?:string) : void
    {
        if(!Log.LogOut) return;
        console.log(" - - - ");
        if(Type) console.log("EngineerJS: " + Type);
        else console.log("EngineerJS: Message");
        console.log(Message);
        console.log(Object);
        console.log(" - - - ");
    };
    public static Info(Message:string, Object?:any, Type?:string) : void
    {
        if(!Log.LogInfo) return;
        console.info(" - - - ");
        if(Type) console.info("EngineerJS: " + Type + " Info");
        else console.info("EngineerJS: Info");
        console.info(Message);
        console.info(" - - - ");
    };
    public static Error(Message:string, Object?:any, Type?:string) : void
    {
        if(!Log.LogError) return;
        console.error(" - - - ");
        if(Type) console.error("EngineerJS: " + Type + " Error");
        else console.error("EngineerJS: Error");
        console.error(Message);
        console.error(" - - - ");
    };
    public static Warning(Message:string, Object?:any, Type?:string) : void
    {
        if(!Log.LogWarning) return;
        console.warn(" - - - ");
        if(Type) console.warn("EngineerJS: " + Type + " Warning");
        else console.warn("EngineerJS: Warning");
        console.warn(Message);
        console.warn(" - - - ");
    };
    public static Event(Message:string, Object?:any) : void
    {
        if(!Log.LogEvent) return;
        console.info(" - - - ");
        console.info("EngineerJS: Event");
        console.info(Message);
        console.info(" - - - ");
    };
}