import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {
    BatchedParticleRenderer,
    ColorOverLife,
    ParticleSystem,
    PointEmitter,
    RenderMode,
    RotationOverLife
} from "three.quarks";
import {ConeEmitter} from "three.quarks";
import {IntervalValue} from "three.quarks";
import {SizeOverLife} from "three.quarks";
import {PiecewiseBezier} from "three.quarks";
import {ColorRange} from "three.quarks";
import {ConstantColor} from "three.quarks";
import {SphereEmitter} from "three.quarks";
import {FrameOverLife} from "three.quarks";
import {ConstantValue} from "three.quarks";
import {Bezier} from "three.quarks";
import {Gradient} from "three.quarks";
import {RandomColor} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";


export function createBulletMuzzle(renderer: BatchedParticleRenderer, textures: TextureImage[]) {

    const texture = textures[0].texture;
    const group = new Group();
    group.name = "BulletMuzzle";

    const beam = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.1, 0.2),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(4),
        startColor: new ConstantColor(new Vector4(1, 0.585716, 0.1691176, 1)),
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
    });
    beam.emitter.renderOrder = 0;
    beam.emitter.name = 'beam';
    beam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    group.add(beam.emitter);

    const muzzle = {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.1, 0.2),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(1, 5),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
        worldSpace: false,

        maxParticle: 5,
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
        startTileIndex: 91,
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.LocalSpace,
        renderOrder: 2,
    };

    const muzzle1 = new ParticleSystem(renderer, muzzle);
    muzzle1.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.3882312, 0.125, 1), new Vector4(1, 0.826827, 0.3014706, 1))));
    muzzle1.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    muzzle1.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(91, 94, 97, 100), 0]])));
    muzzle1.emitter.name = 'muzzle1';
    muzzle1.emitter.position.x = 1;
    group.add(muzzle1.emitter);

    const muzzle2 = new ParticleSystem(renderer, muzzle);
    muzzle2.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.3882312, 0.125, 1), new Vector4(1, 0.826827, 0.3014706, 1))));
    muzzle2.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    muzzle2.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(91, 94, 97, 100), 0]])));
    muzzle2.emitter.renderOrder = 2;
    muzzle2.emitter.name = 'muzzle2';
    muzzle2.emitter.position.x = 1;
    muzzle2.emitter.rotation.x = Math.PI / 2;
    group.add(muzzle2.emitter);

    const flash = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.1, 0.2),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(1, 2.5),
        startRotation: new IntervalValue(-Math.PI, Math.PI),
        startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
        worldSpace: false,

        maxParticle: 5,
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
        startTileIndex: 81,
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: 2,
    });
    flash.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.95, 0.82, 1), new Vector4(1, 0.38, 0.12, 1))));
    flash.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(81, 84.333, 87.666, 91), 0]])));
    flash.emitter.name = 'flash';
    group.add(flash.emitter);

    const smoke = new ParticleSystem(renderer, {
        duration: 2.5,
        looping: false,
        startLife: new IntervalValue(0.6, 0.8),
        startSpeed: new IntervalValue(0.1, 3),
        startSize: new IntervalValue(0.75, 1.5),
        startRotation: new IntervalValue(-Math.PI, Math.PI),
        startColor: new RandomColor(new Vector4(0.6323, 0.6323, 0.6323, .31), new Vector4(1, 1, 1, 0.54)),
        worldSpace: true,

        maxParticle: 10,
        emissionOverTime: new ConstantValue(0),
        emissionBursts: [{
            time: 0,
            count: 5,
            cycle: 1,
            interval: 0.01,
            probability: 1,
        }],

        shape: new ConeEmitter({
            angle: 20 * Math.PI / 180,
            radius: 0.3,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        texture: texture,
        blending: NormalBlending,
        startTileIndex: 81,
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.BillBoard,
        renderOrder: -2,
    });
    smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(1, 1, 1, 0))));
    smoke.addBehavior(new RotationOverLife(new IntervalValue(-Math.PI / 4, Math.PI / 4)));
    smoke.addBehavior(new FrameOverLife(new PiecewiseBezier([[new Bezier(28, 31, 34, 37), 0]])));
    smoke.emitter.name = 'smoke';
    smoke.emitter.rotation.y = Math.PI / 2;
    group.add(smoke.emitter);

    const particles = new ParticleSystem(renderer, {
        duration: 1,
        looping: false,
        startLife: new IntervalValue(0.2, 0.6),
        startSpeed: new IntervalValue(1, 15),
        startSize: new IntervalValue(0.1, 0.3),
        startColor: new RandomColor(new Vector4(1, 0.91, 0.51, 1), new Vector4(1, 0.44, 0.16, 1)),
        worldSpace: true,

        maxParticle: 10,
        emissionOverTime: new ConstantValue(0),
        emissionBursts: [{
            time: 0,
            count: 8,
            cycle: 1,
            interval: 0.01,
            probability: 1,
        }],

        shape: new ConeEmitter({
            angle: 20 * Math.PI / 180,
            radius: 0.3,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        texture: texture,
        blending: AdditiveBlending,
        startTileIndex: 0,
        uTileCount: 10,
        vTileCount: 10,
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: 0.5,
        renderOrder: 0,
    });
    particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    particles.emitter.name = 'particles';
    particles.emitter.rotation.y = Math.PI / 2;
    group.add(particles.emitter);
    return group;
}
