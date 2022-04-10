import React, {ChangeEvent, useContext} from "react";
import {
    Behavior, BehaviorTypes, EditorType,
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
import {FieldEditor} from "./editors/FieldEditor";

export interface BehaviorEditorProps {
    behavior: Behavior,
    onDelete(): void;
}

export const BehaviorEditor:React.FC<BehaviorEditorProps> = (props) => {

    const context = useContext(ApplicationContext)!;
    const [checked, setChecked] = React.useState(true);

    const handleToggle = (event: ChangeEvent, checked: boolean) => {
        setChecked(checked);
    };

    const behavior = props.behavior;
    //behavior.type
    const entry = BehaviorTypes[behavior.type];
    const editor = entry.params
        .filter(([varName, type]) => type !== "self")
        .map(([varName, type]) =>
        <FieldEditor key={varName}  fieldName={varName} target={behavior}
                     onChange={context.updateProperties} type={type as EditorType}/>);

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
