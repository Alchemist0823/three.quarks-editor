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
export class ElectricBall extends Group {
    private beam: ParticleSystem;
    private beamWorld: ParticleSystem;
    private electricity: ParticleSystem;
    private electricBall: ParticleSystem;
    /*private sparks: ParticleSystem;*/

    constructor(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
        super();
        this.name = 'ElectricBall';

        const texture2 = textures[1].texture;
        this.beam = new ParticleSystem(renderer, {
            duration: 1,
            looping: true,
            startLife: new ConstantValue(1.0),
            startSpeed: new ConstantValue(0),
            startSize: new ConstantValue(15.0),
            startColor: new ConstantColor(new Vector4(0.5220588* 0.772549, 0.6440161* 0.772549, 1 * 0.772549, 0.772549)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(1),
            emissionBursts: [],
            shape: new PointEmitter(),
            texture: texture2,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 0,
        });
        this.beam.emitter.name = 'beam';
        this.add(this.beam.emitter);

        this.beamWorld = new ParticleSystem(renderer, {
            duration: 1,
            looping: true,
            startLife: new IntervalValue(0.1, 0.4),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(7.5, 15),
            startColor: new RandomColor(new Vector4(0.1397059 * 0.8, 0.3592291 * 0.8, 1 * 0.8, 1), new Vector4(1 * 0.8, 0.9275356 * 0.8, 0.1029412 * 0.8, 1)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new IntervalValue(5, 10),
            emissionBursts: [],
            shape: new SphereEmitter({
                radius: 0.01,
                thickness: 1,
                arc: Math.PI * 2
            }),
            texture: texture2,
            blending: AdditiveBlending,
            startTileIndex: 1,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 0,
        });
        this.beamWorld.emitter.name = 'beamWorld';
        this.beamWorld.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1.0, 1.0, 1.0, 1.0), new Vector4(0.0, 0.0, 0.0, 1.0))));
        this.add(this.beamWorld.emitter);

        this.electricity = new ParticleSystem(renderer, {
            duration: 0.5,
            looping: true,

            startLife: new IntervalValue(0.2, 0.3),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(3, 6),
            startRotation: new IntervalValue(-Math.PI, Math.PI),
            startColor: new RandomColor(new Vector4(0.1397059, 0.3592291, 1, 1), new Vector4(1, 0.9275356, 0.1029412, 1)),
            worldSpace: true,

            maxParticle: 100,
            emissionOverTime: new IntervalValue(5, 10),
            emissionBursts: [],

            shape: new PointEmitter(),
            texture: texture2,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 2,
        });
        //this.electricity.addBehavior(new ColorOverLife(([[new Bezier(61, 64, 67, 70), 0]])));
        this.electricity.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(53, 56, 59, 62), 0]])));
        this.electricity.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1.0, 1.0, 0.75, 0), 0]])));
        this.electricity.emitter.name = 'electricity';
        this.add(this.electricity.emitter);

        this.electricBall = new ParticleSystem(renderer, {
            duration: 0.4,
            looping: true,

            startLife: new IntervalValue(0.2, 0.4),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(5, 10),
            startRotation: new IntervalValue(-Math.PI, Math.PI),
            startColor: new RandomColor(new Vector4(0.1397059, 0.3592291, 1, 1), new Vector4(1, 0.9275356, 0.1029412, 1)),
            worldSpace: false,

            maxParticle: 100,
            emissionOverTime: new ConstantValue(3),
            emissionBursts: [],

            shape: new PointEmitter(),
            texture: texture2,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 1,
        });
        this.electricBall.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(62, 65, 68, 71), 0]])));
        this.electricBall.emitter.name = 'electricBall';
        this.add(this.electricBall.emitter);
        /*
        this.sparks = new ParticleSystem(renderer, {
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
        });
        this.smoke.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
        this.smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.1509503, 0.07352942, 1), new Vector4(0, 0, 0, 0))));
        this.smoke.addBehavior(new RotationOverLife(new IntervalValue(-Math.PI * 2, Math.PI * 2)));
        this.smoke.emitter.renderOrder = -2;
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
        });
        this.particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.particles.emitter.renderOrder = 0;
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
        });
        this.beam.emitter.renderOrder = 0;
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
        });
        this.circle.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.3, 0.6, 0.9, 1), 0]])));
        this.circle.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(10, 13, 16, 19), 0]])));
        this.circle.emitter.renderOrder = 2;
        this.circle.emitter.name = 'circle';
        this.add(this.circle.emitter);
*/
        this.userData = {
            script:
                "    this.position.x += delta * 30;\n" +
                "    if (this.position.x > 20)\n" +
                "        this.position.x = -20;\n"
        };
        this.userData.func = new Function("delta", this.userData.script);
    }

    update(delta: number) {
        this.beam.update(delta);
        this.beamWorld.update(delta);
        this.electricity.update(delta);
        this.electricBall.update(delta);
        /*this.glowBeam.update(delta);
        this.particles.update(delta);
        this.circle.update(delta);*/
    }
}
