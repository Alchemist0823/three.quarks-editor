import * as React from "react";
import * as THREE from "three";
import {
    Object3D,
    Scene,
    Texture,
} from "three";
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
import {createBulletMuzzle} from "../example/BulletMuzzle";
import {createElectricBall} from "../example/ElectricBall";
import {createEnergyRifleMuzzle} from "../example/EnergyRifleMuzzle";
import {BatchedParticleRenderer} from "three.quarks";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {ParticleSystemPreviewObject} from "../objects/ParticleSystemPreviewObject";
import {createBlackHole} from "../example/Blackhole";
import {createBigExplosion} from "../example/Explosion";
import { createExplosion } from "../example/Explosion2";
import { createShipTrail } from "../example/ShipTrail";
import {createToonProjectile} from "../example/ToonProjectile";
import {createShipSmoke} from "../example/ShipSmoke";
import {createLevelUp} from "../example/LevelUp";


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

    viewPortControlType: string;
    transformControls?: TransformControls;

    actions: {
        onOpenDemo: (id: string)=>void;
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
        updateEmitterShape: (particleSystem: ParticleSystem) => void;
        setViewPortControlType: (type: string) => void;
    }
    updateProperties: () => void;
}

export const ApplicationContext = React.createContext<AppContext | null>(null);

interface ApplicationContextProviderProps {

}

export const ApplicationContextConsumer = ApplicationContext.Consumer;

export class ApplicationContextProvider extends React.Component<ApplicationContextProviderProps, AppContext> {

    textureLoader: TextureLoader;

    addDemo(demoId: string) {
        let demoObject;
        switch (demoId) {
            case "Projectile":
                demoObject = createToonProjectile(this.state.batchedRenderer!, this.state.textures);
                break;
            case "BulletMuzzle":
                demoObject = createBulletMuzzle(this.state.batchedRenderer!, this.state.textures);
                break;
            case "ShipSmoke":
                demoObject = createShipSmoke(this.state.batchedRenderer!, this.state.textures);
                break;
            case "BlackHole":
                demoObject = createBlackHole(this.state.batchedRenderer!, this.state.textures);
                break;
            case "LevelUp":
                demoObject = createLevelUp(this.state.batchedRenderer!, this.state.textures);
                break;
            case "EnergyRifleMuzzle":
                demoObject = createEnergyRifleMuzzle(this.state.batchedRenderer!, this.state.textures);
                break;
            case "ElectricBall":
                demoObject = createElectricBall(this.state.batchedRenderer!, this.state.textures);
                break;
            case "ShipTrail":
                demoObject = createShipTrail(this.state.batchedRenderer!, this.state.textures);
                break;
            case "Explosion":
                demoObject = createExplosion(this.state.batchedRenderer!, this.state.textures);
                break;
            case "BigExplosion":
                demoObject = createBigExplosion(this.state.batchedRenderer!, this.state.textures);
                break;
        }
        if (demoObject) {
            /*const geometry = new BoxBufferGeometry( 10, 10, 10 );
            const material = new MeshBasicMaterial( {color: 0x00ff00} );
            const cube = new Mesh( geometry, material );
            demoObject.add(cube);*/

            this.state.scene.add(demoObject);
            this.processParticleSystems(demoObject);
        }
        this.state.updateProperties();
    }

    updateProperties1 = () => {
        this.setState({updateProperties: this.updateProperties2});
    }

    updateProperties2 = () => {
        this.setState({updateProperties: this.updateProperties1});
    }

    processParticleSystems = (object3d: Object3D) => {
        object3d.traverse(obj => {
            if (obj.type === "ParticleEmitter") {
                const particleSystem = (obj as ParticleEmitter).system;
                const mesh = new ParticleSystemPreviewObject(particleSystem);
                obj.add(mesh);
            }
        });
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
            viewPortControlType: "camera",
            textures: [
                {img: process.env.PUBLIC_URL + '/textures/texture1.png', texture: texture1},
                {img: process.env.PUBLIC_URL + '/textures/texture2.png', texture: texture2},
            ],
            actions: {
                onOpenDemo: (id: string) => {
                    this.addDemo(id);
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
                            this.processParticleSystems(object3D);
                        }, ()=>{}, ()=>{});
                    }
                },
                select: object => {
                    if (this.state.selection) {
                        for(const selected of this.state.selection) {
                            selected.traverse((obj) => {
                                if (obj.type === "ParticleSystemPreview") {
                                    (obj as ParticleSystemPreviewObject).selected = false;
                                }
                            });
                        }
                    }
                    object.traverse((obj) => {
                        if (obj.type === "ParticleSystemPreview") {
                            (obj as ParticleSystemPreviewObject).selected = true;
                        }
                    });

                    this.setState({selection: [object]});
                    this.state.transformControls?.detach();
                    this.state.transformControls?.attach(object);
                    if (this.state.viewPortControlType !== 'camera') {
                        this.state.transformControls!.visible = true;
                        this.state.transformControls!.enabled = true;
                    } else {
                        this.state.transformControls!.visible = false;
                        this.state.transformControls!.enabled = false;
                    }
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
                updateEmitterShape(particleSystem: ParticleSystem) {
                    particleSystem.emitter.traverse(obj => {
                       if (obj.type === "ParticleSystemPreview") {
                           (obj as ParticleSystemPreviewObject).update();
                       }
                    });
                },
                setViewPortControlType: (type: string) => {
                    this.setState({viewPortControlType: type});
                }
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
            this.setState({});
        }
    };

    duplicateObject3d = (object3D: Object3D) => {
        if (object3D.parent) {
            object3D.parent.add(object3D.clone());
            this.setState({});
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
                this.processParticleSystems(object);
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
