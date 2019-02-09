export  { Uuid };

class Uuid
{
    public static Create():string
    {
        var DT = new Date().getTime();
        var Uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (C) =>
        {
            var R = (DT + Math.random()*16)%16 | 0;
            DT = Math.floor(DT/16);
            return (C=='x' ? R :(R&0x3|0x8)).toString(16);
        });
        return Uuid;
    }
}