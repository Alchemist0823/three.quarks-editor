import * as React from "react";
import Stats from "stats.js";
import {WEBGL} from "../WebGL";
import {
    PerspectiveCamera,
    WebGLRenderer,
    Clock, Color, AxesHelper, PointLight, AmbientLight, Raycaster, Vector2, Object3D,
} from "three";
import {RefObject} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BatchedParticleRenderer, ParticleEmitter} from "three.quarks";
import {AppContext, ApplicationContextConsumer} from "./ApplicationContext";
import * as THREE from "three";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {ViewPortControls} from "./ViewPortControls";

interface ThreejsViewportProps {
    width: number;
    height: number;
}

export class ThreejsViewport extends React.PureComponent<ThreejsViewportProps> {
    container: RefObject<HTMLDivElement>;
    stats?: Stats;
    camera?: PerspectiveCamera;
    renderer?: WebGLRenderer;
    raycaster?: Raycaster;
    batchedRenderer?: BatchedParticleRenderer;
    transformControls?: TransformControls;
    private clock?: Clock;
    private cameraControls?: OrbitControls;

    private appContext?: AppContext;

    constructor(props: Readonly<ThreejsViewportProps>) {
        super(props);
        this.container = React.createRef();
    }

    componentDidMount(): void {
        if ( this.init() ) {
            this.animate();
        }
    }

    componentDidUpdate(prevProps: Readonly<ThreejsViewportProps>, prevState: Readonly<any>, snapshot?: any): void {
        this.camera!.aspect = this.props.width / this.props.height;
        this.camera!.updateProjectionMatrix();
        this.renderer!.setSize( this.props.width, this.props.height );
    }

    init() {
        if (!this.container.current) {
            return false;
        }

        if ( !WEBGL.isWebGLAvailable() ) {
            document.body.appendChild( WEBGL.getWebGLErrorMessage() );
            return false;
        }

        this.renderer = new WebGLRenderer();

        const scene = this.appContext!.scene;
        this.batchedRenderer = this.appContext!.batchedRenderer;

        /*if ( this.renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
            document.getElementById( 'notSupported' )!.style.display = '';
            return false;
        }*/

        const width = this.props.width;
        const height = this.props.height;

        this.clock = new Clock();

        this.camera = new PerspectiveCamera( 50, width / height, 1, 1000 );
        this.camera.position.set(50, 50, 50);

        this.cameraControls = new OrbitControls( this.camera, this.renderer.domElement );
        //this.cameraControls.enableKeys = false;
        this.cameraControls.enableDamping = true;
        this.cameraControls.dampingFactor = 0.1;
        this.cameraControls.rotateSpeed = 0.2;
        this.cameraControls.enabled = true;
        this.cameraControls.update();

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height );
        this.container.current!.appendChild( this.renderer.domElement );

        this.transformControls = new TransformControls(this.camera, this.renderer.domElement);
        this.transformControls.name = 'TransformControls';
        this.transformControls.enabled = false;
        this.transformControls.visible = false;
        scene.add(this.transformControls);

        this.raycaster = new Raycaster();

        this.appContext?.actions.setRenderer(this.transformControls);

        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.left = "";
        this.stats.dom.style.right = "0";
        this.container.current!.appendChild( this.stats.dom );

        this.container.current!.addEventListener( 'pointerup', this.onPointerUp );
        this.container.current!.addEventListener('contextmenu', event => event.preventDefault());

        this.onResize(null);

