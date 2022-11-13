import * as React from "react";
import {BurstParameters, FunctionValueGenerator, ParticleSystem, ValueGenerator} from "three.quarks";
import {Box, IconButton, Typography} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from '@mui/icons-material/Add';
import {BurstEmitterEditor} from "./BurstEmitterEditor";
import {SelectInput} from "./editors/SelectInput";
import {NumberInput} from "./editors/NumberInput";
import {GeneratorEditor, GenericGenerator, ValueType} from "./editors/GeneratorEditor";

interface BurstEmitterPropertiesProps {
    particleSystem: ParticleSystem,
    updateProperties: ()=>void,
}

export const EmissionProperties: React.FC<BurstEmitterPropertiesProps> = React.memo(props => {
    const addBurst = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.particleSystem.emissionBursts.push({
            time: 0,
            count: 10,
            cycle: 0,
            interval: 0,
            probability: 1
        });
        props.updateProperties();
    };

    const deleteBurst = (index: number) => () => {
        props.particleSystem.emissionBursts.splice(index, 1);
        props.updateProperties();
    }

    const editTime = () => {
        props.particleSystem.emissionBursts.sort((a, b) => a.time - b.time);
        props.updateProperties();
    }

    const onChangeLooping = (value: boolean) => {
        props.particleSystem.looping = value;
        props.updateProperties();
    };
    const onChangeDuration = (value: number) => {
        props.particleSystem.duration = value;
        props.updateProperties();
    };
    const onChangeOnlyUsedByOther = (value: boolean) => {
        props.particleSystem.onlyUsedByOther = value;
        props.updateProperties();
    };

    const onChangeEmissionOverTime = (g: GenericGenerator) => {
        props.particleSystem.emissionOverTime = g as ValueGenerator | FunctionValueGenerator;
        props.updateProperties();
    };

    const valueFunctionTypes: ValueType[] = ['value', 'valueFunc'];

    return <Box sx={{width: '100%'}}>
        <div className="property">
            <Typography component={"label"} className="name">Looping</Typography>
            <SelectInput onChange={onChangeLooping}
                         value={props.particleSystem.looping}
                         options={[[true, "true"], [false, "false"]]} />
        </div>
        <div className="property">
            <Typography component={"label"} className="name">Duration</Typography>
            <NumberInput onChange={onChangeDuration}
                         value={props.particleSystem.duration}
                         variant={"short"}/>
        </div>
        <div className="property">
            <Typography component={"label"} className="name">Used by other system</Typography>
            <SelectInput onChange={onChangeOnlyUsedByOther}
                         value={props.particleSystem.onlyUsedByOther}
                         options={[[true, "true"], [false, "false"]]} />
        </div>
        <GeneratorEditor name="Emit Over Time"
                         allowedType={valueFunctionTypes}
                         value={props.particleSystem.emissionOverTime}
                         onChange={onChangeEmissionOverTime}/>
        <div className="property">
            <Typography component={"label"} className="name">Bursts
                <IconButton color="inherit" aria-controls="simple-menu" size="small"
                            aria-haspopup="true" onClick={addBurst} id="new-button">
                <AddIcon fontSize="small" />
            </IconButton></Typography>
        </div>
        <Box sx={{
            width: '100%',
            backgroundColor: theme => theme.palette.background.paper}}>
            {props.particleSystem.emissionBursts.map((burst, index) =>
                <BurstEmitterEditor key={index} params={burst}
                                    onDelete={deleteBurst(index)}
                                    updateProperties={editTime}/>)}
        </Box>
    </Box>;
});
