import {
    ApplicationContext,
    ApplicationContextConsumer,
    listObjects,
    Selectables,
    SelectableSearchable
} from "./ApplicationContext";
import {
    ConeEmitter,
    Constructable,
    DonutEmitter,
    EmitterShape,
    EmitterTypes, MeshSurfaceEmitter, ParticleEmitter,
    ParticleSystem,
    PointEmitter,
    SphereEmitter
} from "three.quarks";
import {NumberInput} from "./editors/NumberInput";
import React, {useContext} from "react";
import {MenuItem, Select, SelectChangeEvent, Typography} from "@mui/material";
import {SelectInput} from "./editors/SelectInput";
import {Mesh} from "three";


interface EmitterShapePropertiesProps {
    particleSystem: ParticleSystem,
}

export const EmitterShapeProperties: React.FC<EmitterShapePropertiesProps> = (props) => {
    const context = useContext(ApplicationContext)!;

    const onChangeShape = (value: string) => {
        if (props.particleSystem.emitterShape.type !== value) {
            const entry = EmitterTypes.find(entry => entry[0] === value);
            if (entry) {
                props.particleSystem.emitterShape = new (entry[1] as Constructable<EmitterShape>)();
                context.actions.updateEmitterShape(props.particleSystem);
                context.updateProperties();
            }
        }
    };

    const onChangeKeyValue = <T,>(k: string, v: T) => {
        (props.particleSystem.emitterShape as any)[k] = v;
        context.actions.updateEmitterShape(props.particleSystem);
        context.updateProperties();
    };

    const renderShapeProperties = () => {
        const properties = [];
        for (const key of Object.getOwnPropertyNames(props.particleSystem.emitterShape)) {
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
        }
        return properties;
    }

    return (
        <div className="property-container">
            <div className="property">
                <Typography className="name">Shape</Typography>
                <SelectInput onChange={onChangeShape}
                             value={props.particleSystem.emitterShape.type}
                             options={EmitterTypes.map(type => type[0] as string)} />
            </div>
            {renderShapeProperties()}
        </div>
    );
}
