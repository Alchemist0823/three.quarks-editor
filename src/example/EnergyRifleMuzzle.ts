import {
    AdditiveBlending,
    ConeBufferGeometry,
    CylinderBufferGeometry,
    Group,
    NormalBlending,
    TextureLoader,
    Vector4
} from "three";
import {
    BatchedParticleRenderer,
    ColorOverLife,
    ParticleSystem,
    PointEmitter,
    RenderMode,
    RotationOverLife
} from "three.quarks";
import {ConeEmitter} from "three.quarks";
import {IntervalValue} from "three.quarks";
import {SizeOverLife} from "three.quarks";
import {PiecewiseBezier} from "three.quarks";
import {ColorRange} from "three.quarks";
import {ConstantColor} from "three.quarks";
import {SphereEmitter} from "three.quarks";
import {FrameOverLife} from "three.quarks";
import {ConstantValue} from "three.quarks";
import {Bezier} from "three.quarks";
import {Gradient} from "three.quarks";
import {RandomColor} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";

export class EnergyRifleMuzzle extends Group {
    private particles: ParticleSystem;
    private glow: ParticleSystem;
    private glowTop: ParticleSystem;
    //private ringTop: ParticleSystem;
    private ringBase: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer,textures: TextureImage[]) {
        super();

        const texture = textures[1].texture;

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.2, 0.6),
            startSpeed: new IntervalValue(20, 50),
            startSize: new ConstantValue(2),
            startColor: new ConstantColor(new Vector4(0.5, 0.5, 0.5, 1)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 24,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({angle: .2, radius: 5}),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.1,
            renderOrder: 0,
        });
        this.particles.emitter.renderOrder = 0;
        this.particles.emitter.name = 'particles';
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.particles.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0.8, 1, 1))));
        this.add(this.particles.emitter);

        const glow = {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(60, 80),
            startColor: new ConstantColor(new Vector4(0, 0.3, 0.3, 1)),
            worldSpace: false,

            maxParticle: 5,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: -2,
        };

        this.glow = new ParticleSystem(renderer, glow);
        this.glow.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 1))));
        //this.glow.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.glow.emitter.name = 'glow';
        this.glow.emitter.position.x = 1;
        this.add(this.glow.emitter);

        this.glowTop = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new IntervalValue(0, 50),
            startSize: new IntervalValue(40, 60),
            startRotation: new ConstantValue(0),
            startColor: new ConstantColor(new Vector4(0, 0.2, 0.2, 1)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 5,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({angle: .01, radius: 1}),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: -2,
        });
        this.glowTop.emitter.name = 'glowTop';
        this.glowTop.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1)), 0],
            [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 1)), 0.5],
        ])));
        //this.glowTop.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.add(this.glowTop.emitter);

        /*
        this.ringTop = new ParticleSystem(renderer, {
            duration: 2.5,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new IntervalValue(0.1, 3),
            startSize: new IntervalValue(0.75, 1.5),
            startRotation: new IntervalValue(-Math.PI, Math.PI),
            startColor: new RandomColor(new Vector4(0.6323, 0.6323, 0.6323, .31), new Vector4(1, 1, 1, 0.54)),
            worldSpace: true,

            maxParticle: 10,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 5,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({
                angle: 20 * Math.PI / 180,
                radius: 0.3,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: NormalBlending,
            startTileIndex: 81,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard
        });
        this.ringTop.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 0))));
        this.ringTop.addBehavior(new RotationOverLife(new IntervalValue(- Math.PI / 4, Math.PI / 4)));
        this.ringTop.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(28, 31, 34, 37), 0]])));
        this.ringTop.emitter.renderOrder = -2;
        this.ringTop.emitter.name = 'smoke';
        this.ringTop.emitter.rotation.y = Math.PI / 2;
        this.add(this.ringTop.emitter);
*/
        const coneBufferGeometry = new CylinderBufferGeometry(10, 6, 4, 16, 1, true);
        coneBufferGeometry.rotateX(Math.PI / 2);
        /*console.log(coneBufferGeometry.getIndex()!.array);
        console.log(coneBufferGeometry.getAttribute('position').array);
        console.log(coneBufferGeometry.getAttribute('uv').array);*/


        this.ringBase = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.8),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(1),
            startColor: new ConstantColor(new Vector4(0, 1, 1, 1)),
            worldSpace: false,

            maxParticle: 10,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 1,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 91,
            uTileCount: 10,
            vTileCount: 10,
            instancingGeometry: coneBufferGeometry,
            renderMode: RenderMode.LocalSpace,
            renderOrder: 1,
        });
        this.ringBase.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1)), 0],
            [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 1)), 0.5],
        ])));
        this.ringBase.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.5, 0.75, 0.95, 1), 0]])));
        this.ringBase.emitter.name = 'ringBase';
        //this.ringBase.emitter.rotation.y = Math.PI / 2;
        this.add(this.ringBase.emitter);
    }

    update(delta: number) {
        //this.ringTop.update(delta);
        this.ringBase.update(delta);
        this.glowTop.update(delta);
        this.glow.update(delta);
        this.particles.update(delta);
    }
}
