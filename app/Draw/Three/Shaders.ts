export { ThreeJSShaders }

class ThreeJSShaders
{
    public static Vertex2D : string = `
        varying vec2 vUv;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
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
    public static LitVertex2D : string = `
        varying vec2 vUv;
        varying vec3 vPosition;
        varying mat4 vModelView;
        varying mat4 vProjection;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
            vPosition = position.xyz;
            vModelView = modelViewMatrix;
            vProjection = projectionMatrix;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static LitFragment2D : string = `
        
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        uniform sampler2D normalMap;
        uniform float intensities[8];
        uniform vec3 locations[8];
        uniform vec3 attenuations[8];
        uniform vec4 lightColors[8];

        varying vec2 vUv;
        varying vec3 vPosition;
        varying mat4 vModelView;
        varying mat4 vProjection;

        #define MAX_LIGHTS 8 

        void main()
        {
            if(index == -1)
            {
                gl_FragColor = color;
            }
            else
            {
                vec4 finalColor = color * texture2D(normalMap, vUv) * texture2D(texture, vUv);
                vec3 SurfacePosition = vec3(vProjection * vModelView * vec4(vPosition, 1));
                for(int i = 0; i < MAX_LIGHTS; i++)
                {
                    if(intensities[i] > 0.0)
                    {
                        finalColor = finalColor * lightColors[i];
                    }
                }
                gl_FragColor = finalColor;
            }
        }
        `;
}