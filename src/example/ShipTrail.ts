import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {ColorOverLife, ParticleSystem, PointEmitter, RenderMode} from "three.quarks";
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
import {Gradient} from "three.quarks";
import {RandomColor} from "three.quarks";

export class ShipTrail extends Group {
    private particles: ParticleSystem;
    private glowBeam: ParticleSystem;
    private beam: ParticleSystem;

    constructor() {
        super();

        let texture = new TextureLoader().load( "textures/texture1.png");
        texture.name = "textures/texture1.png";

        this.beam = new ParticleSystem({
            duration: 1,
            looping: true,
            startLife: new ConstantValue(1.0),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(20.0),
            startColor: new ConstantColor(new Vector4(0.5220588* 0.772549, 0.6440161* 0.772549, 1 * 0.772549, 0.772549)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(1),
            emissionBursts: [],
            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
        });
        this.beam.emitter.renderOrder = 0;
        this.beam.emitter.name = 'beam';
        this.add(this.beam.emitter);

        this.add(this.beam.emitter);

        this.glowBeam = new ParticleSystem({
            duration: 1,
            looping: true,
            startLife: new ConstantValue(0.5),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(10),
            startColor: new ConstantColor(new Vector4(0.5220588* 0.772549, 0.6440161* 0.772549, 1 * 0.772549, 0.772549)),
            worldSpace: true,

            maxParticle: 500,
            emissionOverTime: new ConstantValue(120),

            shape: new SphereEmitter({
                radius: .0001,
                thickness: 1,
                arc: Math.PI * 2,
            }),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
        });
        this.glowBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 1.0, 0.8, 0.5), 0]])));
        this.glowBeam.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1,1,1,1), new Vector4(0,0,0,0))));
        this.glowBeam.emitter.renderOrder = 2;
        this.glowBeam.emitter.name = 'glowBeam';

        this.add(this.glowBeam.emitter);


        this.particles = new ParticleSystem({
            duration: 1,
            looping: true,
            startLife: new IntervalValue(0.3, 0.6),
            startSpeed: new IntervalValue(20, 40),
            startSize: new IntervalValue(1, 2),
            startColor: new RandomColor(new Vector4(1,1,1,.5), new Vector4(0.5220588, 0.6440161, 1, 0.772549)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(60),

            shape: new ConeEmitter({
                angle: 80 / 180 * Math.PI,
                radius: 1,
                thickness: 0.3,
                arc: Math.PI * 2,
            }),
            texture: texture,
            renderMode: RenderMode.StretchedBillBoard,
            speedFactor: .2,
            blending: NormalBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.particles.emitter.renderOrder = 0;
        this.particles.emitter.rotateY(-Math.PI/2);
        this.particles.emitter.name = 'particles';
        this.add(this.particles.emitter);

        this.userData = {
            script:
                "    this.position.x += delta * 200;\n" +
                "    if (this.position.x > 200)\n" +
                "        this.position.x = -200;\n"
        };
        this.userData.func = new Function("delta", this.userData.script);
    }

    update(delta: number) {
        this.beam.update(delta);
        this.glowBeam.update(delta);
        this.particles.update(delta);
    }
}
