import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {BatchedParticleRenderer, FrameOverLife, ParticleSystem, PointEmitter, RenderMode} from "three.quarks";
import {ConeEmitter} from "three.quarks";
import {IntervalValue} from "three.quarks";
import {SizeOverLife} from "three.quarks";
import {PiecewiseBezier} from "three.quarks";
import {ColorRange} from "three.quarks";
import {ConstantColor} from "three.quarks";
import {SphereEmitter} from "three.quarks";
import {RotationOverLife} from "three.quarks";
import {ConstantValue} from "three.quarks";
import {Bezier} from "three.quarks";
import {ColorOverLife} from "three.quarks";
import {RandomColor} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";

// TODO
export class ToonExplosion extends Group {
    private mainBeam: ParticleSystem;
    private glowBeam: ParticleSystem;
    private particles: ParticleSystem;
    private beam: ParticleSystem;
    private smoke: ParticleSystem;
    private circle: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();

        const texture = textures[0].texture;
        this.mainBeam = new ParticleSystem(renderer, {
            duration: 2,
            looping: false,
            startLife: new IntervalValue(0.1, 0.3),
            startSpeed: new IntervalValue(5, 15),
            startSize: new IntervalValue(1.5, 1.25),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 8,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({
                angle: 25 * Math.PI / 180,
                radius: 0.2,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 2,
        });
        this.mainBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.mainBeam.emitter.name = 'mainBeam';
        this.add(this.mainBeam.emitter);

        this.glowBeam = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,

            startLife: new IntervalValue(1, 1.6),
            startSpeed: new IntervalValue(0.7, 1.5),
            startSize: new IntervalValue(0.4, 0.8),
            startColor: new ConstantColor(new Vector4(1, 0.1509503, 0.07352942, .5)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 8,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({
                angle: 80 * Math.PI / 180,
                radius: 0.25,
                thickness: 0.5,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 2,
        });
        this.glowBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.glowBeam.emitter.name = 'glowBeam';
        this.add(this.glowBeam.emitter);

        this.smoke = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.5, 0.8),
            startSpeed: new IntervalValue(1, 2.5),
            startSize: new IntervalValue(1, 1.5),
            startRotation: new IntervalValue(0, Math.PI * 2),
            startColor: new ConstantColor(new Vector4(1,1,1,.5)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 12,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new SphereEmitter({
                radius: .75,
                thickness: 1,
            }),

            texture: texture,
            blending: NormalBlending,
            startTileIndex: 2,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: -2,
        });
        this.smoke.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.1509503, 0.07352942, 1), new Vector4(0, 0, 0, 0))));
        this.smoke.addBehavior(new RotationOverLife(new IntervalValue(-Math.PI * 2, Math.PI * 2)));
        this.smoke.emitter.name = 'smoke';
        this.add(this.smoke.emitter);

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.6, 1.2),
            startSpeed: new IntervalValue(2, 10),
            startSize: new IntervalValue(.1, .4),
            startColor: new RandomColor(new Vector4(1,1,1,1), new Vector4(1, 0.1509503, 0.07352942, 1)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 12,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new ConeEmitter({
                angle: 50 / 180 * Math.PI,
                radius: .5,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: NormalBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.5,
            renderOrder: 0,
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.particles.emitter.name = 'particles';
        this.add(this.particles.emitter);

        this.beam = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,

            startLife: new ConstantValue(0.2),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(7),
            startColor: new ConstantColor(new Vector4(1, 0.3059356, 0.2426471, 1)),
            worldSpace: true,

            maxParticle: 10,
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
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 0,
        });
        this.beam.emitter.name = 'beam';
        this.beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.66666, 0.33333, 0), 0]])));
        this.add(this.beam.emitter);

        this.circle = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.4),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(4),
            startColor: new ConstantColor(new Vector4(1, 0.3059356, 0.2426471, 1)),
            worldSpace: true,

            maxParticle: 100,
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
            startTileIndex: 10,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 2,
        });
        this.circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])));
        this.circle.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])));
        this.circle.emitter.name = 'circle';
        this.add(this.circle.emitter);

    }

    update(delta: number) {
        this.mainBeam.update(delta);
        this.glowBeam.update(delta);
        this.particles.update(delta);
        this.smoke.update(delta);
        this.beam.update(delta);
        this.circle.update(delta);
    }
}
