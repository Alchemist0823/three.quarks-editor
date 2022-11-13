import {BufferGeometry, Mesh, Object3D} from "three";
import {ApplicationContext, listObjects, SelectableSearchable} from "../ApplicationContext";
import Typography from "@mui/material/Typography";
import {SelectInput} from "./SelectInput";
import React, {useCallback, useContext, useState} from "react";
import { ParticleEmitter } from "three.quarks";

interface GeometrySelectProps {
    onChange: (value: BufferGeometry) => void;
    value?: BufferGeometry
}

export const GeometrySelect: React.FC<GeometrySelectProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const [listObjs, setListObjects] = useState<Object3D[]>([]);

    const onOpen = useCallback(() => {
        const objs: Object3D[] = [];
        console.log(context.scene);
        console.log("onOpen");
        listObjects(context.scene, objs, SelectableSearchable, ['Mesh', "ParticleEmitter"]);
        setListObjects(objs);
        console.log(objs);
    }, []);

    return <SelectInput value={(props.value ?? "") as BufferGeometry}
                     options={listObjs.map(obj => {
                         if (obj.type === "Mesh") {
                             return [(obj as Mesh).geometry, obj.name];
                         } else if (obj.type === "ParticleEmitter") {
                             return [(obj as ParticleEmitter<Event>).system.instancingGeometry, obj.name];
                         } else {
                             return [undefined, ""] as any;
                         }
                     })}
                     onChange={props.onChange}
                     onOpen={onOpen}
        />;
}
