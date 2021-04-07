import {Object3D, Vector4} from "three";
import {
    Behavior,
    Bezier,
    ColorGenerator, ColorRange, ConeEmitter, ConstantColor, ConstantValue, DonutEmitter, EmitterShape,
    FunctionColorGenerator,
    FunctionValueGenerator, Gradient, IntervalValue,
    ParticleEmitter, PiecewiseBezier, PointEmitter, RandomColor,
    RenderMode, SphereEmitter,
    ValueGenerator,
    ColorGeneratorFromJSON,
    ColorOverLife, FrameOverLife, OrbitOverLife,
    RotationOverLife, SizeOverLife, SpeedOverLife,
    ValueGeneratorFromJSON
} from "three.quarks";


export class CodeExporter {
    /*static traverseObject(parent: Object3D): string {
        for (let i = 0; i < parent.children.length; i ++) {

        }
    }*/

    static camelize(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static camelizeClass(str: string): string {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    static exportBezier(func: Bezier) {
        return `new Bezier(${func.p[0]}, ${func.p[1]}, ${func.p[2]}, ${func.p[3]})`;
    }
    static exportColor(color: Vector4) {
        return `new Vector4(${color.x}, ${color.y}, ${color.z}, ${color.w})`;
    }
    static exportFunction(func: ValueGenerator | ColorGenerator | FunctionValueGenerator | FunctionColorGenerator, indent: number = 0): string {
        if (func instanceof ConstantValue) {
            return `new ConstantValue(${func.value})`;
        } else if (func instanceof ConstantColor) {
            return `new ConstantColor(${CodeExporter.exportColor(func.color)})`;
        } else if (func instanceof IntervalValue) {
            return `new IntervalValue(${func.a}, ${func.b})`;
        } else if (func instanceof ColorRange) {
            return `new ColorRange(${CodeExporter.exportColor(func.a)}, ${CodeExporter.exportColor(func.b)})`;
        } else if (func instanceof RandomColor) {
            return `new RandomColor(${CodeExporter.exportColor(func.a)}, ${CodeExporter.exportColor(func.b)})`;
        }  else if (func instanceof Gradient) {
            let code = `new Gradient(\n`;
            for (let i = 0; i < func.functions.length - 1; i ++) {
                code += ' '.repeat(indent + 4) + `[${CodeExporter.exportFunction(func.functions[i][0])}, ${func.functions[i][1]}], `;
            }
            code += ' '.repeat(indent + 4) + `[${CodeExporter.exportFunction(func.functions[func.functions.length - 1][0])}, ${func.functions[func.functions.length - 1][1]}]`;
            code += ' '.repeat(indent) + `)`;
            return code;
        } else if (func instanceof PiecewiseBezier) {
            let code = `new PiecewiseBezier(\n`;
            for (let i = 0; i < func.functions.length - 1; i ++) {
                code += ' '.repeat(indent + 4) + `[${CodeExporter.exportBezier(func.functions[i][0])}, ${func.functions[i][1]}], `;
            }
            code += ' '.repeat(indent + 4) + `[${CodeExporter.exportBezier(func.functions[func.functions.length - 1][0])}, ${func.functions[func.functions.length - 1][1]}]`;
            code += ' '.repeat(indent) + `)`;
            return code;
        } else if (func instanceof ConstantValue) {
            return `new ConstantValue(${func.value})`;
        }
        throw new Error();
    }

    static exportParticleEmitter(emitter: ParticleEmitter): string {

        let name = CodeExporter.camelize(emitter.name);
        let system = emitter.system;
        let code = `        this.${name} = new ParticleSystem({\n`;
        code += `            duration: ${system.duration},\n`;
        code += `            looping: ${system.looping},\n`;
        code += `            startLife: ${CodeExporter.exportFunction(system.startLife)},\n`;
        code += `            startSpeed: ${CodeExporter.exportFunction(system.startSpeed)},\n`;
        code += `            startSize: ${CodeExporter.exportFunction(system.startSize)},\n`;
        code += `            startColor: ${CodeExporter.exportFunction(system.startColor)},\n`;
        code += `            worldSpace: ${system.worldSpace},\n`;
        code += `            maxParticle: ${system.maxParticle},\n`;
        code += `            emissionOverTime: ${CodeExporter.exportFunction(system.emissionOverTime)},\n`;
        code += `            emissionBursts: ${system.emissionBursts},\n`;
        code += `            shape: ${CodeExporter.exportShape(system.emitterShape)},\n`;
        code += `            texture: texture,\n`;
        code += `            blending: ${system.blending},\n`;
        code += `            startTileIndex: ${system.startTileIndex},\n`;
        code += `            uTileCount: ${system.uTileCount},\n`;
        code += `            vTileCount: ${system.vTileCount},\n`;
        code += `            renderMode: ${system.renderMode},\n`;
        if (system.renderMode == RenderMode.StretchedBillBoard) {
            code += `            speedFactor: ${system.speedFactor},\n`;
        }
        code += '        });\n';

        for (let i = 0; i < system.behaviors.length; i ++) {
            code += `        this.${name}.addBehavior(${CodeExporter.exportBehavior(system.behaviors[i])});\n`;
        }
        code += `        this.${name}.emitter.renderOrder = ${system.emitter.renderOrder};\n`
        code += `        this.${name}.emitter.name = '${name}';\n`
        code += `        this.${name}.emitter.rotation.set(${system.emitter.rotation.x}, ${system.emitter.rotation.y}, ${system.emitter.rotation.z});\n`;
        code += `        this.add(this.${name}.emitter);\n`
        code += '\n';
        return code;
    }

    static exportShape(shape: EmitterShape) {
        let json = shape.toJSON();
        delete json.type;
        let params = JSON.stringify(json);
        const unquoted = params.replace(/"([^"]+)":/g, '$1:');

        if (shape instanceof PointEmitter) {
            return "new PointEmitter()";
        }if (shape instanceof SphereEmitter) {
            return "new SphereEmitter(" + unquoted + ")";
        }if (shape instanceof ConeEmitter) {
            return "new ConeEmitter(" + unquoted + ")";
        }if (shape instanceof DonutEmitter) {
            return "new DonutEmitter(" + unquoted + ")";
        }
    }

    static exportBehavior(behavior: Behavior) {
        let func;
        switch (behavior.type) {
            case 'ColorOverLife':
                func = CodeExporter.exportFunction((behavior as ColorOverLife).func)
                break;
            case 'RotationOverLife':
                func = CodeExporter.exportFunction((behavior as RotationOverLife).angularVelocityFunc)
                break;
            case 'SizeOverLife':
                func = CodeExporter.exportFunction((behavior as SizeOverLife).func)
                break;
            case 'SpeedOverLife':
                func = CodeExporter.exportFunction((behavior as SpeedOverLife).func)
                break;
            case 'FrameOverLife':
                func = CodeExporter.exportFunction((behavior as FrameOverLife).func)
                break;
            case 'OrbitOverLife':
                func = CodeExporter.exportFunction((behavior as OrbitOverLife).angularVelocityFunc)
                break;
            default:
                func = behavior;
        }
        return "new " + behavior.type + "(" + func + ")";
    }

    static exportCode(root: Object3D): string {

        let code = `export class ${CodeExporter.camelizeClass(root.name)} extends Group {\n`;

        for (let i = 0; i < root.children.length; i ++) {
            if (root.children[i] instanceof ParticleEmitter) {
                code += `    private ${CodeExporter.camelize(root.children[i].name)}: ParticleSystem;\n`
            }
        }

        code += '\n';
        code += `    constructor() {\n`;
        code += `        super();\n`;
        code += `        this.name = '${root.name}';\n`;
        code += `        let texture = new TextureLoader().load( "textures/texture1.png");\n`;
        code += `        texture.name = "textures/texture1.png";\n`;

        for (let i = 0; i < root.children.length; i ++) {
            if (root.children[i] instanceof ParticleEmitter) {
                code += CodeExporter.exportParticleEmitter(root.children[i] as ParticleEmitter);
            }
        }

        code += '    }\n';
        code += '\n';

        code += '    update(delta: number) {\n';
        for (let i = 0; i < root.children.length; i ++) {
            if (root.children[i] instanceof ParticleEmitter) {
                code += `        this.${CodeExporter.camelize(root.children[i].name)}.update(delta);\n`
            }
        }
        code += '    }\n';
        code += '}';
        return code;
    }
}