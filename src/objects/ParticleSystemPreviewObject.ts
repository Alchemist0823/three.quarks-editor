import {
    BufferGeometry,
    CylinderBufferGeometry,
    LineBasicMaterial, LineSegments,
    SphereBufferGeometry,
    TorusBufferGeometry, WireframeGeometry
} from "three";
import {ConeEmitter, DonutEmitter, ParticleSystem, SphereEmitter} from "three.quarks";


function generateEmitterGeometry(particleSystem: ParticleSystem) {
    // TODO: make this closer to actual shape
    let geo;
    switch (particleSystem.emitterShape.type) {
        case "cone":
            geo = new CylinderBufferGeometry((particleSystem.emitterShape as ConeEmitter).radius);
            break;
        case "sphere":
            geo = new SphereBufferGeometry((particleSystem.emitterShape as SphereEmitter).radius);
            break;
        case "point":
            geo = new SphereBufferGeometry(1);
            break;
        case "donut": {
            const emitterShape = particleSystem.emitterShape as DonutEmitter;
            geo = new TorusBufferGeometry(emitterShape.radius, emitterShape.thickness, 8, 6, emitterShape.arc);
            break;
        }
        default:
            geo = new SphereBufferGeometry(1);
            break;
    }
    return geo;
}

export class ParticleSystemPreviewObject extends LineSegments<BufferGeometry, LineBasicMaterial> {

    particleSystem: ParticleSystem;

    constructor(particleSystem: ParticleSystem) {
        super(new WireframeGeometry(generateEmitterGeometry(particleSystem)));
        this.particleSystem = particleSystem;
        this.type = "ParticleSystemPreview";
        //this.material.depthTest = false;
        this.material.opacity = 0.25;
        this.material.transparent = true;
        this.material.color.setRGB(0.0, 1.0, 0.0);
        this.rotation.x = - Math.PI / 2;
        this.userData.listable = false;
        this.userData.selectable = false;
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
