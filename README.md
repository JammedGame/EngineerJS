# ToyBox

ToyBox Game Engine

## Getting Started

To get started you can add ToyBox to your project by installing it via npm:
```
npm install toybox-engine --save
```

Or you can use ToyBox CLI ( https://github.com/ManojlovicMilos/ToyBoxCli ) to initialize new project.
To install CLI globaly run:
```
npm install toybox-engine-cli -g
```
And create new project by calling:
```
tbx -init "Your New Project Name"
```

### Prerequisites

ToyBox aside from NPM and it's dependency packages have no other prequisities.
However ToyBox CLI may require following software:
* Git
* 7zip

To see what CLI functionalities require additional software call:
```
tbx -help details
```

## Deployment

To get fully built production package zip use CLI:
```
npm -pack
```
or 
```
npm -7zip -pack
```
## Versions

Current version is 0.2.0

Versions 0.1.X and older are no longer supported.

## Authors

* **Miloš Manojlović**

## Contributing

If you consider contributing contact me via toyboxengine@gmail.com .

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

We use following packages to make ToyBox work:
* ThreeJS ( https://threejs.org/ )
* Howler.js ( https://howlerjs.com/ )

You are awesome! Keep up the good work :)
