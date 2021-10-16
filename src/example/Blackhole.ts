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

export class Blackhole extends Group {
    private beam: ParticleSystem;
    private particles: ParticleSystem;
    private ring: ParticleSystem;

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();

        const texture = textures[0].texture;

        this.beam = new ParticleSystem(renderer,{
            duration: 1,
            looping: true,
            startLife: new ConstantValue(1),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(40),
            startColor: new ConstantColor(new Vector4(0, 0, 0, 1)),
            worldSpace: false,
            maxParticle: 100,
            emissionOverTime: new ConstantValue(1),
            emissionBursts: [],
            shape: new PointEmitter(),
            texture: texture,
            blending: 1,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: 0,
            renderOrder: 0,
        });
        this.beam.emitter.name = 'beam';
        this.beam.emitter.rotation.set(0, 0, 0);
        this.add(this.beam.emitter);

        this.particles = new ParticleSystem(renderer, {
            duration: 1,
            looping: true,
            startLife: new ConstantValue(3),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(4),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: false,
            maxParticle: 10000,
            emissionOverTime: new ConstantValue(8),
            emissionBursts: [],
            shape: new SphereEmitter({
                radius: 18,
                arc: Math.PI * 2,
                thickness: 0.01
            }),
            texture: texture,
            blending: 2,
            startTileIndex: 4,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: 0,
            renderOrder: 0,
        });
        this.particles.addBehavior(new OrbitOverLife(new ConstantValue(1)));
        this.particles.addBehavior(new ColorOverLife(new Gradient([[new ColorRange(new Vector4(0,0,0,1), new Vector4(1,1,1,1)),0],
            [new ColorRange(new Vector4(1,1,1,1), new Vector4(1,1,1,1)),0.2],
            [new ColorRange(new Vector4(1,1,1,1), new Vector4(0,0,0,1)),0.8]
        ])));
        this.particles.emitter.name = 'particles';
        this.particles.emitter.rotation.set(0, 0, 0);
        this.add(this.particles.emitter);

        this.ring = new ParticleSystem(renderer, {
            duration: 1,
            looping: true,
            startLife: new ConstantValue(1),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(30),
            startColor: new ConstantColor(new Vector4(0.9254901960784314, 0.788235294117647, 0.1607843137254902, 1)),
            worldSpace: false,
            maxParticle: 100,
            emissionOverTime: new ConstantValue(1),
            emissionBursts: [],
            shape: new PointEmitter(),
            texture: texture,
            blending: 2,
            startTileIndex: 4,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: 0,
            renderOrder: 0,
        });
        this.ring.emitter.name = 'ring';
        this.ring.emitter.rotation.set(0, 0, 0);
        this.add(this.ring.emitter);

    }

    update(delta: number) {
        this.beam.update(delta);
        this.particles.update(delta);
        this.ring.update(delta);
    }
}
