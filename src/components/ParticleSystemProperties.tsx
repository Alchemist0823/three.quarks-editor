import * as React from "react";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ParticleSystem, TrailSettings, RenderMode} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, FunctionColorGenerator} from "three.quarks";
import {Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";
import {NumberInput} from "./editors/NumberInput";

interface ParticleSystemPropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: () => void,
}

export const ParticleSystemProperties: React.FC<ParticleSystemPropertiesProps> = (props) => {
    const onChangeLooping = (value: boolean) => {
        props.particleSystem.looping = value;
        props.updateProperties();
    };
    const onChangeDuration = (value: number) => {
        props.particleSystem.duration = value;
        props.updateProperties();
    };
    const onChangeStartSpeed = (g: GenericGenerator) => {
        props.particleSystem.startSpeed = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeStartLife = (g: GenericGenerator) => {
        props.particleSystem.startLife = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeStartSize = (g: GenericGenerator) => {
        props.particleSystem.startSize = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeStartColor = (g: GenericGenerator) => {
        props.particleSystem.startColor = g as ColorGenerator | FunctionColorGenerator;
        props.updateProperties();
    };
    const onChangeStartRotation = (g: GenericGenerator) => {
        props.particleSystem.startRotation = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeEmissionOverTime = (g: GenericGenerator) => {
        props.particleSystem.emissionOverTime = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeStartLength = (g: GenericGenerator) => {
        (props.particleSystem.rendererEmitterSettings as TrailSettings).startLength = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };
    const onChangeFollowLocalOrigin = (value: string) => {
        (props.particleSystem.rendererEmitterSettings as TrailSettings).followLocalOrigin = (value === 'True');
        props.updateProperties();
    };
    const valueFunctionTypes: ValueType[] = ['value', 'valueFunc'];
    const colorValueFunctionTypes: ValueType[] = ['color', 'colorFunc'];
    return (
        <div className="property-container">
            <div className="property">
                <Typography component={"label"} className="name">Looping</Typography>
                <SelectInput onChange={onChangeLooping}
                             value={props.particleSystem.looping}
                             options={[true, false]} />
            </div>
            <div className="property">
                <Typography component={"label"} className="name">Duration</Typography>
                <NumberInput onChange={onChangeDuration}
                             value={props.particleSystem.duration}
                             variant={"short"}/>
            </div>
            <GeneratorEditor name="Start Life"
                             allowedType={valueFunctionTypes}
                             value={props.particleSystem.startLife}
                             onChange={onChangeStartLife}/>
            <GeneratorEditor name="Start Size"
                             allowedType={valueFunctionTypes}
                             value={props.particleSystem.startSize}
                             onChange={onChangeStartSize}/>
            <GeneratorEditor name="Start Speed"
                             allowedType={valueFunctionTypes}
                             value={props.particleSystem.startSpeed}
                             onChange={onChangeStartSpeed}/>
            <GeneratorEditor name="Start Color"
                             allowedType={colorValueFunctionTypes}
                             value={props.particleSystem.startColor}
                             onChange={onChangeStartColor}/>
            <GeneratorEditor name="Start Rotation"
                             allowedType={valueFunctionTypes}
                             value={props.particleSystem.startRotation}
                             onChange={onChangeStartRotation}/>
            {props.particleSystem.renderMode === RenderMode.Trail &&
                <GeneratorEditor name="Start Length"
                                 allowedType={valueFunctionTypes}
                                 value={(props.particleSystem.rendererEmitterSettings as TrailSettings).startLength}
                                 onChange={onChangeStartLength}/>
            }
            {props.particleSystem.renderMode === RenderMode.Trail &&
                <div className="property">
                    <Typography component={"label"} className="name">Follow Local Origin</Typography>
                    <SelectInput onChange={onChangeFollowLocalOrigin}
                                 value={(props.particleSystem.rendererEmitterSettings as TrailSettings).followLocalOrigin ? "True" : "False"}
                                 options={["True", "False"]} />
                </div>}
            <GeneratorEditor name="Emit Over Time"
                             allowedType={valueFunctionTypes}
                             value={props.particleSystem.emissionOverTime}
                             onChange={onChangeEmissionOverTime}/>
        </div>
    );
};
