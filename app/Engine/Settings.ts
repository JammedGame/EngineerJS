export  { Settings, Quality };

enum Quality
{
    Low = 1,
    Medium = 2,
    High = 4,
}
class Settings
{
    public static Version:string = "0.0.19";
    public static LibPath:string = "/resources/";
    public static Graphics:Quality = Quality.High;
}