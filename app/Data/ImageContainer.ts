export  { ImageContainer };

class ImageContainer
{
    public static Load(Path:string, Callback:Function):HTMLImageElement
    {
        let Img:HTMLImageElement = new Image();
        Img.src = Path;
        Img.onload = function() {Callback(Img);};
        return Img;
    }
    public static LoadArray(Paths:string[], Callback:Function):HTMLImageElement[]
    {
        let Imgs:HTMLImageElement[] = [];
        let ImgsToLoad = Paths.length;
        function onImgLoad()
        {
            if (--ImgsToLoad <= 0)
            {
                Callback(Imgs);
            }
        }
        for (let i = 0; i < ImgsToLoad; ++i)
        {
            Imgs.push(this.Load(Paths[i], onImgLoad));
        }
        return Imgs;
    }
}