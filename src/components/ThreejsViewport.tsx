import * as React from "react";
import Stats from "stats.js";
import {WEBGL} from "../WebGL";
import {
    PerspectiveCamera,
    WebGLRenderer,
    Clock,
} from "three";
import {RefObject} from "react";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ParticleEmitter} from "three.quarks";
import {AppContext, ApplicationContextConsumer} from "./ApplicationContext";

interface ThreejsViewportProps {
    width: number;
    height: number;
}

export class ThreejsViewport extends React.PureComponent<ThreejsViewportProps> {
    container: RefObject<HTMLDivElement>;
    stats?: Stats;
    camera?: PerspectiveCamera;
    renderer?: WebGLRenderer;
    private clock?: Clock;
    private controls?: OrbitControls;

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

    componentDidUpdate(prevProps: Readonly<ThreejsViewportProps>, prevState: Readonly<{}>, snapshot?: any): void {
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

        /*if ( this.renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {
            document.getElementById( 'notSupported' )!.style.display = '';
            return false;
        }*/

        const width = this.props.width;
        const height = this.props.height;

        this.clock = new Clock();

        this.camera = new PerspectiveCamera( 50, width / height, 1, 1000 );
        this.camera.position.set(50, 50, 50);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableKeys = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.rotateSpeed = 0.2;
        this.controls.update();

        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( width, height );
        this.container.current!.appendChild( this.renderer.domElement );

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
            this.controls!.update();
            const delta = this.clock!.getDelta();
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

            this.renderer!.render(this.appContext.scene, this.camera!);
        }
    }

    render() {
        console.log( "rendering ThreejsViewPort");
        return (
        <ApplicationContextConsumer>
            { context => {
                    if (context) {
                        this.appContext = context;
                        return <div ref={this.container} style={{width: '100%', height: '100%'}}></div>;
                    }
                }
            }
        </ApplicationContextConsumer>);
    }
}
