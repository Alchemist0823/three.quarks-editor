import { BurstParameters } from "three.quarks";
import React from "react";
import {Accordion, AccordionDetails, AccordionSummary} from "./SubAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {NumberInput} from "./editors/NumberInput";

interface BurstEmitterEditorProps {
    params: BurstParameters;
    updateProperties: ()=>void;
    onDelete: ()=>void;
}

export const BurstEmitterEditor: React.FC<BurstEmitterEditorProps> = React.memo((props) => {

    const onChangeKeyValue = <T,>(k: string, v: T) => {
        (props.params as any)[k] = v;
        props.updateProperties();
    };

    const keys = ['time','count','cycle','interval','probability'];

    return <Accordion defaultExpanded={true}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls={"burst-content"}>
            <Typography> Burst </Typography>
            <IconButton aria-label="delete" size="small" onClick={props.onDelete}>
                <DeleteIcon fontSize="small" />
            </IconButton>
        </AccordionSummary>
        <AccordionDetails>
        {keys.map((varName) => <div className="property" key={varName}>
                <Typography component={"label"} className="name">{varName}</Typography>
                <NumberInput key={varName} value={(props.params as any)[varName]} onChange={(value) => onChangeKeyValue(varName, value)}/>
            </div>
        )}
        </AccordionDetails>
    </Accordion>
});
