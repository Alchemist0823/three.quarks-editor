import * as React from "react";
import * as THREE from "three";
import {Object3D, Texture} from "three";
import {ParticleEmitter, QuarksLoader} from "three.quarks";
import {Application} from "./Application";
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
import {BulletHit} from "../example/BulletHit";
import {ToonExplosion} from "../example/ToonExplosion";
import {Explosion} from "../example/Explosion";
import {LevelUp} from "../example/LevelUp";
import {PickUp} from "../example/PickUp";
import {ShipSmoke} from "../example/ShipSmoke";
import {ElectricBall} from "../example/ElectricBall";
import {ShipTrail} from "../example/ShipTrail";


export interface TextureImage {
    img: string,
    texture: Texture,
}

export interface AppContext {
    scene: THREE.Scene;
    script: (delta: number) => void;
    selection: Array<Object3D>;
    textures: Array<TextureImage>;
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
        updateProperties: () => void;
    }
}

const ApplicationContext = React.createContext<AppContext | null>(null);

export const ApplicationContextConsumer = ApplicationContext.Consumer;

export class ApplicationContextProvider extends React.Component<{ }, AppContext> {

    createScene(demoIndex: number) {
        const scene = new THREE.Scene();

        scene.background = new Color(0x666666);

        let demoObject;
        if (demoIndex === 0) {
            demoObject = new ToonProjectile();
            demoObject.name = "Toon Projectile";
        } else if (demoIndex === 1) {
            demoObject = new BulletMuzzle();
            demoObject.name = "BulletMuzzle";
        } else if (demoIndex === 2) {
            demoObject = new BulletProjectile();
            demoObject.name = "BulletProjectile";
        } else if (demoIndex === 3) {
            demoObject = new ShipSmoke();
            demoObject.name = "shipSmoke";
        } else if (demoIndex === 4) {
            demoObject = new ToonExplosion();
            demoObject.name = "ToonExplosion";
        } else if (demoIndex === 5) {
            demoObject = new Explosion();
            demoObject.name = "Explosion";
        } else if (demoIndex === 6) {
            demoObject = new LevelUp();
            demoObject.name = "LevelUp";
        } else if (demoIndex === 7) {
            demoObject = new PickUp();
            demoObject.name = "PickUp";
        } else if (demoIndex == 8) {
            demoObject = new ElectricBall();
            demoObject.name = "ElectricBall";
        } else if (demoIndex == 9){
            demoObject = new ShipTrail();
            demoObject.name = "ShipTrail";
        } else {
            demoObject = new ElectricBall();
            demoObject.name = "ElectricBall";
        }
        scene.add(demoObject);

        const axisHelper = new AxesHelper(100);
        axisHelper.name = "axisHelper";
        scene.add(axisHelper);

        const light = new PointLight(new Color(1, 1, 1), 0.8, 200);
        light.position.set(50, 50, 50);
        scene.add(light);

        const ambientLight = new AmbientLight(new Color(1, 1, 1), 0.2);
        scene.add(ambientLight);

        return scene;
    }

    constructor(props: Readonly<{}>) {
        super(props);
        const texture1 = new TextureLoader().load("textures/texture1.png");
        texture1.name = "textures/texture1.png";
        const texture2 = new TextureLoader().load("textures/texture2.png");
        texture2.name = "textures/texture2.png";

        const state: AppContext = {
            scene: this.createScene(0),
            script: this.animate,
            selection: [],
            textures: [
                {img: './textures/texture1.png', texture: texture1},
                {img: './textures/texture2.png', texture: texture2},
            ],
            actions: {
                onOpenDemo: (index: number) => {
                    const scene = this.createScene(index);
                    this.setState({scene: scene});
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
                        loader.load(jsonURL, (object3D: Object3D)=>{
                            this.state.scene.add(object3D);
                        }, ()=>{}, ()=>{});
                    }
                },
                select: object => {
                    this.setState({selection: [object]});
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
                updateProperties: () => {
                    this.setState({scene: this.state.scene});
                },
                addTexture: (textureImage: TextureImage) => {
                    this.state.textures.push(textureImage);
                    this.setState({textures: this.state.textures});
                }
            }
        };

        this.state = state;
    }

    removeObject3d = (object3D: Object3D) => {
        if (object3D.parent) {
            object3D.parent.remove(object3D);
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
            case 'particle':
                const texture = this.state.textures[0].texture;
                const particleSystem = new ParticleSystem({
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
            this.state.actions.updateProperties();
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
        this.particleSystem = new ParticleSystem({
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