export  { EventPackage };

class EventPackage
{
    public constructor(Old?:EventPackage) {}
    public Copy():EventPackage
    {
        let New:EventPackage = new EventPackage(this);
        return New;
    }
}