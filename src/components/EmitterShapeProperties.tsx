import {ApplicationContextConsumer} from "./ApplicationContext";
import {
    ConeEmitter,
    Constructable,
    DonutEmitter,
    EmitterShape,
    EmitterTypes,
    ParticleSystem,
    PointEmitter,
    SphereEmitter
} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import React, {ChangeEvent} from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";


interface EmitterShapePropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: ()=>void,
}

interface EmitterShapePropertiesState {

}

export class EmitterShapeProperties extends React.PureComponent<EmitterShapePropertiesProps, EmitterShapePropertiesState> {
    constructor(props: Readonly<EmitterShapePropertiesProps>) {
        super(props);
    }

    onChangeShape = (value: string) => {
        if (this.props.particleSystem.emitterShape.type !== value) {
            const entry = EmitterTypes.find(entry => entry[0] === value);
            if (entry) {
                this.props.particleSystem.emitterShape = new (entry[1] as Constructable<EmitterShape>)();
                this.props.updateProperties();
            }
        }
    };

    onChangeKeyValue = (k: string, v: number) => {
        (this.props.particleSystem.emitterShape as any)[k] = v;
        this.props.updateProperties();
    };

    renderShapeProperties() {
        const properties = [];
        for (const key in this.props.particleSystem.emitterShape) {
            if (key !== 'type') {
                properties.push(
                    <div key={key} className="property">
                        <Typography className="name">{key}:</Typography>
                        <NumberInput value={(this.props.particleSystem.emitterShape as any)[key]}
                                     onChange={(value) => this.onChangeKeyValue(key, value)}/>
                    </div>
                );
            }
        }
        return properties;
    }

    render() {
        return (
            <div className="property-container">
                <ApplicationContextConsumer>
                    {context => context &&
                        <div className="property">
                            <Typography className="name">Shape</Typography>
                            <SelectInput onChange={this.onChangeShape}
                                         value={this.props.particleSystem.emitterShape.type}
                                         options={EmitterTypes.map(type => type[0] as string)} />
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
