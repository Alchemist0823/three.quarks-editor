import * as React from "react";
import {ApplicationContext, ApplicationContextConsumer} from "./ApplicationContext";
import {
    ParticleSystem,
    ParticleEmitter
} from "three.quarks";
import {Object3D} from "three";
import {Box, ButtonGroup, Checkbox, FormControlLabel, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useContext} from "react";
import {NumberInput} from "./editors/NumberInput";

interface PlayControllerProps {
    object3d?: Object3D,
    updateProperties: () => void,
}

export const PlayController: React.FC<PlayControllerProps> = (props) => {
    const context = useContext(ApplicationContext)!;

    const getSystems = () => {
        const systems: Array<ParticleSystem> = [];
        if (props.object3d) {
            if (props.object3d instanceof ParticleEmitter) {
                systems.push(props.object3d.system);
            }
            props.object3d.traverse(object => {
                if (object instanceof ParticleEmitter) {
                    systems.push(object.system);
                }
            });
        }
        return systems;
    };

    const checkPause = (systems: Array<ParticleSystem>) => {
        let paused = true;
        systems.forEach(system => {
            if (!system.paused) {
                paused = false;
            }
        });
        return paused;
    };

    const togglePause = () => {
        const systems: Array<ParticleSystem> = getSystems();
        const paused = checkPause(systems);

        if (paused) {
            systems.forEach(system => {
                system.play();
            });
        } else {
            systems.forEach(system => {
                system.pause();
            });
        }
        props.updateProperties();
    };

    const onRestart = () => {
        getSystems().forEach((system) => {
            system.restart();
        });
        props.updateProperties();
    };

    const onStop = () => {
        getSystems().forEach((system) => {
            system.restart();
            system.pause();
        });
        props.updateProperties();
    };
    const systems = getSystems();
    const isPaused = checkPause(systems);

    return <Box
        sx={{position: "absolute", bottom: 8, right: 8, color: "white"}}>
        <ToggleButtonGroup color="primary" aria-label="primary button group">
        </ToggleButtonGroup>
        <FormControlLabel control={<Checkbox checked={context.showGUI} onChange={context.actions.toggleGUI} />} label="Show GUI" />
        <NumberInput label="Speed" onChange={context.actions.changePlaySpeed} value={context.playSpeed}/>
        <ButtonGroup color="primary" aria-label="primary button group" sx={{backgroundColor: "white"}}>
            <Button disabled={systems.length === 0} onClick={togglePause}> {isPaused ? "Play" : "Pause" } </Button>
            <Button disabled={systems.length === 0} onClick={onRestart}>Restart</Button>
            <Button disabled={systems.length === 0} onClick={onStop}>Stop</Button>
        </ButtonGroup>
    </Box>;
}
