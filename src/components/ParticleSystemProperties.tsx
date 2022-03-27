import * as React from "react";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ParticleSystem, RenderMode} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, FunctionColorGenerator} from "three.quarks";

interface ParticleSystemPropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: ()=>void,
}

export class ParticleSystemProperties extends React.PureComponent<ParticleSystemPropertiesProps> {
    constructor(props: Readonly<ParticleSystemPropertiesProps>) {
        super(props);
    }
    onChangeStartSpeed = (g: GenericGenerator) => {
        this.props.particleSystem.startSpeed = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };
    onChangeStartLife = (g: GenericGenerator) => {
        this.props.particleSystem.startLife = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };
    onChangeStartSize = (g: GenericGenerator) => {
        this.props.particleSystem.startSize = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };
    onChangeStartColor = (g: GenericGenerator) => {
        this.props.particleSystem.startColor = g as ColorGenerator | FunctionColorGenerator;
        this.props.updateProperties();
    };
    onChangeStartRotation = (g: GenericGenerator) => {
        this.props.particleSystem.startRotation = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };
    onChangeEmissionOverTime = (g: GenericGenerator) => {
        this.props.particleSystem.emissionOverTime = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };
    onChangeStartLength = (g: GenericGenerator) => {
        this.props.particleSystem.startLength = g as ValueGenerator | FunctionValueGenerator;
        this.props.updateProperties();
    };

    render() {
        const valueFunctionTypes: ValueType[] = ['value', 'valueFunc'];
        const colorValueFunctionTypes: ValueType[] = ['color', 'colorFunc'];
        return (
            <div className="property-container">
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Life"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.startLife}
                                         onChange={this.onChangeStartLife}/>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Size"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.startSize}
                                         onChange={this.onChangeStartSize}/>
                    }
                </ApplicationContextConsumer>
                {this.props.particleSystem.renderMode === RenderMode.Trail && <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Length"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.startLength}
                                         onChange={this.onChangeStartLength}/>
                    }
                </ApplicationContextConsumer>}
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Speed"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.startSpeed}
                                         onChange={this.onChangeStartSpeed}/>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Color"
                                         allowedType={colorValueFunctionTypes}
                                         value={this.props.particleSystem.startColor}
                                         onChange={this.onChangeStartColor}/>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Start Rotation"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.startRotation}
                                         onChange={this.onChangeStartRotation}/>
                    }
                </ApplicationContextConsumer>
                <ApplicationContextConsumer>
                    {context => context &&
                        <GeneratorEditor name="Emit Over Time"
                                         allowedType={valueFunctionTypes}
                                         value={this.props.particleSystem.emissionOverTime}
                                         onChange={this.onChangeEmissionOverTime}/>
                    }
                </ApplicationContextConsumer>
            </div>
        );
    }
}
