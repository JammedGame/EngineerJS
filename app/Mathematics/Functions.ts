export { Random }

class Random
{
    public static Next(Min:number, Max:number) : number
    { 
        return Math.floor(Math.random() * (Max - Min + 1)) + Min; 
    }
}