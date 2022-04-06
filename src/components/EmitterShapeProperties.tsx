import {
    ApplicationContext,
    listObjects,
    SelectableSearchable
} from "./ApplicationContext";
import {
    EmitterShapePlugin,
    EmitterShapes,
    MeshSurfaceEmitter,
    ParticleSystem,
} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import React, {useContext} from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";
import {Mesh} from "three";
import {FieldEditor} from "./editors/FieldEditor";


interface EmitterShapePropertiesProps {
    particleSystem: ParticleSystem,
}

export const EmitterShapeProperties: React.FC<EmitterShapePropertiesProps> = (props) => {
    const context = useContext(ApplicationContext)!;

    const onChangeShape = (value: string) => {
        if (props.particleSystem.emitterShape.type !== value) {
            const entry: EmitterShapePlugin = EmitterShapes[value];
            if (entry) {
                props.particleSystem.emitterShape = new entry.constructor();
                context.actions.updateEmitterShape(props.particleSystem);
                context.updateProperties();
            }
        }
    };

    const onChangeKeyValue = () => {
        context.actions.updateEmitterShape(props.particleSystem);
        context.updateProperties();
    };

    const renderShapeProperties = () => {
        const entry = EmitterShapes[props.particleSystem.emitterShape.type];
        return entry.params.map(([varName, type]) =>
            <FieldEditor key={varName}  fieldName={varName} target={props.particleSystem.emitterShape} onChange={onChangeKeyValue} type={type}/>);
        /*for (const key of Object.getOwnPropertyNames(props.particleSystem.emitterShape)) {
            if (key !== 'type' && !key.startsWith('_')) {
                properties.push(
                    <div key={key} className="property">
                        <Typography className="name">{key}:</Typography>
                        <NumberInput value={(props.particleSystem.emitterShape as any)[key]}
                                     onChange={(value) => onChangeKeyValue(key, value)}/>
                    </div>
                );
            }
        }
        if (props.particleSystem.emitterShape.type === "mesh_surface") {
            const listObjs: Mesh[] = [];
            listObjects(context.scene, listObjs, SelectableSearchable, ["Mesh"]);
            properties.push(
                <div key={"mesh"} className="property">
                    <Typography className="name">Mesh:</Typography>
                    <SelectInput value={(props.particleSystem.emitterShape as MeshSurfaceEmitter).mesh ?? ""}
                                 options={listObjs}
                                 onChange={(value) => onChangeKeyValue("mesh", value)}
                                 optionToStr={(obj) => obj.name}
                    />
                </div>
            );
        }*/
    }

    return (
        <div className="property-container">
            <div className="property">
                <Typography className="name">Shape</Typography>
                <SelectInput onChange={onChangeShape}
                             value={props.particleSystem.emitterShape.type}
                             options={Object.keys(EmitterShapes)} />
            </div>
            {renderShapeProperties()}
        </div>
    );
}
