import * as React from "react";
import * as THREE from "three";
import {Object3D, Scene, Texture} from "three";
import {ParticleEmitter, QuarksLoader} from "three.quarks";
import {TextureLoader} from "three";
import {ParticleSystem} from "three.quarks";
import {ConeEmitter} from "three.quarks";
import {ConstantValue} from "three.quarks";
import {ConstantColor} from "three.quarks";
import {Vector4} from "three";
import {AdditiveBlending} from "three";
import {Mesh} from "three";
import {BoxBufferGeometry} from "three";
import {MeshStandardMaterial} from "three";
import {ToonProjectile} from "../example/ToonProjectile";
import {Color} from "three";
import {AxesHelper} from "three";
import {PointLight} from "three";
import {AmbientLight} from "three";
import {BulletMuzzle} from "../example/BulletMuzzle";
import {BulletProjectile} from "../example/BulletProjectile";
import {ToonExplosion} from "../example/ToonExplosion";
import {LevelUp} from "../example/LevelUp";
import {ShipSmoke} from "../example/ShipSmoke";
import {ElectricBall} from "../example/ElectricBall";
import {ShipTrail} from "../example/ShipTrail";
import {Explosion2} from "../example/Explosion2";
import {EnergyRifleMuzzle} from "../example/EnergyRifleMuzzle";
import {Blackhole} from "../example/Blackhole";
import {BatchedParticleRenderer} from "three.quarks";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";


export interface TextureImage {
    img: string,
    texture: Texture,
}

export interface AppContext {
    scene: THREE.Scene;
    script: (delta: number) => void;
    selection: Array<Object3D>;
    textures: Array<TextureImage>;
    batchedRenderer?: BatchedParticleRenderer;
    transformControls?: TransformControls;

    actions: {
        onOpenDemo: (index: number)=>void;
        onSaveAs: ()=>void;
        onImport: (files: FileList)=>void;
        select: (object: Object3D) => void;
        selectAddition: (object: Object3D) => void;
        addObject3d: (type: string, parent: Object3D) => void;
        removeObject3d: (object: Object3D) => void;
        duplicateObject3d: (object: Object3D) => void;
        updateParticleSystem: (object: ParticleEmitter) => void;
        addTexture: (textureImage: TextureImage) => void;
        setRenderer: (renderer: BatchedParticleRenderer, transformControls: TransformControls) => void;
    }
    updateProperties: () => void;
}

const ApplicationContext = React.createContext<AppContext | null>(null);

interface ApplicationContextProviderProps {

}

export const ApplicationContextConsumer = ApplicationContext.Consumer;

export class ApplicationContextProvider extends React.Component<ApplicationContextProviderProps, AppContext> {

    textureLoader: TextureLoader;

