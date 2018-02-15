export { Serialization }

import * as Engine from "./../Engine/Engine";

class Serialization
{
    public static CleanData(Data:any) : any
    {
        let NewData = {};
        for(let key in Data)
        {
            if(key.startsWith("EDITOR_")) continue;
            if(key.startsWith("TOYBOX_")) continue;
            NewData[key] = Data;
        }
        return NewData;
    }
    public static DeserializeSceneObject(Data) : Engine.SceneObject
    {
        let SO;
        if(Data.Type == Engine.SceneObjectType.Drawn)
        {
            if(Data.DrawType == Engine.DrawObjectType.Sprite)
            {
                SO = new Engine.Sprite();
                SO.Deserialize(Data);
            }
            else if(Data.DrawType == Engine.DrawObjectType.Tile)
            {
                SO = new Engine.Tile();
                SO.Deserialize(Data);
            }
        }
        else if(Data.Type == Engine.SceneObjectType.Sound)
        {
            SO = new Engine.SoundObject("");
            SO.Deserialize(Data);
        }
        return SO;
    }
}