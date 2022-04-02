import React, {DragEvent, DragEventHandler, useCallback, useContext, useState} from "react";
import {AppContext, ApplicationContext} from "./ApplicationContext";
import {Object3D, Scene} from "three";
import {ParticleEmitter} from "three.quarks";
import './SceneGraphView.scss';
import 'react-contexify/dist/ReactContexify.min.css';
import {treeItemClasses, TreeView} from "@mui/lab";
import {Box, styled, SvgIconProps} from "@mui/material";
import TreeItem, {TreeItemProps, TreeItemClassKey} from "@mui/lab/TreeItem";
import {Typography} from "@mui/material";
import {CodeExporter} from "../util/CodeExporter";
import {ScrollDialog} from "./ScrollDialog";
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CollectionsIcon from '@mui/icons-material/Collections';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {SceneGraphContextMenu} from "./SceneGraphContextMenu";

interface SceneGraphViewMaterialProps {
}

/*
const StyledTreeItemRoot = styled(TreeItem)(({ theme }) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5, pr: 0 }}>
                    <Box component={LabelIcon} color="inherit" sx={{ mr: 1 }} />
                    <Box sx={{ fontWeight: 'inherit', flexGrow: 1 }}>
                        <Typography variant="body2">
                            {labelText}
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="inherit">
                        {labelInfo}
                    </Typography>
                </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}*/
declare module 'react' {
    interface CSSProperties {
        '--tree-view-color'?: string;
        '--tree-view-bg-color'?: string;
    }
}

