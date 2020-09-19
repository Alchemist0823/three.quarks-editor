import * as React from "react";
import {ConstantValue} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, ConstantColor, FunctionColorGenerator} from "three.quarks";
import {Object3D, Vector4} from "three";
import {ObjectProperties} from "./ObjectProperties";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {ParticleEmitter} from "three.quarks";
import {ParticleSystemProperties} from "./ParticleSystemProperties";
import {ParticleRendererProperties} from "./ParticleRendererProperties";
import {ScriptProperties} from "./ScriptProperties";
import {EmitterShapeProperties} from "./EmitterShapeProperties";
import {ParticleSystemController} from "./ParticleSystemController";
import {createStyles, makeStyles, Theme} from "@material-ui/core";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordion from "@material-ui/core/Accordion";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccordionDetails from "@material-ui/core/AccordionDetails";
import "./PropertiesEditor.scss";
import withStyles from "@material-ui/core/styles/withStyles";
import {BehaviorsProperties} from "./BehaviorsProperties";

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 32,
        '&$expanded': {
            minHeight: 32,
        },
    },
    content: {
        margin: 0,
        '&$expanded': {
            margin: 0,
        },
    },
    expandIcon: {
        padding: 0
    },
    expanded: {},
})(MuiAccordionSummary);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: theme.typography.fontWeightRegular,
        },
    }),
);

interface PropertiesEditorProps {
    object3d: Object3D
}

export default function PropertiesEditor(props: PropertiesEditorProps) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="object-content"
                    id="object-header"
                >
                    <Typography className={classes.heading}>Object</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <ObjectProperties object3d={props.object3d}
                                              updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="particle-controller-content"
                    id="particle-controller-header"
                >
                    <Typography className={classes.heading}>Particle Controller</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <ParticleSystemController object3d={props.object3d}
                                                      updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="emitter-shape-content"
                    id="emitter-shape-header">
                    <Typography className={classes.heading}>Emitter Shape</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <EmitterShapeProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                                    updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="particle-renderer-content"
                    id="particle-renderer-header">
                    <Typography className={classes.heading}>Particle Renderer</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <ParticleRendererProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                                        updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="particle-emitter-content"
                    id="particle-emitter-header">
                    <Typography className={classes.heading}>Particle Emitter</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <ParticleSystemProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                                      updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            }
            {(props.object3d instanceof ParticleEmitter) &&
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="behaviors-content"
                    id="behaviors-header">
                    <Typography className={classes.heading}>Behaviors</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <BehaviorsProperties particleSystem={(props.object3d as ParticleEmitter).system}
                                                        updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
            }
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="script-content"
                    id="script-header"
                >
                    <Typography className={classes.heading}>Script</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ApplicationContextConsumer>
                        {context => context &&
                            <ScriptProperties object3d={props.object3d}
                                              updateProperties={context.actions.updateProperties}/>
                        }
                    </ApplicationContextConsumer>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}
/*
<Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
    <Icon name='dropdown'/>
    Emission
</Accordion.Title>
<Accordion.Content active={activeIndex === 1}>
<div><GeneratorEditor name="startSpeed"
allowedType={['value', 'function'] as Array<ValueType>}
generator={this.state.valueGenerator}
updateGenerator={g => this.setState({valueGenerator: g})}/></div>
<div><GeneratorEditor name="startColor"
allowedType={['color', 'functionColor'] as Array<ValueType>}
generator={this.state.colorGenerator}
updateGenerator={g => this.setState({colorGenerator: g})}/></div>
</Accordion.Content>

<Accordion.Title active={activeIndex === 2} index={2} onClick={this.handleClick}>
    <Icon name='dropdown'/>
    Renderer
    </Accordion.Title>
    <Accordion.Content active={activeIndex === 2}>
</Accordion.Content>

<Accordion.Title active={activeIndex === 3} index={3} onClick={this.handleClick}>
    <Icon name='dropdown'/>
    Emission Shape
</Accordion.Title>
<Accordion.Content active={activeIndex === 3}>
<Select placeholder='Emitter' options={this.emitterOptions}/>
</Accordion.Content>*/
