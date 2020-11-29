import {AdditiveBlending, Group, TextureLoader, Vector4} from "three";
import {
    Bezier,
    ColorOverLife, ColorRange, ConeEmitter,
    ConstantColor,
    ConstantValue, Gradient,
    IntervalValue, OrbitOverLife,
    ParticleSystem, PiecewiseBezier,
    PointEmitter,
    RenderMode, SizeOverLife, SphereEmitter
} from "three.quarks";

export class LevelUp extends Group {

    private gatherParticles: ParticleSystem;
    private glow: ParticleSystem;
    private glow2: ParticleSystem;
    private particle: ParticleSystem;

    constructor() {
        super();
        this.name = 'levelUp';

        let texture = new TextureLoader().load( "textures/texture1.png");
        texture.name = "textures/texture1.png";

        let yellow = new Vector4(.8,.8,.2, 1);

        this.gatherParticles = new ParticleSystem({
            duration: 0.5,
            looping: false,
            startLife: new IntervalValue(0.3, 0.4),
            startSpeed: new IntervalValue(-100, -150),
            startSize: new IntervalValue(1, 2),
            startColor: new ConstantColor(yellow),
            worldSpace: false,
            maxParticle: 100,
            emissionOverTime: new ConstantValue(100),
            shape: new SphereEmitter({
                radius: 60,
                thickness: .8,
                arc: Math.PI
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: 0.05
        });
        //this.gatherParticles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.gatherParticles.addBehavior(new ColorOverLife(new ColorRange(new Vector4(.2, .2, .2, 1), new Vector4(1, 1, 1, 1))));
        this.gatherParticles.emitter.name = 'gatherParticles';
        this.gatherParticles.emitter.renderOrder = 2;
        this.add(this.gatherParticles.emitter);

        let glowParam = {
            duration: 2,
            looping: false,
            startLife: new ConstantValue(2.0),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(60, 80),
            startColor: new ConstantColor(yellow),
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


        let glow2Param = {
            duration: 2,
            looping: false,
            startLife: new ConstantValue(2.0),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(60, 80),
            startColor: new ConstantColor(yellow),
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
            renderMode: RenderMode.BillBoard
        };

        this.glow2 = new ParticleSystem(glow2Param);
        /*this.glow.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 0), new Vector4(0, 1, 0.25, 1)), 0],
            [new ColorRange(new Vector4(0, 1, 0.25, 1), new Vector4(1, 1, 1, 0)), 0.5]
        ])));*/
        this.glow2.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0, 0.75, 0.90, 1), 0], [new Bezier(1, 0.90, 0.75, 0), 0.2]])));
        this.glow2.emitter.renderOrder = 0;
        this.glow2.emitter.name = 'glow2';
        this.add(this.glow2.emitter);

        let particleParam = {
            duration: 1.0,
            looping: false,
            startLife: new IntervalValue(0.6, 0.8),
            startSpeed: new IntervalValue(120, 180),
            startSize: new IntervalValue(2, 4),
            startColor: new ConstantColor(yellow),
            worldSpace: false,
            maxParticle: 100,
            emissionOverTime: new PiecewiseBezier([[new Bezier(0, 0, 0, 0), 0], [new Bezier(50, 80, 80, 50), 0.4]]),
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
        this.gatherParticles.update(delta);
        this.glow.update(delta);
        this.glow2.update(delta);
        this.particle.update(delta);
    }
}
