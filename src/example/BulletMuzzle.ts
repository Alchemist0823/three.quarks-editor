import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
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

export class BulletMuzzle extends Group {
    private beam: ParticleSystem;
    private muzzle1: ParticleSystem;
    private muzzle2: ParticleSystem;
    private flash: ParticleSystem;
    private smoke: ParticleSystem;
    private particles: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();

        const texture = textures[0].texture;

        this.beam = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.1, 0.2),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(4),
            startColor: new ConstantColor(new Vector4(1, 0.585716, 0.1691176, 1)),
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
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
        });
        this.beam.emitter.renderOrder = 0;
        this.beam.emitter.name = 'beam';
        this.beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.add(this.beam.emitter);

        const muzzle = {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.1, 0.2),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(1, 5),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
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
            startTileIndex: 91,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.LocalSpaceBillBoard,
            renderOrder: 2,
        };

        this.muzzle1 = new ParticleSystem(renderer, muzzle);
        this.muzzle1.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.3882312, 0.125, 1), new Vector4(1, 0.826827, 0.3014706, 1))));
        this.muzzle1.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.muzzle1.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(91, 94, 97, 100), 0]])));
        this.muzzle1.emitter.name = 'muzzle1';
        this.muzzle1.emitter.position.x = 1;
        this.add(this.muzzle1.emitter);

        this.muzzle2 = new ParticleSystem(renderer, muzzle);
        this.muzzle2.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.3882312, 0.125, 1), new Vector4(1, 0.826827, 0.3014706, 1))));
        this.muzzle2.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.muzzle2.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(91, 94, 97, 100), 0]])));
        this.muzzle2.emitter.renderOrder = 2;
        this.muzzle2.emitter.name = 'muzzle2';
        this.muzzle2.emitter.position.x = 1;
        this.muzzle2.emitter.rotation.x = Math.PI / 2;
        this.add(this.muzzle2.emitter);

        this.flash = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.1, 0.2),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(1, 2.5),
            startRotation: new IntervalValue(-Math.PI, Math.PI),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: false,

            maxParticle: 5,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 2,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 81,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: 2,
        });
        this.flash.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.95, 0.82, 1), new Vector4(1, 0.38, 0.12, 1))));
        this.flash.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(81, 84.333, 87.666, 91), 0]])));
        this.flash.emitter.name = 'flash';
        this.add(this.flash.emitter);

        this.smoke = new ParticleSystem(renderer, {
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
            renderMode: RenderMode.BillBoard,
            renderOrder: -2,
        });
        this.smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 0))));
        this.smoke.addBehavior(new RotationOverLife(new IntervalValue(- Math.PI / 4, Math.PI / 4)));
        this.smoke.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(28, 31, 34, 37), 0]])));
        this.smoke.emitter.name = 'smoke';
        this.smoke.emitter.rotation.y = Math.PI / 2;
        this.add(this.smoke.emitter);

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.2, 0.6),
            startSpeed: new IntervalValue(1, 15),
            startSize: new IntervalValue(0.1, 0.3),
            startColor: new RandomColor(new Vector4(1, 0.91, 0.51, 1), new Vector4(1, 0.44, 0.16, 1)),
            worldSpace: true,

            maxParticle: 10,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 8,
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
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.5,
            renderOrder: 0,
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.particles.emitter.name = 'particles';
        this.particles.emitter.rotation.y = Math.PI / 2;
        this.add(this.particles.emitter);
    }

    update(delta: number) {
        this.beam.update(delta);
        this.muzzle1.update(delta);
        this.muzzle2.update(delta);
        this.flash.update(delta);
        this.smoke.update(delta);
        this.particles.update(delta);
    }
}
