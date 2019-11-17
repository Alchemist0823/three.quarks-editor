import * as React from "react";
import * as THREE from "three";
import {Object3D} from "three";
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


interface ApplicationContextProps {

}

export interface AppContext {
    scene: THREE.Scene;
    script: (delta: number) => void;
    selection: Array<Object3D>;
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
        updateProperties: () => void;
    }
}

const ApplicationContext = React.createContext<AppContext | null>(null);

export const ApplicationContextConsumer = ApplicationContext.Consumer;

export class ApplicationContextProvider extends React.Component<ApplicationContextProps, AppContext> {

    createScene(demoIndex: number) {
        const scene = new THREE.Scene();

        scene.background = new Color(0x666666);

        let demoObject;
        if (demoIndex === 0) {
            demoObject = new ToonProjectile();
            demoObject.name = "Toon Projectile";
            demoObject.userData = {
                script:
                    "    this.position.x += delta * 30;\n" +
                    "    if (this.position.x > 20)\n" +
                    "        this.position.x = -20;\n"
            };
            demoObject.userData.func = new Function("delta", demoObject.userData.script);
        } else {
            demoObject = new BulletMuzzle();
            demoObject.name = "BulletMuzzle";
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

    constructor(props: Readonly<ApplicationContextProps>) {
        super(props);
        const state: AppContext = {
            scene: this.createScene(0),
            script: this.animate,
            selection: [],
            actions: {
                onOpenDemo: (index: number) => {
                    let scene = this.createScene(index);
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
                        let jsonURL = URL.createObjectURL( files[nFileId] );

                        let loader = new QuarksLoader();
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
                duplicateObject3d: () => {
                },
                updateParticleSystem: () => {
                },
                updateProperties: () => {
                    this.setState({scene: this.state.scene});
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

    addObject3d = (type: string, parent: Object3D) => {
        let object;
        switch (type) {
            case 'particle':
                let texture = new TextureLoader().load("textures/texture1.png");
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