import {
    BufferGeometry,
    CylinderGeometry,
    LineBasicMaterial, LineSegments, Quaternion,
    SphereGeometry,
    TorusGeometry, Vector3, WireframeGeometry
} from "three";
import {ConeEmitter, DonutEmitter, ParticleSystem, SphereEmitter} from "three.quarks";


function generateEmitterGeometry(particleSystem: ParticleSystem) {
    // TODO: make this closer to actual shape
    let geo;
    switch (particleSystem.emitterShape.type) {
        case "cone": {
            const cone = (particleSystem.emitterShape as ConeEmitter);
            geo = new CylinderGeometry(cone.radius, cone.radius * (1 + Math.tan(cone.angle)), cone.radius, 8, 1, true);
            geo.translate(0, -cone.radius / 2, 0);
            break;
        }
        case "sphere":
            geo = new SphereGeometry((particleSystem.emitterShape as SphereEmitter).radius, 8, 6);
            break;
        case "point":
            geo = new SphereGeometry(1, 8, 6);
            break;
        case "donut": {
            const emitterShape = particleSystem.emitterShape as DonutEmitter;
            geo = new TorusGeometry(emitterShape.radius, emitterShape.thickness, 8, 12, emitterShape.arc);
            geo.applyQuaternion(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 90 * Math.PI / 180));
            break;
        }
        default:
            geo = new SphereGeometry(1);
            break;
    }
    return geo;
}

export class ParticleSystemPreviewObject extends LineSegments<BufferGeometry, LineBasicMaterial> {

    particleSystem: ParticleSystem;

    constructor(particleSystem?: ParticleSystem) {
        super(new WireframeGeometry(particleSystem ? generateEmitterGeometry(particleSystem) : undefined));
        this.particleSystem = particleSystem!;
        this.type = "ParticleSystemPreview";
        //this.material.depthTest = false;
        this.material.opacity = 0.25;
        this.material.transparent = true;
        this.material.color.setRGB(0.0, 1.0, 0.0);
        this.rotation.x = - Math.PI / 2;
        this.userData.listable = false;
        this.userData.selectable = false;
    }

    copy(source: this, recursive?: boolean) {
        super.copy(source, recursive);
        this.particleSystem = source.particleSystem;
        this.geometry = new WireframeGeometry(generateEmitterGeometry(source.particleSystem));
        return this;
    }

    set selected(value: boolean) {
        if (value) {
            this.material.color.setRGB(1.0, 1.0, 1.0);
        } else {
            this.material.color.setRGB(0.0, 1.0, 0.0);
        }
    }

    update() {
        this.geometry = new WireframeGeometry(generateEmitterGeometry(this.particleSystem));
    }
}
