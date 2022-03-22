import * as React from "react";
import {ApplicationContext, ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {
    Behavior, BehaviorTypes, Bezier,
    ColorOverLife, ColorRange, Constructable,
    FrameOverLife,
    OrbitOverLife,
    PiecewiseBezier,
    RotationOverLife,
    SizeOverLife, SpeedOverLife
} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import { FunctionColorGenerator} from "three.quarks";
import {ListItem, List, Theme, createStyles, ListItemIcon, Box} from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import makeStyles from "@mui/material/styles/makeStyles";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {Vector3, Vector4} from "three";
import {useContext} from "react";
import {BehaviorEditor} from "./BehaviorEditor";

interface BehaviorsPropertiesProps {
    behaviors: Array<Behavior>,
    updateProperties: ()=>void,
}

function BehaviorsPropertiesFunc(props: BehaviorsPropertiesProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    }

    const deleteBehavior = () => {
        props.behaviors.splice(selectedIndex, 1);
        props.updateProperties();
    }

    const genDefaultBezier = () => new PiecewiseBezier([[new Bezier(0, 0.3333, 0.6667, 1.0), 0]]);
    const genDefaultColor = () => new ColorRange(new Vector4(1.0, 1.0, 1.0, 1.0), new Vector4(0.0, 0.0, 0.0, 1.0));

    const onAddNewBehavior = (type: string) => () => {
        const entry = BehaviorTypes.find(entry => entry[0] === type);
        let behavior;
        if (entry) {
            const args = [];
            const params = entry[2] as string[][];
            for (let i = 0; i < params.length; i ++) {
                switch (params[i][1]) {
                    case "vec3":
                        args.push(new Vector3(0, 0, 0));
                        break;
                    case "valueFunc":
                        args.push(genDefaultBezier());
                        break;
                    case "colorFunc":
                        args.push(genDefaultColor());
                        break;
                }
            }
            behavior = new (entry[1] as Constructable<Behavior>)(...args);
            console.log(behavior);
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
                <Button color="inherit" aria-controls="simple-menu"
                        aria-haspopup="true" onClick={handleClick} id="new-button">
                    New
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {BehaviorTypes.map((entry, index) =>
                        <MenuItem key={index} onClick={onAddNewBehavior(entry[0] as string)}>{entry[0]}</MenuItem> )}
                </Menu>
                <Button onClick={deleteBehavior}>Remove</Button>
            </ButtonGroup>
            <List dense sx={{
                width: '100%',
                backgroundColor: theme => theme.palette.background.paper}}>
                {props.behaviors.map((behavior, index) =>
                    <BehaviorEditor behavior={behavior} selected={selectedIndex === index} onSelect={() => {setSelectedIndex(index)}}/>)}
            </List>
        </Box>
    );
}

export const BehaviorsProperties = React.memo(BehaviorsPropertiesFunc);
