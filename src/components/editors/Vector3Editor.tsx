import * as React from "react";
import {NumberInput} from "./NumberInput";
import {Typography} from "@mui/material";

interface Vector3Props {
    name: string;
    x: number;
    y: number;
    z: number;
    onChange: (x: number, y: number, z: number)=>void;
    unitConversion?: number;
}

export class Vector3Editor extends React.PureComponent<Vector3Props> {
    render() {
        const {x, y, z, unitConversion = 1, onChange, name} = this.props;
        return(<div className="property">
                <Typography className="name" component={"label"}>{name}</Typography>
                <Typography component={"label"}>x</Typography><NumberInput value={x} unitConversion={unitConversion} variant="short" onChange={value => {onChange(value, y, z)}}/>
                <Typography component={"label"}>y</Typography><NumberInput value={y} unitConversion={unitConversion} variant="short" onChange={value => {onChange(x, value, z)}}/>
                <Typography component={"label"}>z</Typography><NumberInput value={z} unitConversion={unitConversion} variant="short" onChange={value => {onChange(x, y, value)}}/>
            </div>
        );
    }
}