    addDemo(demoIndex: number) {
        let demoObject;
        if (demoIndex === 0) {
            demoObject = new ToonProjectile(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "Toon Projectile";
        } else if (demoIndex === 1) {
            demoObject = new BulletMuzzle(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "BulletMuzzle";
        } else if (demoIndex === 2) {
            demoObject = new BulletProjectile(this.state.batchedRenderer!);
            demoObject.name = "BulletProjectile";
        } else if (demoIndex === 3) {
            demoObject = new ShipSmoke(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "shipSmoke";
        } else if (demoIndex === 4) {
            demoObject = new ToonExplosion(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "ToonExplosion";
        } else if (demoIndex === 5) {
            demoObject = new Blackhole(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "Blackhole";
        } else if (demoIndex === 6) {
            demoObject = new LevelUp(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "LevelUp";
        } else if (demoIndex === 7) {
            demoObject = new EnergyRifleMuzzle(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "EnergyRifleMuzzle";
        } else if (demoIndex === 8) {
            demoObject = new ElectricBall(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "ElectricBall";
        } else if (demoIndex === 9){
            demoObject = new ShipTrail(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "ShipTrail";
        } else if (demoIndex === 10) {
            demoObject = new Explosion2(this.state.batchedRenderer!, this.state.textures);
            demoObject.name = "Explosion2";
        }
        if (demoObject)
            this.state.scene.add(demoObject);
        this.state.updateProperties();
    }

    updateProperties1 = () => {
        this.setState({updateProperties: this.updateProperties2});
    }

    updateProperties2 = () => {
        this.setState({updateProperties: this.updateProperties1});
    }

    constructor(props: Readonly<ApplicationContextProviderProps>) {
        super(props);
        this.textureLoader = new TextureLoader();
        const texture1 = this.textureLoader.load(process.env.PUBLIC_URL + "/textures/texture1.png");
        texture1.name = "./textures/texture1.png";
        const texture2 = this.textureLoader.load(process.env.PUBLIC_URL + "/textures/texture2.png");
        texture2.name = "./textures/texture2.png";


        const state: AppContext = {
            scene: new Scene(),
            script: this.animate,
            batchedRenderer: undefined,
            selection: [],
            textures: [
                {img: process.env.PUBLIC_URL + '/textures/texture1.png', texture: texture1},
                {img: process.env.PUBLIC_URL + '/textures/texture2.png', texture: texture2},
            ],
            actions: {
                onOpenDemo: (index: number) => {
                    this.addDemo(index);
                    //this.setState({scene: scene});
                },
                onSaveAs: () => {
                    const a = document.createElement("a");
                    const file = new Blob([JSON.stringify(this.state.scene.toJSON())], {type: "application/json"});
                    a.href = URL.createObjectURL(file);
                    a.download = "scene.json";
                    a.click();
                },
                onImport: (files: FileList) => {
                    const nFiles = files.length;
                    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
                        const jsonURL = URL.createObjectURL( files[nFileId] );

                        const loader = new QuarksLoader();
                        loader.setCrossOrigin("");
                        loader.load(jsonURL, this.state.batchedRenderer!, (object3D: Object3D)=>{
                            this.state.scene.add(object3D);
                        }, ()=>{}, ()=>{});
                    }
                },
                select: object => {
                    this.setState({selection: [object]});
                    this.state.transformControls?.detach();
                    this.state.transformControls?.attach(object);
                },
                selectAddition: object => {
                    if (this.state.selection.indexOf(object) === -1) {
                        this.state.selection.push(object);
                        this.setState({selection: this.state.selection});
                    }
                },
                addObject3d: this.addObject3d,
                removeObject3d: this.removeObject3d,
                duplicateObject3d: this.duplicateObject3d,
                updateParticleSystem: () => {
                },
                addTexture: (textureImage: TextureImage) => {
                    this.state.textures.push(textureImage);
                    this.setState({textures: this.state.textures});
                },
                setRenderer: (renderer: BatchedParticleRenderer, transformControls: TransformControls) => {
                    this.setState({batchedRenderer: renderer, transformControls});
                },
            },
            updateProperties: this.updateProperties1,
        };

        this.state = state;
    }

    removeObject3d = (object3D: Object3D) => {
        if (object3D.parent) {
            object3D.parent.remove(object3D);
            object3D.traverse((obj) => {
               if (obj.type === 'ParticleEmitter') {
                   this.state.batchedRenderer!.deleteSystem((obj as ParticleEmitter).system);
               }
            });
            if (this.state.transformControls && this.state.transformControls.object === object3D) {
                this.state.transformControls.detach();
            }
        }
    };

    duplicateObject3d = (object3D: Object3D) => {
        if (object3D.parent) {
            object3D.parent.add(object3D.clone());
        }
    }

    addObject3d = (type: string, parent: Object3D) => {
        let object;
        switch (type) {
            case 'particle': {
                const texture = this.state.textures[0].texture;
                const particleSystem = new ParticleSystem(this.state.batchedRenderer!, {
                    maxParticle: 10000,
                    shape: new ConeEmitter(),
                    emissionOverTime: new ConstantValue(100),
                    startLife: new ConstantValue(30),
                    startSpeed: new ConstantValue(10),
                    startSize: new ConstantValue(1),
                    startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
                    texture: texture,
                    blending: AdditiveBlending,
                    startTileIndex: 0,
                    uTileCount: 10,
                    vTileCount: 10,
                    worldSpace: true,
                });
                object = particleSystem.emitter;
                this.state.scene.add(object);
                break;
            }
            case 'box':
                object = new Mesh(new BoxBufferGeometry(10, 10, 10), new MeshStandardMaterial({color: 0xcccccc}));
                this.state.scene.add(object);
                break;
        }
        if (object) {
            parent.add(object);
            this.state.actions.select(object);
            this.setState({});
        }
    };


    update = 0;
    animate = (delta: number) => {
        /*this.toonProjectile!.position.x += delta * 30;
        if (this.toonProjectile!.position.x > 20)
            this.toonProjectile!.position.x = -20;*/

        this.update += delta;
        if (this.update > 0.1) {
            //this.state
            this.update = 0;
        }
    };

    render() {
        //console.log( "rendering ApplicationContext ");
        return (
            <ApplicationContext.Provider value={this.state}>
                {this.props.children}
            </ApplicationContext.Provider>
        )
    }
}
/*
        this.particleSystem = new ParticleSystem(renderer, {
            maxParticle: 10000,
            shape: new ConeEmitter(),
            emissionOverTime: new ConstantValue(100),
            startLife: new ConstantValue(30),
            startSpeed: new ConstantValue(10),
            startSize: new ConstantValue(1),
            startColor: new ConstantColor(new Vector4(1,1,1, 1)),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            worldSpace: true,
        });*/
//this.particleSystem.emitter.position.set(10, 0, 0);
//scene.add(this.particleSystem.emitter);
