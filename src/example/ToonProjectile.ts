import {AdditiveBlending, Group, NormalBlending, Texture, TextureLoader, Vector4} from "three";
import {BatchedParticleRenderer, ColorOverLife, ParticleSystem, RenderMode} from "three.quarks";
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
import {RandomColor} from "three.quarks";
import {TextureImage} from "../components/ApplicationContext";

export function createToonProjectile(renderer: BatchedParticleRenderer, textures: TextureImage[]) {
    const group = new Group();
    group.name = "ToonProjectile";
    const texture = textures[0].texture;

    const mainBeam = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new IntervalValue(0.1, 0.15),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(1.25),
        startColor: new ConstantColor(new Vector4(1, 1, 1, .5)),
        worldSpace: true,

        maxParticle: 100,
        emissionOverTime: new ConstantValue(40),

        shape: new SphereEmitter({
            radius: .0001,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        texture: texture,
        blending: AdditiveBlending,
        startTileIndex: 0,
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 2,
    });
    mainBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
    mainBeam.emitter.name = 'mainBeam';

    group.add(mainBeam.emitter);

    const glowBeam = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new IntervalValue(0.1, 0.15),
        startSpeed: new ConstantValue(0),
        startSize: new ConstantValue(3.5),
        startColor: new ConstantColor(new Vector4(1, 0.1509503, 0.07352942, .5)),
        worldSpace: true,

        maxParticle: 100,
        emissionOverTime: new ConstantValue(40),

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
        renderOrder: 2,
    });
    glowBeam.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    glowBeam.emitter.name = 'glowBeam';

    group.add(glowBeam.emitter);


    const particles = new ParticleSystem(renderer, {
        duration: 1,
        looping: true,
        startLife: new IntervalValue(0.3, 0.6),
        startSpeed: new IntervalValue(2, 5),
        startSize: new IntervalValue(.1, .4),
        startColor: new RandomColor(new Vector4(1, 1, 1, .5), new Vector4(1, 0.1509503, 0.07352942, .5)),
        worldSpace: true,

        maxParticle: 100,
        emissionOverTime: new ConstantValue(60),

        shape: new ConeEmitter({
            angle: 4.8423 / 180 * Math.PI,
            radius: .3,
            thickness: 1,
            arc: Math.PI * 2,
        }),
        texture: texture,
        renderMode: RenderMode.StretchedBillBoard,
        speedFactor: .01,
        blending: NormalBlending,
        startTileIndex: 0,
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: 0,
    });
    particles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
    particles.emitter.rotateY(-Math.PI / 2);
    particles.emitter.name = 'particles';

    group.add(particles.emitter);

    const smoke = new ParticleSystem(renderer, {
        startLife: new IntervalValue(0.25, 0.3),
        startSpeed: new ConstantValue(0),
        startSize: new IntervalValue(.75, 1.25),
        startRotation: new IntervalValue(0, Math.PI * 2),
        startColor: new ConstantColor(new Vector4(1, 1, 1, .5)),
        worldSpace: true,

        maxParticle: 100,
        emissionOverTime: new ConstantValue(20),
        shape: new SphereEmitter({
            radius: .2,
            thickness: 1,
        }),

        texture: texture,
        blending: NormalBlending,
        startTileIndex: 2,
        uTileCount: 10,
        vTileCount: 10,
        renderOrder: -2,
    });
    smoke.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.95, 0.75, 0), 0]])));
    smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 0.1509503, 0.07352942, 1), new Vector4(0, 0, 0, 0))));
    smoke.addBehavior(new RotationOverLife(new IntervalValue(-Math.PI * 2, Math.PI * 2)));
    smoke.emitter.name = 'smoke';

    group.add(smoke.emitter);

    group.userData = {
        script:
            "    this.position.x += delta * 30;\n" +
            "    if (this.position.x > 20)\n" +
            "        this.position.x = -20;\n"
    };
    group.userData.func = new Function("delta", group.userData.script);
    return group;
}
