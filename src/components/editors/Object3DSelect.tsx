import {Mesh, Object3D} from "three";
import {ApplicationContext, listObjects, SelectableSearchable} from "../ApplicationContext";
import Typography from "@mui/material/Typography";
import {SelectInput} from "./SelectInput";
import React, {useCallback, useContext, useState} from "react";

interface MeshSelectProps {
    name: string;
    listableTypes: string[];
    onChange: (value: Object3D) => void;
    value?: Object3D
}

export const Object3DSelect: React.FC<MeshSelectProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    const [listObjs, setListObjects] = useState<Object3D[]>([]);

    const onOpen = useCallback(() => {
        const objs: Object3D[] = [];
        console.log(context.scene);
        console.log("onOpen");
        listObjects(context.scene, objs, SelectableSearchable, props.listableTypes);
        setListObjects(objs);
        console.log(objs);
    }, []);

    //listObjects(context.scene, listObjs, SelectableSearchable, props.listableTypes);
    return <div key={"mesh"} className="property">
        <Typography className="name">{props.name}</Typography>
        <SelectInput value={(props.value ?? "") as Object3D}
                     options={listObjs.map(obj => [obj, obj.name])}
                     onChange={props.onChange}
                     onOpen={onOpen}
        />
    </div>;
}

