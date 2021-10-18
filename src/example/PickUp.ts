import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {
    BatchedParticleRenderer,
    Bezier,
    ColorOverLife, ColorRange, ConeEmitter,
    ConstantColor,
    ConstantValue, FrameOverLife, Gradient,
    IntervalValue, OrbitOverLife,
    ParticleSystem, PiecewiseBezier,
    PointEmitter, RandomColor,
    RenderMode, SizeOverLife, SphereEmitter
} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";

export class PickUp extends Group {

    static yellowColor = new Vector4(1, 1, 0.3, 1);
    static darkOrangeColor = new Vector4(1, 0.7, 0.1, 1);
    static redColor = new Vector4(1, 0, 0, 1);

    private particles: ParticleSystem;
    private circle: ParticleSystem;
    private upflow: ParticleSystem;
    private beam: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();

        const texture = textures[0].texture;

        this.circle = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.6),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(2, 10),
            startColor: new ConstantColor(new Vector4(1, 1, 1, .5)),
            worldSpace: false,

            maxParticle: 2000,
            emissionOverTime: new ConstantValue(40),

            emissionBursts: [{
                time: 0,
                count: 100,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],
            shape: new ConeEmitter({
                radius: 30,
                thickness: 2,
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
        this.circle.addBehavior(new OrbitOverLife(new IntervalValue(6, 8)));

        this.circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.88, 0.88, 0), 0]])));
        this.circle.addBehavior(new ColorOverLife(new ColorRange(new Vector4(0.2, 0.6, 1, 1), new Vector4(0.2, 0.2, 1, 1))))
        this.circle.emitter.name = 'mainBeam';

        this.add(this.circle.emitter);

        this.beam = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,

            startLife: new ConstantValue(0.6),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(100),
            startColor: new ConstantColor(PickUp.yellowColor),
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
            renderOrder: 0,
        });
        this.beam.emitter.name = 'beam';
        this.beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.5, 0.6666, 1), 0]])));
        this.add(this.beam.emitter);

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new IntervalValue(20, 30),
            startSize: new IntervalValue(2, 6),
            startColor: new RandomColor(PickUp.darkOrangeColor, PickUp.redColor),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0.4,
                count: 30,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],

            shape: new SphereEmitter({
                radius: 20,
                thickness: 3,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: NormalBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.1,
            renderOrder: 1,
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.3, 0.25, 0.1), 0]])));
        this.particles.emitter.renderOrder = 2;
        this.particles.emitter.name = 'particles';
        this.add(this.particles.emitter);

        this.upflow = new ParticleSystem(renderer, {
            duration: 1,
            looping: false,
            startLife: new ConstantValue(0.6),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(60),
            startColor: new RandomColor(new Vector4(1, 0.2, 0, 1), PickUp.redColor),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(0),
            emissionBursts: [{
                time: 0.4,
                count: 2,
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
            renderMode: RenderMode.LocalSpace,
            renderOrder: 1,
        });
        this.upflow.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.9, 0.6, 0.3), 0]])));
        this.upflow.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(38, 39, 40, 46), 0]])));
        this.upflow.emitter.name = 'upflow';
        this.add(this.upflow.emitter);

    }

    update(delta: number) {
        this.circle.update(delta);
        this.beam.update(delta);
        this.upflow.update(delta);
        this.particles.update(delta);
    }
}
