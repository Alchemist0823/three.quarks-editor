import {AdditiveBlending, Group, NormalBlending, Scene, TextureLoader, Vector4} from "three";
import {
    BatchedParticleRenderer,
    Bezier, ColorOverLife, ColorRange, ConstantColor,
    ConstantValue, FrameOverLife,
    IntervalValue,
    ParticleSystem,
    PiecewiseBezier, PointEmitter, RandomColor,
    RenderMode, RotationOverLife,
    SizeOverLife, SpeedOverLife,
    SphereEmitter
} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";

export class Explosion2 extends Group {

    static yellowColor = new Vector4(0.9, 0.60, 0.25, 1);
    static yellowColor2 = new Vector4(1, 0.95, 0.4, 1);

    private mainBeam: ParticleSystem;
    private glowBeam: ParticleSystem;
    private smoke: ParticleSystem;
    private particles: ParticleSystem;
    private beam: ParticleSystem;
    private circle: ParticleSystem;
    private circle2: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();

        const texture = textures[0].texture;
        const mainColor = Explosion2.yellowColor;
        const secColor = Explosion2.yellowColor2;

        this.mainBeam = new ParticleSystem(renderer, {
            duration: 2,
            looping: false,
            startLife: new IntervalValue(0.1, 0.3),
            startSpeed: new IntervalValue(100, 300),
            startSize: new IntervalValue(1.5, 12.5),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 8,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new SphereEmitter({
                radius: 2,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: 2,
        });
        this.mainBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.mainBeam.emitter.name = 'mainBeam';
        this.add(this.mainBeam.emitter);

        this.glowBeam = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,

            startLife: new IntervalValue(1, 1.6),
            startSpeed: new IntervalValue(20, 45),
            startSize: new IntervalValue(4, 8),
            startColor: new ConstantColor(mainColor),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0,
                count: 8,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new SphereEmitter({
                radius: 2,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: 2,
        });
        this.glowBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.glowBeam.emitter.name = 'glowBeam';
        this.add(this.glowBeam.emitter);

        this.smoke = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.8, 1.2),
            startSpeed: new IntervalValue(20, 50),
            startSize: new IntervalValue(10, 15),
            startRotation: new IntervalValue(0, Math.PI * 2),
            startColor: new ConstantColor(new Vector4(1,1,1,.5)),
            worldSpace: false,

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
                radius: 7.5,
                arc: Math.PI,
                thickness: 1,
            }),

            texture: texture,
            blending: NormalBlending,
            startTileIndex: 2,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
            renderOrder: -2,
        });
        this.smoke.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.smoke.addBehavior(new ColorOverLife(new ColorRange(mainColor, new Vector4(0, 0, 0, 0))));
        this.smoke.addBehavior(new RotationOverLife(new IntervalValue(-Math.PI * 2, Math.PI * 2)));
        this.smoke.addBehavior(new SpeedOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.smoke.emitter.name = 'smoke';
        this.add(this.smoke.emitter);

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.6, 1.2),
            startSpeed: new IntervalValue(40, 200),
            startSize: new IntervalValue(1, 4),
            startColor: new RandomColor(new Vector4(1,1,1,1), mainColor),
            worldSpace: false,

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
                radius: 2,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: NormalBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.1,
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
            startSize: new ConstantValue(100),
            startColor: new ConstantColor(secColor),
            worldSpace: false,

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
            renderMode: RenderMode.BillBoard,
            renderOrder: -2,
        });
        this.beam.emitter.name = 'beam';
        this.beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.66666, 0.33333, 0), 0]])));
        this.add(this.beam.emitter);

        this.circle = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.4),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(40),
            startColor: new ConstantColor(secColor),
            worldSpace: false,

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
            renderMode: RenderMode.BillBoard,
            renderOrder: 2,
        });
        this.circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])));
        this.circle.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])));
        this.circle.emitter.name = 'circle';
        this.add(this.circle.emitter);


        this.circle2 = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.4),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(40),
            startColor: new ConstantColor(secColor),
            worldSpace: false,

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
            renderMode: RenderMode.LocalSpaceBillBoard,
            renderOrder: 2,
        });
        this.circle2.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])));
        this.circle2.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])));
        this.circle2.emitter.name = 'circle';
        this.circle2.emitter.rotation.x = Math.PI / 2;
        this.add(this.circle2.emitter);
    }

    update(delta: number) {
        //delta /= 1000;
        this.beam.update(delta);
        this.mainBeam.update(delta);
        this.glowBeam.update(delta);
        this.circle.update(delta);
        this.smoke.update(delta);
        this.particles.update(delta);
        this.circle2.update(delta);
    }
}
