export { ThreeBasicShaders }

class ThreeBasicShaders
{
    public static Vertex2D : string = `
        varying vec2 vUv;
        uniform float repeatx;
        uniform float repeaty;
        void main()
        {
            vUv  = vec2((1.0 - uv.x)*repeatx, uv.y*repeaty);
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
        `;
    public static LitVertex2D : string = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main()
        {
            vUv  = vec2(1.0 - uv.x, uv.y);
            vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vPosition = pos.xyz;
			gl_Position = pos;
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
    public static DefaultHeader : string = `
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        uniform sampler2D normalMap;
        uniform float radii[8];
        uniform float intensities[8];
        uniform vec3 locations[8];
        uniform vec3 attenuations[8];
        uniform vec4 lightColors[8];
        uniform vec3 lightDirection[8];
        uniform float lightParameters[8];
        uniform int lightTypes[8];
        uniform vec4 ambient;

        varying vec2 vUv;
        varying vec3 vPosition;

        #define MAX_LIGHTS 8 

        void main()
        {
        `;
    public static DefaultFooter : string = `
            gl_FragColor = finalColor;
        }
        `;
    public static ColorCalculation : string = `
            vec4 finalColor = color;
            if(index != -1)
            {
                finalColor = color * texture2D(texture, vUv);
            }
        `;
    public static LightCalculation : string = `
            vec3 SurfacePosition = vPosition;
            vec3 finalLight = ambient.rgb;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = vec3(locations[i].xy, 0.0);
                    vec3 distance = lightLocation - vec3(SurfacePosition.xy, 0.0);
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = (length(distance) * 10.0) / radii[i];
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    currentAttenuation = intensities[i] * 10.0 * currentAttenuation;
                    if(distanceToLight > radii[i]) currentAttenuation = 0.0;
                    finalLight = vec3(finalLight + currentAttenuation * lightColors[i].rgb);
                }
            }
            finalColor = vec4(finalLight * finalColor.rgb, finalColor.a);
        `;
    public static LightPhongCalculation : string = `
            vec3 SurfacePosition = vPosition;
            vec3 finalLight = ambient.rgb;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = vec3(locations[i].xy, 0.0);
                    vec3 distance = lightLocation - vec3(SurfacePosition.xy, 0.0);
                    vec3 surfaceToCamera = normalize(SurfacePosition - lightLocation);
                    vec3 lightDir = normalize(lightLocation - vec3(SurfacePosition.xy, 0.0));
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = (length(distance) * 10.0) / radii[i];
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    currentAttenuation = currentAttenuation * 5.0;
                    if(distanceToLight > radii[i]) currentAttenuation = 0.0;
                    vec4 normalCoded = texture2D(normalMap, vUv);
                    vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                    float shot = max(min(dot(normal, lightDir) + 0.5, 1.0), 0.0);
                    currentAttenuation = intensities[i] * currentAttenuation * shot;
                    finalLight = vec3(finalLight + currentAttenuation * lightColors[i].rgb);
                }
            }
            finalColor = vec4(finalLight * finalColor.rgb, finalColor.a);
        `;
    public static LightToon : string = `
            vec3 SurfacePosition = vPosition;
            float finalLight = 0.0;
            for(int i = 0; i < MAX_LIGHTS; i++)
            {
                if(intensities[i] > 0.0)
                {
                    vec3 lightLocation = vec3(locations[i].xy, 0.0);
                    vec3 distance = lightLocation - vec3(SurfacePosition.xy, 0.0);
                    vec3 surfaceToCamera = normalize(SurfacePosition - lightLocation);
                    vec3 lightDir = normalize(lightLocation - vec3(SurfacePosition.xy, 0.0));
                    distance = vec3(distance.x * 16.0 / 9.0, distance.y, 0);
                    float distanceToLight = (length(distance) * 10.0) / radii[i];
                    float currentAttenuation = 1.0 / (attenuations[i].x + attenuations[i].y * distanceToLight + attenuations[i].z * distanceToLight * distanceToLight);
                    currentAttenuation = currentAttenuation * 5.0;
                    if(distanceToLight > radii[i]) currentAttenuation = 0.0;
                    vec4 normalCoded = texture2D(normalMap, vUv);
                    vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                    float shot = max(min(dot(normal, lightDir) + 0.5, 1.0), 0.0);
                    finalLight = intensities[i] * currentAttenuation * shot * shot * shot;
                }
            }
            if(finalLight > 0.8) finalColor = vec4(2.0 * finalColor.rgb, finalColor.a);
            else finalColor = vec4(max(1.0, 2.0 * (finalLight) / 0.8) * finalColor.rgb, finalColor.a);
        `;
    public static get LitFragment2D() : string { return this.DefaultHeader + this.ColorCalculation + this.LightCalculation + this.DefaultFooter; }
    public static get PhongFragment2D() : string { return this.DefaultHeader + this.ColorCalculation + this.LightPhongCalculation + this.DefaultFooter; }
    public static get ToonFragment2D() : string { return this.DefaultHeader + this.ColorCalculation + this.LightToon + this.DefaultFooter; }
}