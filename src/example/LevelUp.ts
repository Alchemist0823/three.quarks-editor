import {AdditiveBlending, Group, TextureLoader, Vector4} from "three";
import {
    Bezier,
    ColorOverLife, ColorRange, ConeEmitter,
    ConstantColor,
    ConstantValue, Gradient,
    IntervalValue, OrbitOverLife,
    ParticleSystem, PiecewiseBezier,
    PointEmitter,
    RenderMode, SizeOverLife
} from "three.quarks";

export class LevelUp extends Group {

    private glow: ParticleSystem;
    private particle: ParticleSystem;

    constructor() {
        super();

        let texture = new TextureLoader().load( "textures/texture1.png");
        texture.name = "textures/texture1.png";

        let glowParam = {
            duration: 2,
            looping: false,
            startLife: new ConstantValue(2.0),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(60, 80),
            startColor: new ConstantColor(new Vector4(1, 1, 0.8, 1)),
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
            instancingGeometry: [
                -1, -1, 0, 0, 0,
                1, -1, 0, 1, 0,
                1, 1, 0, 1, 1,
                -1, 1, 0, 0, 1
            ],
            renderMode: RenderMode.LocalSpaceBillBoard
        };

        this.glow = new ParticleSystem(glowParam);
        /*this.glow.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 0), new Vector4(0, 1, 0.25, 1)), 0],
            [new ColorRange(new Vector4(0, 1, 0.25, 1), new Vector4(1, 1, 1, 0)), 0.5]
        ])));*/
        this.glow.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.75, 0.90, 1),0], [new Bezier(1, 0.90, 0.75, 0), 0.5]])));
        this.glow.emitter.renderOrder = 0;
        this.glow.emitter.name = 'glow';
        this.glow.emitter.rotation.x = -Math.PI / 2;
        this.add(this.glow.emitter);


        let particleParam = {
            duration: 0.6,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new IntervalValue(120, 180),
            startSize: new IntervalValue(2, 4),
            startColor: new ConstantColor(new Vector4(1, 1, 0.8, 1)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(80),
            /*emissionBursts: [{
                time: 0,
                count: 30,
                cycle: 1,
                interval: 0.01,
                probability: 1,
            }],*/
            shape: new ConeEmitter({
                radius: 25,
                thickness: 0.2,
                angle: Math.PI / 100
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            //speedFactor: 0.1,
            renderMode: RenderMode.BillBoard
        };

        this.particle = new ParticleSystem(particleParam);
        this.particle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.75, 0.90, 1),0], [new Bezier(1, 0.90, 0.75, 0), 0.5]])));
        this.particle.addBehavior(new OrbitOverLife(new PiecewiseBezier([[new Bezier(0, Math.PI * 4* 0.75, Math.PI * 4 * 0.90, Math.PI * 4),0]])));
        this.particle.emitter.renderOrder = 2;
        this.particle.emitter.name = 'particle';
        this.particle.emitter.rotation.x = -Math.PI / 2;
        this.add(this.particle.emitter);

    }

    update(delta: number) {
        this.glow.update(delta);
        this.particle.update(delta);
    }
}
