import * as React from "react";
import {
    Behavior, BehaviorTypes, Bezier,
    ColorRange, ConstantValue, Constructable,
    PiecewiseBezier,
} from "three.quarks";
import {Box, IconButton} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {Vector3, Vector4} from "three";
import {BehaviorEditor} from "./BehaviorEditor";
import AddIcon from '@mui/icons-material/Add';

interface BehaviorsPropertiesProps {
    behaviors: Array<Behavior>,
    updateProperties: ()=>void,
}

function BehaviorsPropertiesFunc(props: BehaviorsPropertiesProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    const deleteBehavior = (index: number) => () => {
        props.behaviors.splice(index, 1);
        props.updateProperties();
    }

    const genDefaultBezier = () => new PiecewiseBezier([[new Bezier(0, 0.3333, 0.6667, 1.0), 0]]);
    const genDefaultColor = () => new ColorRange(new Vector4(1.0, 1.0, 1.0, 1.0), new Vector4(0.0, 0.0, 0.0, 1.0));

    const onAddNewBehavior = (type: string) => () => {
        const entry = BehaviorTypes[type];
        let behavior;
        if (entry) {
            const args = [];
            const params = entry.params as string[][];
            for (let i = 0; i < params.length; i ++) {
                switch (params[i][1]) {
                    case "number":
                        args.push(1);
                        break;
                    case "vec3":
                        args.push(new Vector3(0, 0, 0));
                        break;
                    case "valueFunc":
                        args.push(genDefaultBezier());
                        break;
                    case "value":
                        args.push(new ConstantValue(1));
                        break;
                    case "colorFunc":
                        args.push(genDefaultColor());
                        break;
                }
            }
            behavior = new (entry.constructor)(...args);
        }
        if (behavior) {
            props.behaviors.push(behavior);
            props.updateProperties();
        }
        setAnchorEl(null);
    }

    return (
        <Box sx={{width: '100%'}}>
            <ButtonGroup color="primary" aria-label="primary button group">
                <IconButton color="inherit" aria-controls="simple-menu" size="small"
                        aria-haspopup="true" onClick={handleClick} id="new-button">
                    <AddIcon fontSize="small" />
                </IconButton>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {Object.keys(BehaviorTypes).map((entry, index) =>
                        <MenuItem key={index} onClick={onAddNewBehavior(entry)}>{entry}</MenuItem> )}
                </Menu>
            </ButtonGroup>
            <Box sx={{
                width: '100%',
                backgroundColor: theme => theme.palette.background.paper}}>
                {props.behaviors.map((behavior, index) =>
                    <BehaviorEditor key={index} behavior={behavior} onDelete={deleteBehavior(index)}/>)}
            </Box>
        </Box>
    );
}

export const BehaviorsProperties = React.memo(BehaviorsPropertiesFunc);
