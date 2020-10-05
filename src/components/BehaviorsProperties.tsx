import * as React from "react";
import {ApplicationContextConsumer, ApplicationContextProvider} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {Behavior, ColorOverLife, FrameOverLife, ParticleSystem, RotationOverLife, SizeOverLife} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, FunctionColorGenerator} from "three.quarks";
import {ListItem, List, Theme, createStyles, Typography, Toolbar, ListItemIcon} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {memo} from "react";
import AccordionDetails from "@material-ui/core/AccordionDetails";

interface BehaviorsPropertiesProps {
    behaviors: Array<Behavior>,
    updateProperties: Function,
}


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        listRoot: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        }
    }),
);

/*
<GeneratorEditor name="Start Speed"
                 allowedType={valueFunctionTypes}
                 generator={this.props.particleSystem.startSpeed}
                 updateGenerator={this.onChangeStartSpeed}/>*/

function BehaviorsPropertiesFunc(props: BehaviorsPropertiesProps) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0, 1, 2, 3]);
    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const handleListItemClick = (event: any, index: number) => {
        setSelectedIndex(index);
    };

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const onChangeBehaviorFunc = (index: number) => (generator: GenericGenerator) => {
        const behavior = props.behaviors[index];
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
            default:
                break;
        }
        console.log("changing")
        props.updateProperties();
    }

    return (
        <div className={classes.root}>
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
                    <MenuItem onClick={handleClose}>SizeOverLife</MenuItem>
                    <MenuItem onClick={handleClose}>ColorOverLife</MenuItem>
                    <MenuItem onClick={handleClose}>RotationOverLife</MenuItem>
                    <MenuItem onClick={handleClose}>FrameOverLife</MenuItem>
                </Menu>
                <Button>Remove</Button>
            </ButtonGroup>
            <List dense className={classes.listRoot}>
                <ApplicationContextConsumer>
                    {context => context &&
                    props.behaviors.map((behavior, index) => {
                        const labelId = `behavior-list-label-${index}`;
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
                            default:
                                valueTypes = ['functionValue'];
                                break;
                        }

                        let editor;
                        if (func) {
                            editor = <GeneratorEditor name="Func"
                                                      allowedType={valueTypes}
                                                      generator={func!}
                                                      updateGenerator={onChangeBehaviorFunc(index)}/>;
                        }

                        return (
                            <ListItem key={index}
                                      selected={selectedIndex === index}
                                      onClick={(event) => handleListItemClick(event, index)}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="end"
                                        onChange={handleToggle(index)}
                                        checked={checked.indexOf(index) !== -1}
                                        inputProps={{'aria-labelledby': labelId}}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={behavior.type}
                                              secondary={editor}/>
                            </ListItem>
                        );
                    })
                }
                </ApplicationContextConsumer>
            </List>
        </div>
    );
}

export const BehaviorsProperties = React.memo(BehaviorsPropertiesFunc);