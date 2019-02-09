export { Serialization }

import * as Engine from "./../Engine/Engine";

class Serialization
{
    public static CleanData(Data:any) : any
    {
        let NewData:any = {};
        for(let Key in Data)
        {
            if(Key.startsWith("EDITOR_")) continue;
            if(Key.startsWith("TOYBOX_")) continue;
            NewData[Key] = Data;
        }
        return NewData;
    }
    public static DeserializeSceneObject(Data) : Engine.SceneObject
    {
        let SO:Engine.SceneObject;
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