export  { Log };

class Log
{
    public static LogPrint:boolean = true;
    public static LogInfo:boolean = true;
    public static LogError:boolean = true;
    public static LogWarning:boolean = true;
    public static LogEvent:boolean = true;
    public static Print(Message:string)
    {
        if(Log.LogPrint) console.info("EngineerJS:" + Message);
    };
    public static Info(Message:string)
    {
        if(Log.LogInfo) console.info("EngineerJS: Info - " + Message);
    };
    public static Error(Message:string)
    {
        if(Log.LogError) console.error("EngineerJS: Error - " + Message);
    };
    public static Warning(Message:string)
    {
        if(Log.LogWarning) console.warn("EngineerJS: Warning - " + Message);
    };
    public static Event(Message:string)
    {
        if(Log.LogEvent) console.info("EngineerJS: Event - " + Message);
    };
}