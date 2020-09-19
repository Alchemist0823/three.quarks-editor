import * as React from "react";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";
import {ParticleSystem} from "three.quarks";
import {FunctionValueGenerator, ValueGenerator} from "three.quarks";
import {ColorGenerator, FunctionColorGenerator} from "three.quarks";
import {ListItem, List, Theme, createStyles, Typography, Toolbar} from "@material-ui/core";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

interface BehaviorsPropertiesProps {
    particleSystem: ParticleSystem,
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

export function BehaviorsProperties(props: BehaviorsPropertiesProps) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0, 1, 2, 3]);

    const valueFunctionTypes = ['value', 'functionValue'] as Array<ValueType>;
    const colorValueFunctionTypes = ['color', 'functionColor'] as Array<ValueType>;
    const onChangeStartColor = (g: GenericGenerator) => {
        props.particleSystem.startColor = g as ColorGenerator | FunctionColorGenerator;
        props.updateProperties();
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
            <ApplicationContextConsumer>
                {context => context &&
                    <List dense className={classes.listRoot}>
                        {
                            props.particleSystem.behaviors.map((behavior, index) => {
                                const labelId = `checkbox-list-secondary-label-${index}`;
                                return (
                                    <ListItem key={index} button>
                                        <ListItemText id={labelId} primary={behavior.type}/>
                                        <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={handleToggle(index)}
                                                checked={checked.indexOf(index) !== -1}
                                                inputProps={{'aria-labelledby': labelId}}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                }
            </ApplicationContextConsumer>
        </div>
    );
}
