import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {ColorOverLife, ParticleSystem, PointEmitter, RenderMode, RotationOverLife} from "three.quarks";
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

export class BulletProjectile extends Group {
    private hProjectile: ParticleSystem;
    private vProjectile: ParticleSystem;

    constructor() {
        super();

        let texture = new TextureLoader().load( "textures/projectile.png");
        texture.name = "textures/projectile.png";

        let projectileParam = {
            duration: 1,
            looping: true,
            startLife: new ConstantValue(0.5),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(1, 2),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: false,

            maxParticle: 10,
            emissionOverTime: new ConstantValue(4),

            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 1,
            vTileCount: 1,
            instancingGeometry: [
                -2, -0.5, 0, 0, 0,
                2, -0.5, 0, 1, 0,
                2, 0.5, 0, 1, 1,
                -2, 0.5, 0, 0, 1
            ],
            renderMode: RenderMode.LocalSpaceBillBoard
        };

        this.hProjectile = new ParticleSystem(projectileParam);
        this.hProjectile.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 0), new Vector4(0, 1, 0.25, 1)), 0],
            [new ColorRange(new Vector4(0, 1, 0.25, 1), new Vector4(1, 1, 1, 0)), 0.5]
        ])));
        this.hProjectile.emitter.renderOrder = 2;
        this.hProjectile.emitter.name = 'hProjectile';
        this.add(this.hProjectile.emitter);

        this.vProjectile = new ParticleSystem(projectileParam);
        this.vProjectile.addBehavior(new ColorOverLife(new Gradient([
            [new ColorRange(new Vector4(1, 1, 1, 0), new Vector4(0, 1, 0.25, 1)), 0],
            [new ColorRange(new Vector4(0, 1, 0.25, 1), new Vector4(1, 1, 1, 0)), 0.5]
        ])));
        this.vProjectile.emitter.renderOrder = 2;
        this.vProjectile.emitter.name = 'vProjectile';
        this.vProjectile.emitter.rotation.x = Math.PI / 2;
        this.add(this.vProjectile.emitter);
    }

    update(delta: number) {
        this.hProjectile.update(delta);
        this.vProjectile.update(delta);
    }
}
