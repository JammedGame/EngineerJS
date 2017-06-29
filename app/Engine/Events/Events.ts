export  { EventPackage };

class EventPackage
{
    public constructor() {}
    public Copy():EventPackage
    {
        let New:EventPackage = new EventPackage();
        return New;
    }
}