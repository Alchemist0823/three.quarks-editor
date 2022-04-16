import {
    ConstantValue,
    ParticleSystem,
    ConstantColor,
    PointEmitter,
    SphereEmitter,
    OrbitOverLife,
    PiecewiseBezier, Gradient, ColorRange, ColorOverLife, Bezier, BatchedParticleRenderer
} from "three.quarks";
import {Group, Vector4} from "three";
import {TextureImage} from "../components/ApplicationContext";

export function createBlackHole(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
    const group = new Group();
    group.name = "BlackHole";

    const texture = textures[0].texture;

    const beam = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new ConstantValue(1),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(40),
        startColor: new ConstantColor(new Vector4(0, 0, 0, 1)),
        worldSpace: false,
        
        emissionOverTime: new ConstantValue(1),
        emissionBursts: [],
        shape: new PointEmitter(),
        texture: texture,
        blending: 1,
        startTileIndex: new ConstantValue(0),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: 0,
        renderOrder: 0,
    });
    beam.emitter.name = 'beam';
    beam.emitter.rotation.set(0, 0, 0);
    group.add(beam.emitter);

    const particles = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new ConstantValue(3),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(4),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
        worldSpace: false,
        
        emissionOverTime: new ConstantValue(8),
        emissionBursts: [],
        shape: new SphereEmitter({
            radius: 18,
            arc: Math.PI * 2,
            thickness: 0.01
        }),
        texture: texture,
        blending: 2,
        startTileIndex: new ConstantValue(4),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: 0,
        renderOrder: 0,
    });
    particles.addBehavior(new OrbitOverLife(new ConstantValue(1)));
    particles.addBehavior(new ColorOverLife(new Gradient([[new ColorRange(new Vector4(0, 0, 0, 1), new Vector4(1, 1, 1, 1)), 0],
        [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 1)), 0.2],
        [new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(0, 0, 0, 1)), 0.8]
    ])));
    particles.emitter.name = 'particles';
    particles.emitter.rotation.set(0, 0, 0);
    group.add(particles.emitter);

    const ring = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new ConstantValue(1),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(30),
        startColor: new ConstantColor(new Vector4(0.9254901960784314, 0.788235294117647, 0.1607843137254902, 1)),
        worldSpace: false,
        
        emissionOverTime: new ConstantValue(1),
        emissionBursts: [],
        shape: new PointEmitter(),
        texture: texture,
        blending: 2,
        startTileIndex: new ConstantValue(4),
        uTileCount: 10,
        vTileCount: 10,
        renderMode: 0,
        renderOrder: 0,
    });
    ring.emitter.name = 'ring';
    ring.emitter.rotation.set(0, 0, 0);
    group.add(ring.emitter);

    return group;
}
