import React, {PropsWithChildren} from "react";
import Typography from "@mui/material/Typography";
import {NumberInput} from "./NumberInput";
import {Vector3Editor} from "./Vector3Editor";
import {Mesh, Object3D, Vector3} from "three";
import {GeneratorEditor, GenericGenerator} from "./GeneratorEditor";
import {EditorType, MeshSurfaceEmitter} from "three.quarks";
import {SelectInput} from "./SelectInput";
import {listObjects, SelectableSearchable} from "../ApplicationContext";
import {MeshSelect} from "./MeshSelect";

export interface FieldEditorProps<T> {
    target: {[k: string]: any};
    onChange: (value: T) => void;
    fieldName: string;
    type: EditorType;
}

export const FieldEditor = <T, > (props: PropsWithChildren<FieldEditorProps<T>>) => {
    const {target, onChange, fieldName, type} = props;

    const onChangeBehaviorFunc = (generator: GenericGenerator) => {
        target[fieldName] = generator;
        onChange(target[fieldName]);
    }

    const onChangeNumber = (x: number) => {
        target[fieldName] = x;
        onChange(target[fieldName]);
    }

    const onChangeMesh = (x: Object3D) => {
        target[fieldName] = x;
        onChange(target[fieldName]);
    }

    const onChangeVec3  = (x: number, y: number, z: number) => {
        target[fieldName].x = x;
        target[fieldName].y = y;
        target[fieldName].z = z;
        onChange(target[fieldName]);
    }

    switch (type) {
        case 'radian':
            return <div className="property" key={fieldName}>
                <Typography component={"label"} className="name">{fieldName}</Typography>
                <NumberInput key={fieldName} value={target[fieldName]} unitConversion={180 / Math.PI} onChange={onChangeNumber}/>
            </div>;
        case 'number':
            return <div className="property" key={fieldName}>
                <Typography component={"label"} className="name">{fieldName}</Typography>
                <NumberInput key={fieldName} value={target[fieldName]}  onChange={onChangeNumber}/>
            </div>;
        case 'vec3':
            return <Vector3Editor key={fieldName} name={fieldName}
                                  x={(target[fieldName] as Vector3).x}
                                  y={(target[fieldName] as Vector3).y}
                                  z={(target[fieldName] as Vector3).z} onChange={onChangeVec3} />
        case 'mesh':
            return <MeshSelect key={fieldName} name={fieldName} listableTypes={["Mesh"]} onChange={onChangeMesh} value={target[fieldName] as Object3D}/>
        case 'valueFunc':
            return <GeneratorEditor key={fieldName} name={fieldName}
                                    allowedType={[type, "value"]}
                                    value={target[fieldName] as any}
                                    onChange={onChangeBehaviorFunc}/>
        case 'colorFunc':
        case 'value':
            return <GeneratorEditor key={fieldName} name={fieldName}
                                    allowedType={[type]}
                                    value={target[fieldName] as any}
                                    onChange={onChangeBehaviorFunc}/>
        default:
            return <GeneratorEditor key={fieldName} name={fieldName}
                                    allowedType={[type]}
                                    value={target[fieldName] as any}
                                    onChange={onChangeBehaviorFunc}/>
    }
}
