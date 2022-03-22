import React, {ChangeEvent, useContext} from "react";
import {
    Behavior,
    ColorOverLife, FrameOverLife,
    FunctionColorGenerator,
    FunctionValueGenerator, OrbitOverLife,
    RotationOverLife, SizeOverLife, SpeedOverLife,
    ValueGenerator
} from "three.quarks";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ListItem, ListItemIcon} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import {ApplicationContext} from "./ApplicationContext";

export interface BehaviorEditorProps {
    behavior: Behavior,
    selected: boolean,
    onSelect(): void;
}

export const BehaviorEditor:React.FC<BehaviorEditorProps> = (props) => {

    const context = useContext(ApplicationContext)!;
    const [checked, setChecked] = React.useState(true);

    const onChangeBehaviorFunc = (generator: GenericGenerator) => {
        const behavior = props.behavior;
        switch (behavior.type) {
            case 'ColorOverLife':
                (behavior as ColorOverLife).func = generator as FunctionColorGenerator;
                break;
            case 'RotationOverLife':
                (behavior as RotationOverLife).angularVelocityFunc = generator as FunctionValueGenerator | ValueGenerator;
                break;
            case 'SizeOverLife':
                (behavior as SizeOverLife).func = generator as FunctionValueGenerator;
                break;
            case 'FrameOverLife':
                (behavior as FrameOverLife).func = generator as FunctionValueGenerator;
                break;
            case 'OrbitOverLife':
                (behavior as OrbitOverLife).angularVelocityFunc = generator as FunctionValueGenerator | ValueGenerator;
                break;
            default:
                break;
        }
        context.updateProperties();
    }

    const handleListItemClick = () => {
        props.onSelect();
    };

    const handleToggle = (event: ChangeEvent, checked: boolean) => {
        setChecked(checked);
    };

    const behavior = props.behavior;
    let valueTypes: Array<ValueType>;
    let func: FunctionColorGenerator | FunctionValueGenerator | ValueGenerator | null = null;
    switch (behavior.type) {
        case 'ColorOverLife':
            valueTypes = ['functionColor'];
            func = (behavior as ColorOverLife).func;
            break;
        case 'RotationOverLife':
            valueTypes = ['functionValue', 'value'];
            func = (behavior as RotationOverLife).angularVelocityFunc;
            break;
        case 'SizeOverLife':
            valueTypes = ['functionValue'];
            func = (behavior as SizeOverLife).func;
            break;
        case 'FrameOverLife':
            valueTypes = ['functionValue'];
            func = (behavior as FrameOverLife).func;
            break;
        case 'OrbitOverLife':
            valueTypes = ['functionValue'];
            func = (behavior as OrbitOverLife).angularVelocityFunc;
            break;
        case 'SpeedOverLife':
            valueTypes = ['functionValue'];
            func = (behavior as SpeedOverLife).func;
            break;
        default:
            valueTypes = ['functionValue'];
            break;
    }

    let editor;
    if (func) {
        editor = <GeneratorEditor name="Func"
                                  allowedType={valueTypes}
                                  generator={func!}
                                  updateGenerator={onChangeBehaviorFunc}/>;
    }

    return (
        <ListItem
                  selected={props.selected}
                  onClick={handleListItemClick}>
            <ListItemIcon>
                <Checkbox
                    edge="end"
                    onChange={handleToggle}
                    checked={checked}
                    //inputProps={{'aria-labelledby': labelId}}
                />
            </ListItemIcon>
            <ListItemText primary={behavior.type}
                          secondary={editor}/>
        </ListItem>
    );
}
