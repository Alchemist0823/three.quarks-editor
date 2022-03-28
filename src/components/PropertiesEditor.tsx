import * as React from "react";
import {ConstantValue} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, ConstantColor, FunctionColorGenerator} from "three.quarks";
import {Object3D, Vector4} from "three";
import {ObjectProperties} from "./ObjectProperties";
import {
    AppContext,
    ApplicationContext,
    ApplicationContextConsumer,
    ApplicationContextProvider
} from "./ApplicationContext";
import {ParticleEmitter} from "three.quarks";
import {ParticleSystemProperties} from "./ParticleSystemProperties";
import {ParticleRendererProperties} from "./ParticleRendererProperties";
import {ScriptProperties} from "./ScriptProperties";
import {EmitterShapeProperties} from "./EmitterShapeProperties";
import {ParticleSystemController} from "./ParticleSystemController";
import {AccordionProps, AccordionSummaryProps, Box, createStyles, makeStyles, styled, Theme} from "@mui/material";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordion from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import "./PropertiesEditor.scss";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import {BehaviorsProperties} from "./BehaviorsProperties";
import {useContext, useState} from "react";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />))(({theme})=>({
    minHeight: 0,
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    //marginBottom: -1,
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));


const StyledHeading = styled(Typography)(({theme})=>({
    fontWeight: theme.typography.fontWeightRegular,
}));

interface PropertiesEditorProps {
    object3d: Object3D
}

export default function PropertiesEditor(props: PropertiesEditorProps) {
    const context = useContext(ApplicationContext)!;
    const [expanded, setExpanded] = useState(['Object', 'EmitterShape', 'ParticleRenderer','ParticleEmitter','Behaviors','Script']);

    const handleChange = (panel: string) => (event: any, isExpanded: boolean) => {
        if (isExpanded) {
            expanded.push(panel);
        } else {
            expanded.splice(expanded.indexOf(panel), 1);
        }
        setExpanded(expanded);
        context.updateProperties();
    };

    return (
        <Box sx={{width: '100%'}}>
            <ParticleSystemController object3d={props.object3d}
                                      updateProperties={context.updateProperties}/>
            <Accordion expanded={(expanded.indexOf('Object') !== -1)} onChange={handleChange('Object')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="object-content"
                    id="object-header"
                >
                    <StyledHeading>Object</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                        <ObjectProperties object3d={props.object3d}
                                          updateProperties={context.updateProperties}/>
                </AccordionDetails>
            </Accordion>
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion expanded={(expanded.indexOf('EmitterShape') !== -1)} onChange={handleChange('EmitterShape')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="emitter-shape-content"
                    id="emitter-shape-header">
                    <StyledHeading>Emitter Shape</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                    <EmitterShapeProperties particleSystem={(props.object3d as ParticleEmitter).system}/>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion expanded={(expanded.indexOf('ParticleRenderer') !== -1)} onChange={handleChange('ParticleRenderer')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="particle-renderer-content"
                    id="particle-renderer-header">
                    <StyledHeading>Particle Renderer</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                    <ParticleRendererProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                                updateProperties={context.updateProperties}/>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion expanded={(expanded.indexOf('ParticleEmitter') !== -1)} onChange={handleChange('ParticleEmitter')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="particle-emitter-content"
                    id="particle-emitter-header">
                    <StyledHeading>Particle Emitter</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                    <ParticleSystemProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                          updateProperties={context.updateProperties}/>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion expanded={(expanded.indexOf('Behaviors') !== -1)} onChange={handleChange('Behaviors')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="behaviors-content"
                    id="behaviors-header">
                    <StyledHeading>Behaviors</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                    <BehaviorsProperties behaviors={(props.object3d as ParticleEmitter).system.behaviors}
                                                updateProperties={context.updateProperties}/>
                </AccordionDetails>
            </Accordion>
            }
            <Accordion expanded={(expanded.indexOf('Script') !== -1)} onChange={handleChange('Script')}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="script-content"
                    id="script-header"
                >
                    <StyledHeading>Script</StyledHeading>
                </AccordionSummary>
                <AccordionDetails>
                    <ScriptProperties object3d={props.object3d}
                                      updateProperties={context.updateProperties}/>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