const StyledTreeItemRoot = styled(TreeItem)(({theme}) => ({
    color: theme.palette.text.secondary,
    [`& .${treeItemClasses.content}`]: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        /*'&.Mui-expanded': {
            fontWeight: theme.typography.fontWeightRegular,
        },*/
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
        '&.Mui-focused, &.Mui-selected, &.Mui-selected.Mui-focused': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.action.selected})`,
            color: 'var(--tree-view-color)',
        },
        [`& .${treeItemClasses.label}`]: {
            fontWeight: 'inherit',
            color: 'inherit',
        },
    },
    [`& .${treeItemClasses.group}`]: {
        //marginLeft: 0,
        [`& .${treeItemClasses.content}`]: {
            paddingLeft: theme.spacing(2),
        },
    },
}));


type StyledTreeItemProps = TreeItemProps & {
    bgColor?: string;
    color?: string;
    labelIcon: React.ElementType<SvgIconProps>;
    labelInfo?: string;
    labelText: string;
    object3d: Object3D;
    onDragStart: DragEventHandler<HTMLDivElement>;
    onDragOver: DragEventHandler<HTMLDivElement>;
    draggable: boolean;
};

function StyledTreeItem(props: StyledTreeItemProps) {
    const {
        bgColor,
        color,
        labelIcon: LabelIcon,
        labelInfo,
        labelText,
        object3d,
        onDragStart,
        onDragOver,
        draggable,
        ...other
    } = props;

    return (
        <StyledTreeItemRoot
            label={
                    <Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}} onDragStart={onDragStart} onDragOver={onDragOver} draggable>
                        <Box component={LabelIcon} color="inherit" sx={{mr: 1}}/>
                        <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>
                            {labelText}
                        </Typography>
                        <Typography variant="caption" color="inherit">
                            {labelInfo}
                        </Typography>
                    </Box>
            }
            style={{
                '--tree-view-color': color,
                '--tree-view-bg-color': bgColor,
            }}
            {...other}
        />
    );
}

export const SceneGraphTreeView: React.FC<SceneGraphViewMaterialProps> = (props) => {
    const context = useContext(ApplicationContext)!;
    //const [selected, setSelected] = React.useState<string>("");
    const [expanded, setExpanded] = React.useState<string[]>([]);

    const shouldList = (child: Object3D) => {
        return child.type !== 'BatchedParticleRenderer' && child.type !== 'AxesHelper' && child.type !== 'BoxHelper' && child.name !== 'TransformControls' && child.userData.listable !== false;
    }
    /*
        const countIndex = (index: number, object3d: Object3D): [Object3D | null, number] => {
            if (index === 0)
                return [object3d, 0];
            index --;
            for (const child of object3d.children) {
                if (shouldList(child)) {
                    const [res, newIndex] = countIndex(index, child);
                    if (res)
                        return [res, newIndex];
                    index = newIndex;
                }
            }
            return [null, index];
        }*/
    const handleSelect = (event: React.ChangeEvent<any>, nodeIds: string) => {
        if (nodeIds.length > 0) {
            //const index = parseInt(nodeIds);
            let selected;
            context.scene.traverse((obj) => {
                if (obj.uuid === nodeIds) selected = obj;
            });
            //const [object3d, ] = countIndex(index, context.scene);
            if (selected) {
                context.actions.selectObject3d(selected);
            }
        }
        //setSelected(nodeIds);
    };
    const handleToggle = (event: React.ChangeEvent<any>, nodeIds: string[]) => {
        //console.log(event.target);
        if ((event.target as HTMLElement).tagName === 'svg') {
            setExpanded(nodeIds);
        }
    };

    const getObjectName = (object3d: Object3D) => {
        let type = 'object';
        if (object3d instanceof ParticleEmitter) {
            type = 'ParticleSystem';
        } else {
            type = object3d.type;
        }
        let name = 'unnamed';
        if (object3d.name) {
            name = object3d.name;
        }
        return `[${type}] ${name}`;
    };

    const [dragged, setDragged] = useState<Object3D | null>(null);

    const onDragOver = (object3d: Object3D) => (event: DragEvent<any>) => {
        if (dragged) {
            object3d.attach(dragged);
            context.updateProperties();
        }
    }

    const onDragStart = (object3d: Object3D) => (event: DragEvent<any>) => {
        console.log("dragstart");
        if (object3d !== context.scene) {
            setDragged(object3d);
        }
    }

    const renderObject = useCallback((object3d: Object3D): React.ReactNode => {
        const items = [];
        for (const child of object3d.children) {
            if (shouldList(child)) {
                const result = renderObject(child);
                items.push(result);
            }
        }
        let icon: React.ElementType<SvgIconProps>;
        switch (object3d.type) {
            case "BatchedParticleRenderer":
                icon = CodeIcon;
                break;
            case "ParticleSystemBatch":
                icon = CodeIcon;
                break;
            case "ParticleEmitter":
                icon = CodeIcon;
                break;
            case "AmbientLight":
            case "DirectionalLight":
            case "PointLight":
                icon = LightbulbIcon;
                break;
            case "Group":
                icon = CollectionsIcon;
                break;
            default:
                icon = CodeIcon;
                break;
        }

        return <StyledTreeItem key={object3d.uuid}
                               draggable={object3d !== context.scene}
                               onDragOver={onDragOver(object3d)}
                               onDragStart={onDragStart(object3d)}
                               nodeId={object3d.uuid}
                               labelIcon={icon}
                               labelText={getObjectName(object3d)}
                               object3d={object3d}>
            {items}
        </StyledTreeItem>;
    }, []);

    const renderScene = () => {
        //console.log("rerender TreeView");
        let selected: Object3D | null = null;// context.selection.map(obj => obj.uuid);
        if (context.selection.length > 0) {
            selected = context.selection[0];
        }
        if (selected) {
            //console.log(selected.uuid);
            let current = selected;
            while (current.parent != null) {
                if (expanded.indexOf(current.parent.uuid) === -1) {
                    expanded.push(current.parent.uuid);
                }
                current = current.parent;
            }
        }

        return <TreeView
            sx={{
                height: 240,
                flexGrow: 1
            }}
            selected={selected != null ? selected.uuid : ""}
            expanded={expanded}
            onNodeToggle={handleToggle}
            onNodeSelect={handleSelect}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            multiSelect={false}
        >
            {renderObject(context.scene)}
        </TreeView>;
    }


    return <Box sx={{height: 270, flexGrow: 1, overflow: 'auto'}}>
        <Typography sx={{
            fontSize: theme => theme.typography.pxToRem(15),
            fontWeight: theme => theme.typography.fontWeightRegular
        }}> Outline </Typography>
        {renderScene()}
    </Box>;
}
//     const [code, setCode] = React.useState<string>('');
//     <ScrollDialog content={code} open={code !== ''} handleClose={()=>{setCode('')}} />
//<Item onClick={onContextMenuCopyCode}>Copy JS Code</Item>
