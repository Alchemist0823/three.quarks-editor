import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
import {ColorOverLife, ParticleSystem, PointEmitter, RenderMode, RotationOverLife} from "three.quarks";
import {IntervalValue} from "three.quarks";
import {ConstantColor} from "three.quarks";
import {ConstantValue} from "three.quarks";

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
            startLife: new ConstantValue(1),
            startSpeed: new ConstantValue(0),
            startSize: new IntervalValue(1, 4),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            worldSpace: false,

            maxParticle: 10,
            emissionOverTime: new ConstantValue(1),

            shape: new PointEmitter(),
            texture: texture,
            blending: AdditiveBlending,
            startTileIndex: 0,
            uTileCount: 1,
            vTileCount: 1,
            /*instancingGeometry: [
                -2, -0.5, 0, 0, 0,
                2, -0.5, 0, 1, 0,
                2, 0.5, 0, 1, 1,
                -2, 0.5, 0, 0, 1
            ],*/
            renderMode: RenderMode.LocalSpaceBillBoard
        };

        this.hProjectile = new ParticleSystem(projectileParam);
        this.hProjectile.emitter.renderOrder = 2;
        this.hProjectile.emitter.name = 'hProjectile';
        this.add(this.hProjectile.emitter);

        this.vProjectile = new ParticleSystem(projectileParam);
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
