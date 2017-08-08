export { ThreeJSShaders }

class ThreeJSShaders
{
    public static Vertex2D : string = `
        varying vec2 vUv;
        void main()
        {
            vUv  = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static Fragment2D : string = `
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        varying vec2 vUv;
        void main()
        {
            if(index == -1)
            {
                gl_FragColor = color;
            }
            else
            {
                gl_FragColor = color * texture2D(texture, vUv);
            }
        }
        `;
}