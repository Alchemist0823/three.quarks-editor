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

export function createPickUp(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
    const group = new Group();
    group.name = "PickUp";
    const yellowColor = new Vector4(1, 1, 0.3, 1);
    const darkOrangeColor = new Vector4(1, 0.7, 0.1, 1);
    const redColor = new Vector4(1, 0, 0, 1);
    const texture = textures[0].texture;

    const circle = new ParticleSystem(renderer, {
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
    circle.addBehavior(new OrbitOverLife(new IntervalValue(6, 8)));

    circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.88, 0.88, 0), 0]])));
    circle.addBehavior(new ColorOverLife(new ColorRange(new Vector4(0.2, 0.6, 1, 1), new Vector4(0.2, 0.2, 1, 1))))
    circle.emitter.name = 'mainBeam';

    group.add(circle.emitter);

    const beam = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,

        startLife: new ConstantValue(0.6),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(100),
        startColor: new ConstantColor(yellowColor),
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
    beam.emitter.name = 'beam';
    beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.5, 0.6666, 1), 0]])));
    group.add(beam.emitter);

    const particles = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.6, 0.8),
        startSpeed: new IntervalValue(20, 30),
        startSize: new IntervalValue(2, 6),
        startColor: new RandomColor(darkOrangeColor, redColor),
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
    particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.3, 0.25, 0.1), 0]])));
    particles.emitter.renderOrder = 2;
    particles.emitter.name = 'particles';
    group.add(particles.emitter);

    const upflow = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,
        startLife: new ConstantValue(0.6),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(60),
        startColor: new RandomColor(new Vector4(1, 0.2, 0, 1), redColor),
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
    upflow.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.9, 0.6, 0.3), 0]])));
    upflow.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(38, 39, 40, 46), 0]])));
    upflow.emitter.name = 'upflow';
    group.add(upflow.emitter);
    return group;
}
