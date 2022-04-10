import {Mesh, Object3D} from "three";
import {ApplicationContext, listObjects, SelectableSearchable} from "../ApplicationContext";
import Typography from "@mui/material/Typography";
import {SelectInput} from "./SelectInput";
import React, {useContext} from "react";

interface MeshSelectProps {
    name: string;
    listableTypes: string[];
    onChange: (value: Object3D) => void;
    value?: Object3D
}

export const Object3DSelect: React.FC<MeshSelectProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const listObjs: Mesh[] = [];
    listObjects(context.scene, listObjs, SelectableSearchable, props.listableTypes);
    return <div key={"mesh"} className="property">
        <Typography className="name">{props.name}</Typography>
        <SelectInput value={(props.value ?? "") as Object3D}
                     options={listObjs}
                     onChange={props.onChange}
                     optionToStr={(obj) => obj.name}
        />
    </div>;
}
