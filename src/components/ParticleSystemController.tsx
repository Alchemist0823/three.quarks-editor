import * as React from "react";
import {ApplicationContextConsumer} from "./ApplicationContext";
import {
    ParticleSystem,
    ParticleEmitter
} from "three.quarks";
import {Object3D} from "three";
import {ButtonGroup} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

interface ParticleSystemControllerProps {
    object3d: Object3D,
    updateProperties: Function,
}

interface ParticleSystemControllerState {

}

export class ParticleSystemController extends React.PureComponent<ParticleSystemControllerProps, ParticleSystemControllerState> {
    constructor(props: Readonly<ParticleSystemControllerProps>) {
        super(props);
    }

    getSystems = () => {
        const systems: Array<ParticleSystem> = [];
        if (this.props.object3d instanceof ParticleEmitter) {
            systems.push(this.props.object3d.system);
        }
        this.props.object3d.traverse(object => {
            if (object instanceof ParticleEmitter) {
                systems.push(object.system);
            }
        });
        return systems;
    };

    checkPause = (systems: Array<ParticleSystem>) => {
        let paused = true;
        systems.forEach(system => {
            if (!system.paused) {
                paused = false;
            }
        });
        return paused;
    };

    togglePause = () => {
        const systems: Array<ParticleSystem> = this.getSystems();
        const paused = this.checkPause(systems);

        if (paused) {
            systems.forEach(system => {
                system.play();
            });
        } else {
            systems.forEach(system => {
                system.pause();
            });
        }
        this.props.updateProperties();
    };

    onRestart = () => {
        this.getSystems().forEach((system) => {
            system.restart();
        });
        this.props.updateProperties();
    };

    onStop = () => {
        this.getSystems().forEach((system) => {
            system.restart();
            system.pause();
        });
        this.props.updateProperties();
    };

    render() {
        return (
            <div>
                <ToggleButtonGroup color="primary" aria-label="primary button group">
                </ToggleButtonGroup>
                <ApplicationContextConsumer>
                    {context => context &&
                    <ButtonGroup color="primary" aria-label="primary button group">
                        <Button disabled={!this.checkPause(this.getSystems())} onClick={this.togglePause}>Play</Button>
                        <Button disabled={this.checkPause(this.getSystems())} onClick={this.togglePause}>Pause</Button>
                        <Button onClick={this.onRestart}>Restart</Button>
                        <Button onClick={this.onStop}>Stop</Button>
                    </ButtonGroup>}
                </ApplicationContextConsumer>
            </div>
        );
    }
}
