export  { Buffer };

class Buffer
{
    public static Append(Buffer1:ArrayBuffer, Buffer2:ArrayBuffer)
    {
        var Tmp = new Uint8Array(Buffer1.byteLength + Buffer2.byteLength);
        Tmp.set(new Uint8Array(Buffer1), 0);
        Tmp.set(new Uint8Array(Buffer2), Buffer1.byteLength);
        return Tmp.buffer;
    };
}