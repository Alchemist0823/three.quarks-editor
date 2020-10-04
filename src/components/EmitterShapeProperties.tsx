import {Blending, Texture} from "three";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ConeEmitter, DonutEmitter, EmitterShape, ParticleSystem, PointEmitter, SphereEmitter} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import {FileInput} from "./editors/FileInput";
import React, {ChangeEvent} from "react";


interface EmitterShapePropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: Function,
}

interface EmitterShapePropertiesState {

}

export class EmitterShapeProperties extends React.PureComponent<EmitterShapePropertiesProps, EmitterShapePropertiesState> {
    constructor(props: Readonly<EmitterShapePropertiesProps>) {
        super(props);
    }

    getValueOfShape = (shape: EmitterShape) => {
        if (this.props.particleSystem.emitterShape instanceof PointEmitter) {
            return "PointEmitter";
        } else if (this.props.particleSystem.emitterShape instanceof ConeEmitter) {
            return "ConeEmitter";
        } else if (this.props.particleSystem.emitterShape instanceof SphereEmitter) {
            return "SphereEmitter";
        } else if (this.props.particleSystem.emitterShape instanceof DonutEmitter) {
            return "DonutEmitter";
        } else
            return "";
    };

    onChangeShape = (e: ChangeEvent<HTMLSelectElement>) => {
        switch (e.target.value) {
            case "PointEmitter":
                if (!(this.props.particleSystem.emitterShape instanceof PointEmitter)) {
                    this.props.particleSystem.emitterShape = new PointEmitter();
                    this.props.updateProperties();
                }
                break;
            case "ConeEmitter":
                if (!(this.props.particleSystem.emitterShape instanceof ConeEmitter)) {
                    this.props.particleSystem.emitterShape = new ConeEmitter();
                    this.props.updateProperties();
                }
                break;
            case "SphereEmitter":
                if (!(this.props.particleSystem.emitterShape instanceof SphereEmitter)) {
                    this.props.particleSystem.emitterShape = new SphereEmitter();
                    this.props.updateProperties();
                }
                break;
            case "DonutEmitter":
                if (!(this.props.particleSystem.emitterShape instanceof DonutEmitter)) {
                    this.props.particleSystem.emitterShape = new DonutEmitter();
                    this.props.updateProperties();
                }
                break;
        }
    };

    onChangeKeyValue = (k: string, v: number) => {
        (this.props.particleSystem.emitterShape as any)[k] = v;
        this.props.updateProperties();
    };

    renderShapeProperties() {
        const properties = [];
        for (const key in this.props.particleSystem.emitterShape) {
            properties.push(
                <div key={key} className="property">
                    <label className="name">{key}:</label>
                    <NumberInput value={(this.props.particleSystem.emitterShape as any)[key]} onChange={(value) => this.onChangeKeyValue(key, value)}/>
                </div>
            );
        }
        return properties;
    }

    render() {
        return (
            <div>
                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <label className="name">Shape</label>
                            <select className="editor-select" onChange={this.onChangeShape} value={this.getValueOfShape(this.props.particleSystem.emitterShape)}>
                                <option key={0} value="PointEmitter" >PointEmitter</option>
                                <option key={1} value="ConeEmitter" >ConeEmitter</option>
                                <option key={2} value="SphereEmitter" >SphereEmitter</option>
                                <option key={3} value="DonutEmitter" >DonutEmitter</option>
                            </select>
                        </div>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context && this.renderShapeProperties()}
                </ApplicationContextConsumer>
            </div>
        );
    }
}
