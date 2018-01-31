export { ThreeNodeShaders }

class ThreeNodeShaders
{
    private static _Single:ThreeNodeShaders;
    public static get Single():ThreeNodeShaders
    {
        if(!ThreeNodeShaders._Single) ThreeNodeShaders._Single = new ThreeNodeShaders();
        return ThreeNodeShaders._Single;
    }
    private _Pool: { [key: string]:string; };
    public get Pool():any { return this._Pool; }
    public constructor()
    {
        this.Init();
        ThreeNodeShaders._Single = this;
    }
    private Init() : void
    {
        this._Pool = {};

        this._Pool["Vertex"] = `
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

        this._Pool["FragmentHeader"] = `
        uniform int index;
        uniform vec4 color;
        uniform sampler2D texture;
        uniform sampler2D normalMap;
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

        this._Pool["FragmentFooter"] = `
        }
        `;

        this._Pool["Output"] = `
        gl_FragColor = <COLOR>;
        `;

        this._Pool["Color"] = `
        vec4 <OUTPUT> = <COLOR>;
        `;

        this._Pool["InputColor"] = `
        vec4 <OUTPUT> = color;
        `;

        this._Pool["Texture"] = `
        vec4 <OUTPUT> = texture2D(texture, vUv);
        `;

        this._Pool["NormalMap"] = `
        vec4 <OUTPUT> = texture2D(normalMap, vUv);
        `;

        this._Pool["Light"] = `
        vec3 <OUTPUT> = ambient.rgb;
        for(int i = 0; i < MAX_LIGHTS; i++)
        {
            if(intensities[i] > 0.0)
            {
                vec3 lightLocation = locations[i];
                vec3 distance = lightLocation - vPosition;
                distance = vec3(distance.x * 16.0 / 9.0, distance.yz);
                float distanceToLight = length(distance);
                float currentAttenuation = 1.0 / (attenuations[i].y * distanceToLight);
                currentAttenuation = intensities[i] * currentAttenuation;
                <OUTPUT> = vec3(<OUTPUT> + currentAttenuation * lightColors[i].rgb);
            }
        }
        `;

        this._Pool["BumpLight"] = `
        vec3 <OUTPUT> = ambient.rgb;
        for(int i = 0; i < MAX_LIGHTS; i++)
        {
            if(intensities[i] > 0.0)
            {
                vec3 lightLocation = locations[i];
                vec3 distance = lightLocation - vPosition;
                vec3 surfaceToCamera = normalize(vPosition - lightLocation);
                distance = vec3(distance.x * 16.0 / 9.0, distance.yz);
                float distanceToLight = length(distance);
                float currentAttenuation = 1.0 / (attenuations[i].y * distanceToLight);
                vec4 normalCoded = texture2D(normalMap, vUv);
                vec3 normal = normalize(vec3(normalCoded.x * 2.0 - 1.0, normalCoded.y * 2.0 - 1.0, normalCoded.z * 2.0 - 1.0));
                float shot = length(surfaceToCamera - normal);
                currentAttenuation = intensities[i] * currentAttenuation * shot;
                <OUTPUT> = vec3(<OUTPUT> + currentAttenuation * lightColors[i].rgb);
            }
        }
        `;

        this._Pool["Diffuse"] = `
        vec4 <OUTPUT> = vec4(<LIGHT> * <COLOR>.rgb, <COLOR>.a);
        `;

        this._Pool["Mignola"] = `
        vec4 <OUTPUT> = <COLOR>;
        if(<MAP>.r < <LOWER_LIMIT> && <MAP>.g < <UPPER_LIMIT> && <MAP>.b < <UPPER_LIMIT>) <OUTPUT> = vec4(0.0, 0.0, 0.0, <OUTPUT>.a);
        if(<MAP>.r < <UPPER_LIMIT> && <MAP>.g < <LOWER_LIMIT> && <MAP>.b < <UPPER_LIMIT>) <OUTPUT> = vec4(0.0, 0.0, 0.0, <OUTPUT>.a);
        if(<MAP>.r < <UPPER_LIMIT> && <MAP>.g < <UPPER_LIMIT> && <MAP>.b < <LOWER_LIMIT>) <OUTPUT> = vec4(0.0, 0.0, 0.0, <OUTPUT>.a);
        `;
    }
}