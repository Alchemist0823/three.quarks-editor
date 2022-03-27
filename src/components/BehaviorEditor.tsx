import React, {ChangeEvent, useContext} from "react";
import {
    Behavior, BehaviorTypes,
    ColorOverLife, FrameOverLife,
    FunctionColorGenerator,
    FunctionValueGenerator, OrbitOverLife, ParticleEmitter,
    RotationOverLife, SizeOverLife, SpeedOverLife,
    ValueGenerator
} from "three.quarks";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {
    AccordionProps,
    AccordionSummaryProps,
    Card,
    IconButton,
    ListItem,
    ListItemIcon,
    styled
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import {ApplicationContext} from "./ApplicationContext";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from "@mui/material/Typography";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {Vector3Editor} from "./editors/Vector3Editor";
import {Vector3} from "three";
import {NumberInput} from "./editors/NumberInput";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    /*'&:not(:last-child)': {
        borderBottom: 0,
    },*/
    '&:before': {
        display: 'none',
    },
    '& .MuiAccordionSummary-root.Mui-expanded': {
        minHeight: 0,
        margin: 0,
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
    marginBottom: -1,
    '& .MuiAccordionSummary-content.Mui-expanded': {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        width: '100%',
    },
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(1),
    borderTop: '1px solid rgba(0, 0, 0, .125)',

}));

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
