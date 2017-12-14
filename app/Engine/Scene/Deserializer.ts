export { Deserializer }

import { Scene } from "./Scene";
import { Scene2D } from "./Scene2D";
import { SceneObject, SceneObjectType } from "./SceneObject";
import { DrawObject, DrawObjectType } from "./DrawObject";
import { SoundObject } from "./SoundObject";
import { Sprite } from "./Sprite";
import { Tile } from "./Tile";

class Deserializer
{
    public static DeserializeSceneObject(Data) : any
    {
        let SO;
        if(Data.Type == SceneObjectType.Drawn)
        {
            if(Data.DrawType == DrawObjectType.Sprite)
            {
                SO = new Sprite();
                SO.Deserialize(Data);
            }
            else if(Data.DrawType == DrawObjectType.Tile)
            {
                SO = new Tile();
                SO.Deserialize(Data);
            }
        }
        else if(Data.Type == SceneObjectType.Sound)
        {
            SO = new SoundObject("");
            SO.Deserialize(Data);
        }
        return SO;
    }
}