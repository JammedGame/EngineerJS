export { Random }

class Random
{
    public static Next(Min, Max) : number
    { 
        return Math.floor(Math.random() * (Max - Min + 1)) + Min; 
    }
}