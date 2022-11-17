import * as React from "react";
import Stats from "stats.js";
import {WEBGL} from "../util/WebGL";
import {
    PerspectiveCamera,
    WebGLRenderer,
    Clock, Raycaster, Vector2, Object3D,
} from "three";
import {useCallback, useContext, useEffect, useRef, useState} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BatchedParticleRenderer, ParticleEmitter} from "three.quarks";
import {
    AppContext,
    ApplicationContext,
    ApplicationContextConsumer,
    listObjects,
    Selectables,
    SelectableSearchable
} from "./ApplicationContext";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {ViewPortControls} from "./ViewPortControls";
import {TutorialHint} from "./TutorialHint";
import {PlayController} from "./PlayController";

interface ThreejsViewportProps {
}

// TODO: useRef on them
let renderer: WebGLRenderer;
let stats: Stats;
let camera: PerspectiveCamera;
let raycaster: Raycaster;
let batchedRenderer: BatchedParticleRenderer;
let transformControls: TransformControls;
let clock: Clock;
let cameraControls: OrbitControls;

export const ThreejsViewport: React.FC<ThreejsViewportProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const container = useRef<HTMLDivElement>(null);
    const canvas = useRef<HTMLCanvasElement>(null);
    const animationHandlerRef = useRef(-1);

    useEffect(() => {
        if ( init() ) {
            animate();
        }
        return ()=> {
        }
    }, []);

    const playSpeedRef = useRef(context.playSpeed);


    useEffect(() => {
        playSpeedRef.current = context.playSpeed;
    }, [context.playSpeed]);

    const renderScene = useCallback(() => {
        cameraControls!.update();
        const delta = clock!.getDelta();

        context.script(delta * playSpeedRef.current);

        context.scene.traverse(object => {
            if (object.userData && object.userData.func) {
                object.userData.func.call(object, delta * playSpeedRef.current);
            }
        });

        batchedRenderer!.update(delta * playSpeedRef.current);
        renderer!.render(context.scene, camera!);
    }, []);

    const animate =  useCallback(() => {
        animationHandlerRef.current = requestAnimationFrame( animate );

        onResize(null);
        renderScene();
        stats!.update();
    }, []);

    const init = useCallback(() => {
        if (!container.current) {
            return false;
        }

        if ( !WEBGL.isWebGLAvailable() ) {
            container.current.appendChild( WEBGL.getWebGLErrorMessage() );
            return false;
        }

        if (!context.batchedRenderer) {
            return false;
        }

        renderer = new WebGLRenderer({preserveDrawingBuffer: true, canvas: canvas.current!});

        const scene = context.scene;
        batchedRenderer = context.batchedRenderer;
        /*if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
            document.getElementById( 'notSupported' )!.style.display = '';
            return false;
        }*/

        clock = new Clock();

        camera = new PerspectiveCamera( 50, canvas.current!.offsetWidth / canvas.current!.offsetHeight, 1, 1000 );
        camera.position.set(50, 50, 50);

        cameraControls = new OrbitControls( camera, renderer.domElement );
        //cameraControls.enableKeys = false;
        cameraControls.enableDamping = true;
        cameraControls.dampingFactor = 0.1;
        cameraControls.rotateSpeed = 0.2;
        cameraControls.enabled = true;
        cameraControls.update();

        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(canvas.current!.offsetWidth, canvas.current!.offsetHeight, false);

        transformControls = new TransformControls(camera, renderer.domElement);
        transformControls.name = 'TransformControls';
        transformControls.enabled = false;
        transformControls.visible = false;
        scene.add(transformControls);

        raycaster = new Raycaster();

        context.actions.setRenderer(transformControls, cameraControls);

        stats = new Stats();
        stats.dom.style.position = "absolute";
        stats.dom.style.left = "0";
        stats.dom.style.right = "";
        stats.dom.style.top = "";
        stats.dom.style.bottom = "0";
        container.current!.appendChild( stats.dom );

        canvas.current!.addEventListener( 'pointerup', onPointerUp );
        canvas.current!.addEventListener('contextmenu', event => event.preventDefault());

        onResize(null);

        return true;

    }, []);

    const onPointerUp = useCallback((event: MouseEvent) => {
        if (/*context.viewPortControlType !== 'camera'*/event.button === 2) {
            const rect = (event.target! as HTMLDivElement).getBoundingClientRect();
            const x = event.clientX - rect.left; //x position within the element.
            const y = event.clientY - rect.top;
            const tx = rect.right - rect.left; //x position within the element.
            const ty = rect.bottom - rect.top;

            const pointer = new Vector2();
            pointer.x = (x / tx) * 2 - 1;
            pointer.y = -(y / ty) * 2 + 1;
            raycaster!.setFromCamera(pointer, camera!);
            const list: Object3D[] = [];
            listObjects(context.scene, list, SelectableSearchable, Selectables);
            let selected = false;
            const intersects = raycaster!.intersectObjects(list, false);
            if (intersects.length > 0) {
                for (let i = 0; i < intersects.length; i++) {
                    let selection;
                    if (intersects[i].object.type === "ParticleSystemPreview") {
                        selection = intersects[i].object.parent!;
                    } else {
                        selection = intersects[i].object;
                    }
                    if (context.selection.length === 0 || selection!== context.selection[0]) {
                        context.actions.selectObject3d(selection);
                        selected = true;
                        break;
                    }
                    //intersects[ i ].object.material.color.set( 0xff0000 );
                }
            }
            if (!selected) {
                context.actions.clearSelection();
            }
        }

    },[]);

    const onResize = useCallback((event: any ) => {

        if (renderer && camera) {

            camera.aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( renderer.domElement.clientWidth, renderer.domElement.clientHeight, false);
        }
    },[]);
    return <div ref={container} style={{width: '100%', height: '100%', position: 'relative'}}>
        <canvas style={{width: '100%', height: '100%'}} ref={canvas}/>
        <ViewPortControls controlType={context.viewPortControlType}
                          setControlType={context.actions.setViewPortControlType}/>
        <TutorialHint controlType={context.viewPortControlType}/>
        <PlayController object3d={context.selection[0]}
                        updateProperties={context.updateProperties}/>
    </div>;
}
