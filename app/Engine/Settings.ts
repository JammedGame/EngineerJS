export  { Settings, Quality };

enum Quality
{
    Low = 1,
    Medium = 2,
    High = 4,
}
class Settings
{
    public static Version:string = "Test 0.0.31.1";
    public static LibPath:string = "/resources/";
    public static Graphics:Quality = Quality.High;
}