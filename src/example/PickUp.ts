import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {
    Bezier,
    ColorOverLife, ColorRange, ConeEmitter,
    ConstantColor,
    ConstantValue, FrameOverLife, Gradient,
    IntervalValue, OrbitOverLife,
    ParticleSystem, PiecewiseBezier,
    PointEmitter, RandomColor,
    RenderMode, SizeOverLife, SphereEmitter
} from "three.quarks";

export class PickUp extends Group {

    static yellowColor = new Vector4(1, 1, 0.3, 1);
    static darkOrangeColor = new Vector4(1, 0.7, 0.1, 1);
    static redColor = new Vector4(1, 0, 0, 1);

    private particles: ParticleSystem;
    private circle: ParticleSystem;
    private upflow: ParticleSystem;
    private beam: ParticleSystem;

    constructor() {
        super();

        let texture = new TextureLoader().load( "textures/texture1.png");
        texture.name = "textures/texture1.png";

        this.circle = new ParticleSystem({
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
            renderMode: RenderMode.BillBoard
        });
        this.circle.addBehavior(new OrbitOverLife(new IntervalValue(6, 8)));

        this.circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.88, 0.88, 0), 0]])));
        this.circle.addBehavior(new ColorOverLife(new ColorRange(new Vector4(0.2, 0.6, 1, 1), new Vector4(0.2, 0.2, 1, 1))))
        this.circle.emitter.renderOrder = 3;
        this.circle.emitter.name = 'mainBeam';

        this.add(this.circle.emitter);

        this.beam = new ParticleSystem({
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
            renderMode: RenderMode.BillBoard
        });
        this.beam.emitter.renderOrder = 0;
        this.beam.emitter.name = 'beam';
        this.beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.5, 0.6666, 1), 0]])));
        this.add(this.beam.emitter);

        this.particles = new ParticleSystem({
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
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.3, 0.25, 0.1), 0]])));
        this.particles.emitter.renderOrder = 2;
        this.particles.emitter.name = 'particles';
        this.add(this.particles.emitter);

        this.upflow = new ParticleSystem({
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
            renderMode: RenderMode.LocalSpaceBillBoard
        });
        this.upflow.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.9, 0.6, 0.3), 0]])));
        this.upflow.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(38, 39, 40, 46), 0]])));
        this.upflow.emitter.renderOrder = 1;
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
