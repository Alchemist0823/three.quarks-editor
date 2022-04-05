import React, {ChangeEvent, useContext} from "react";
import {
    Behavior, BehaviorTypes,
} from "three.quarks";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {
    IconButton,
} from "@mui/material";
import {ApplicationContext} from "./ApplicationContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import {Vector3Editor} from "./editors/Vector3Editor";
import {Vector3} from "three";
import {NumberInput} from "./editors/NumberInput";
import {Accordion, AccordionDetails, AccordionSummary} from "./SubAccordion";

export interface BehaviorEditorProps {
    behavior: Behavior,
    onDelete(): void;
}

export const BehaviorEditor:React.FC<BehaviorEditorProps> = (props) => {

    const context = useContext(ApplicationContext)!;
    const [checked, setChecked] = React.useState(true);

    const onChangeBehaviorFunc = (paramName: string) => (generator: GenericGenerator) => {
        const behavior = props.behavior;
        (behavior as any)[paramName] = generator;
        context.updateProperties();
    }

    const onChangeNumber = (paramName: string) => (x: number) => {
        const behavior = props.behavior;
        (behavior as any)[paramName] = x;
        context.updateProperties();
    }

    const onChangeVec3 = (paramName: string) => (x: number, y: number, z: number) => {
        const behavior = props.behavior;
        (behavior as any)[paramName].x = x;
        (behavior as any)[paramName].y = y;
        (behavior as any)[paramName].z = z;
        context.updateProperties();
    }

    const handleToggle = (event: ChangeEvent, checked: boolean) => {
        setChecked(checked);
    };

    const behavior = props.behavior;
    //behavior.type
    const entry = BehaviorTypes[behavior.type];
    const editor = entry.params.map(([varName, type]) => {
        switch (type) {
            case 'number':
                return <div className="property" key={varName}>
                    <Typography component={"label"} className="name">{varName}</Typography>
                    <NumberInput key={varName} value={(behavior as any)[varName]}  onChange={onChangeNumber(varName)}/>
                </div>;
            case 'vec3':
                return <Vector3Editor key={varName} name={varName}
                                      x={((behavior as any)[varName] as Vector3).x}
                                      y={((behavior as any)[varName] as Vector3).y}
                                      z={((behavior as any)[varName] as Vector3).z} onChange={onChangeVec3(varName)} />
            case 'valueFunc':
                return <GeneratorEditor key={varName} name={varName}
                                        allowedType={[type, "value"]}
                                        value={(behavior as any)[varName] as any}
                                        onChange={onChangeBehaviorFunc(varName)}/>
            case 'colorFunc':
            case 'value':
                return <GeneratorEditor key={varName} name={varName}
                                        allowedType={[type]}
                                        value={(behavior as any)[varName] as any}
                                        onChange={onChangeBehaviorFunc(varName)}/>
        }
    });

    return (
        <Accordion defaultExpanded={true}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={behavior.type + "-content"}>
                <Typography>{behavior.type}</Typography>
                {/*<Checkbox
                    edge="end"
                    onChange={handleToggle}
                    checked={checked}
                    //inputProps={{'aria-labelledby': labelId}}
                />*/}
                <IconButton aria-label="delete" size="small" onClick={props.onDelete}>
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </AccordionSummary>
            <AccordionDetails>
                {editor}
            </AccordionDetails>
        </Accordion>
    );
}
