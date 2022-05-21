import {BufferGeometry, Mesh, Object3D} from "three";
import {ApplicationContext, listObjects, SelectableSearchable} from "../ApplicationContext";
import Typography from "@mui/material/Typography";
import {SelectInput} from "./SelectInput";
import React, {useContext} from "react";

interface GeometrySelectProps {
    onChange: (value: BufferGeometry) => void;
    value?: BufferGeometry
}

export const GeometrySelect: React.FC<GeometrySelectProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const listObjs: Mesh[] = [];
    listObjects(context.scene, listObjs, SelectableSearchable, ['Mesh']);
    return <SelectInput value={(props.value ?? "") as BufferGeometry}
                     options={listObjs.map(obj => obj.geometry)}
                     onChange={props.onChange}
                     optionToStr={(obj) => obj.name}
        />;
}
