import * as React from "react";
import {BurstParameters} from "three.quarks";
import {Box, IconButton} from "@mui/material";
import ButtonGroup from "@mui/material/ButtonGroup";
import AddIcon from '@mui/icons-material/Add';
import {BurstEmitterEditor} from "./BurstEmitterEditor";

interface BurstEmitterPropertiesProps {
    bursts: Array<BurstParameters>,
    updateProperties: ()=>void,
}

export const BurstEmitterProperties: React.FC<BurstEmitterPropertiesProps> = React.memo(props => {
    const addBurst = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.bursts.push({
            time: 0,
            count: 10,
            cycle: 0,
            interval: 0,
            probability: 1
        });
        props.updateProperties();
    };

    const deleteBurst = (index: number) => () => {
        props.bursts.splice(index, 1);
        props.updateProperties();
    }

    const editTime = () => {
        props.bursts.sort((a, b) => a.time - b.time);
        props.updateProperties();
    }

    return <Box sx={{width: '100%'}}>
            <ButtonGroup color="primary" aria-label="primary button group">
                <IconButton color="inherit" aria-controls="simple-menu" size="small"
                            aria-haspopup="true" onClick={addBurst} id="new-button">
                    <AddIcon fontSize="small" />
                </IconButton>
            </ButtonGroup>
            <Box sx={{
                width: '100%',
                backgroundColor: theme => theme.palette.background.paper}}>
                {props.bursts.map((burst, index) =>
                    <BurstEmitterEditor key={index} params={burst}
                                        onDelete={deleteBurst(index)}
                                        updateProperties={editTime}/>)}
            </Box>
        </Box>;
});
