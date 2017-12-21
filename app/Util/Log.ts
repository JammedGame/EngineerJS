export  { Log };

class Log
{
    public static LogPrint:boolean = true;
    public static LogInfo:boolean = false;
    public static LogError:boolean = true;
    public static LogWarning:boolean = true;
    public static LogEvent:boolean = false;
    public static Print(Message:any) : void
    {
        if(!Log.LogPrint) return;
        console.log(" - - - ");
        console.info("EngineerJS: Message");
        console.info(Message);
        console.log(" - - - ");
    };
    public static Info(Message:any) : void
    {
        if(!Log.LogInfo) return;
        console.log(" - - - ");
        console.info("EngineerJS: Info");
        console.info(Message);
        console.log(" - - - ");
    };
    public static Error(Message:any) : void
    {
        if(!Log.LogError) return;
        console.log(" - - - ");
        console.error("EngineerJS: Error");
        console.error(Message);
        console.log(" - - - ");
    };
    public static Warning(Message:any) : void
    {
        if(!Log.LogWarning) return;
        console.log(" - - - ");
        console.warn("EngineerJS: Warning");
        console.warn(Message);
        console.log(" - - - ");
    };
    public static Event(Message:any) : void
    {
        if(!Log.LogEvent) return;
        console.log(" - - - ");
        console.info("EngineerJS: Event");
        console.info(Message);
        console.log(" - - - ");
    };
}