        return true;

    }

    onPointerUp = (event: MouseEvent) => {
        if (/*this.appContext!.viewPortControlType !== 'camera'*/event.button === 2) {
            const rect = (event.target! as HTMLDivElement).getBoundingClientRect();
            const x = event.clientX - rect.left; //x position within the element.
            const y = event.clientY - rect.top;
            const tx = rect.right - rect.left; //x position within the element.
            const ty = rect.bottom - rect.top;

            const pointer = new Vector2();
            pointer.x = (x / tx) * 2 - 1;
            pointer.y = -(y / ty) * 2 + 1;
            this.raycaster!.setFromCamera(pointer, this.camera!);
            const list: Object3D[] = [];

            const traverseManipulable = (obj: Object3D) => {
                if (obj.type === "Mesh" || obj.type === "ParticleSystemPreview" || obj.type === "PointLight" || obj.type === "AmbientLight")
                    list.push(obj);
                const children = obj.children;
                for ( let i = 0, l = children.length; i < l; i ++ ) {
                    if (children[i].type === "Group" || children[i].type === "Mesh" || children[i].type === "ParticleSystemPreview")
                        traverseManipulable(children[ i ]);
                }
            }
            traverseManipulable(this.appContext!.scene);
            let selected = false;
            const intersects = this.raycaster!.intersectObjects(list, false);
            if (intersects.length > 0) {
                for (let i = 0; i < intersects.length; i++) {
                    let selection;
                    if (intersects[i].object.type === "ParticleSystemPreview") {
                        selection = intersects[i].object.parent!;
                    } else {
                        selection = intersects[i].object;
                    }
                    if (this.appContext!.selection.length === 0 || selection!== this.appContext!.selection[0]) {
                        this.appContext!.actions.selectObject3d(selection);
                        selected = true;
                        break;
                    }
                    //intersects[ i ].object.material.color.set( 0xff0000 );
                }
            }
            if (!selected) {
                this.appContext!.actions.clearSelection();
            }
        }

    }

    onResize = (event: any ) => {

        if (this.renderer!.domElement.parentElement!.clientWidth - 10 !== this.renderer!.domElement.width ||
            this.renderer!.domElement.parentElement!.clientHeight - 10 !== this.renderer!.domElement.height) {

            const newWidth = this.renderer!.domElement.parentElement!.clientWidth - 10;
            const newHeight = this.renderer!.domElement.parentElement!.clientHeight - 10;

            this.camera!.aspect = newWidth / newHeight;
            this.camera!.updateProjectionMatrix();
            this.renderer!.domElement.style.width = '100%';
            this.renderer!.domElement.style.height = '100%';
            this.renderer!.setSize(newWidth, newHeight);
        }
    };

    animate = () => {
        requestAnimationFrame( this.animate );

        this.onResize(null);
        this.renderScene();
        this.stats!.update();
    };

    renderScene() {
        if (this.appContext) {
            this.cameraControls!.update();
            const delta = this.clock!.getDelta();
            //console.log(delta);
            //let time = performance.now() * 0.0005;
            //this.particleSystem!.update(this.clock!.getDelta());
            this.appContext.script(delta);
            //this.particleSystem!.emitter.rotation.y = this.clock!.getElapsedTime();
            //this.particleSystem!.emitter.position.set(Math.cos(this.clock!.getElapsedTime()) * 20, 0, Math.sin(this.clock!.getElapsedTime()) * 20);
            //console.log(this.particleSystem!.emitter.modelViewMatrix);

            this.appContext.scene.traverse(object => {
                if (object.userData && object.userData.func) {
                    object.userData.func.call(object, delta);
                }
                if (object instanceof ParticleEmitter) {
                    /*if (object.name === 'muzzle1' && object.system.particleNum > 0) {
                        console.log(object.system.particles);
                    }*/
                    object.system.update(delta);
                }
            });

            this.batchedRenderer!.update();
            this.renderer!.render(this.appContext.scene, this.camera!);
        }
    }

    setViewPortControlType = (type: string) => {
        if (type === 'camera') {
            this.cameraControls!.enabled = true;
            this.transformControls!.enabled = false;
            this.transformControls!.visible = false;

            this.transformControls!.detach();
        } else {
            this.cameraControls!.enabled = false;
            this.transformControls!.enabled = true;
            this.transformControls!.visible = true;
        }
        if (type === 'translate' || type === 'rotate' || type === 'scale') {
            this.transformControls!.mode = type;
        }
        if (this.appContext) {
            this.appContext.actions.setViewPortControlType(type);
        }
    }

    render() {
        return (
        <ApplicationContextConsumer>
            { context => {
                    if (context) {
                        this.appContext = context;
                        return <div ref={this.container} style={{width: '100%', height: '100%', position: 'relative'}}>
                            <ViewPortControls controlType={context.viewPortControlType}
                                              setControlType={this.setViewPortControlType}/>
                        </div>;
                    }
                }
            }
        </ApplicationContextConsumer>);
    }
}
