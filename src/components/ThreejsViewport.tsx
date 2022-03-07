import * as React from "react";
import Stats from "stats.js";
import {WEBGL} from "../WebGL";
import {
    PerspectiveCamera,
    WebGLRenderer,
    Clock, Color, AxesHelper, PointLight, AmbientLight,
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

interface ThreejsViewportStats {
    viewPortControlType: string;
}

export class ThreejsViewport extends React.PureComponent<ThreejsViewportProps, ThreejsViewportStats> {
    container: RefObject<HTMLDivElement>;
    stats?: Stats;
    camera?: PerspectiveCamera;
    renderer?: WebGLRenderer;
    batchedRenderer?: BatchedParticleRenderer;
    transformControls?: TransformControls;
    private clock?: Clock;
    private cameraControls?: OrbitControls;

    private appContext?: AppContext;

    constructor(props: Readonly<ThreejsViewportProps>) {
        super(props);
        this.container = React.createRef();
        this.state = {
            viewPortControlType: "camera"
        }
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

        this.batchedRenderer = new BatchedParticleRenderer();
        this.batchedRenderer.name = "batched particle renderer";
        scene.add(this.batchedRenderer);

        scene.background = new Color(0x666666);

        const axisHelper = new AxesHelper(100);
        axisHelper.name = "axisHelper";
        scene.add(axisHelper);

        const light = new PointLight(new Color(1, 1, 1), 0.8, 200);
        light.position.set(50, 50, 50);
        scene.add(light);

        const ambientLight = new AmbientLight(new Color(1, 1, 1), 0.2);
        scene.add(ambientLight);

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
        this.cameraControls.enableKeys = false;
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
        this.transformControls!.visible = false;
        scene.add(this.transformControls);

        this.appContext?.actions.setRenderer(this.batchedRenderer, this.transformControls);

        this.stats = new Stats();
        this.stats.dom.style.position = "absolute";
        this.stats.dom.style.left = "";
        this.stats.dom.style.right = "0";
        this.container.current!.appendChild( this.stats.dom );

        //window.addEventListener( 'resize', this.onWindowResize, false );

        this.onResize(null);

        return true;

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
        this.setState({viewPortControlType: type});
    }

    render() {
        console.log( "rendering ThreejsViewPort");
        return (
        <ApplicationContextConsumer>
            { context => {
                    if (context) {
                        this.appContext = context;
                        return <div ref={this.container} style={{width: '100%', height: '100%', position: 'relative'}}>
                            <ViewPortControls controlType={this.state.viewPortControlType}
                                              setControlType={this.setViewPortControlType}/>
                        </div>;
                    }
                }
            }
        </ApplicationContextConsumer>);
    }
}
