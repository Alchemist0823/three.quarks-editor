import {AdditiveBlending, Group, NormalBlending, TextureLoader, Vector4} from "three";
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
import {TextureImage} from "../components/ApplicationContext";

export class ShipSmoke extends Group {

    private smoke: ParticleSystem;
    constructor(textures: TextureImage[]) {
        super();
        this.name = 'shipSmoke';

        let texture = textures[0].texture;

        let grey = new Vector4(.5, .5, .5, 1);

        this.smoke = new ParticleSystem({
            duration: 5,
            looping: true,
            startLife: new IntervalValue(1.5, 3),
            startSpeed: new IntervalValue(20, 30),
            startSize: new IntervalValue(10, 15),
            startColor: new ConstantColor(grey),
            worldSpace: true,
            maxParticle: 100,
            emissionOverTime: new ConstantValue(20),
            shape: new ConeEmitter({
                radius: 10,
                thickness: 1,
                angle: 0.2
            }),
            texture: texture,
            blending: NormalBlending,
            startTileIndex: 2,
            uTileCount: 10,
            vTileCount: 10,
            renderMode: RenderMode.BillBoard,
        });
        //this.gatherParticles.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(1, 0.25, 0.05, 0), 0]])));
        this.smoke.addBehavior(new ColorOverLife(new ColorRange(new Vector4(1, 1, 1, 1), new Vector4(.8, .8, .8, 0))));
        this.smoke.addBehavior(new SizeOverLife(new PiecewiseBezier([[new Bezier(0.2, 1, 1, 1), 0]])));
        this.smoke.emitter.name = 'smoke';
        this.smoke.emitter.renderOrder = 2;
        this.smoke.emitter.rotation.x = -Math.PI / 2;
        this.add(this.smoke.emitter);
    }

    update(delta: number) {
        this.smoke.update(delta);
    }
}
