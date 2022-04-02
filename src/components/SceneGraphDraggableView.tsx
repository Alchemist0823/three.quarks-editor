import React, {DragEvent, SetStateAction, useCallback, useContext, useState} from "react";
import {
    Tree,
    NodeModel, DragLayerMonitorProps, DropOptions
} from "@minoru/react-dnd-treeview";
import {ApplicationContext} from "./ApplicationContext";
import {Object3D} from "three";
import {ParticleEmitter} from "three.quarks";
import {Box, CssBaseline, SvgIconProps, Typography} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import CollectionsIcon from "@mui/icons-material/Collections";
import {TreeView} from "@mui/lab";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

import {SceneGraphContextMenu} from "./SceneGraphContextMenu";
import styles from "./SceneGraphDraggableView.module.scss";

interface SceneGraphDraggableViewProps {

}
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

interface CustomizedNodeProps {
    node: NodeModel<Object3D>;
    depth: number;
    isOpen: boolean;
    isSelected: boolean;
    onToggle: (id: NodeModel["id"]) => void;
    onSelect: (node: NodeModel<Object3D>) => void;
    handleContextMenu: (event: React.MouseEvent, node: NodeModel<Object3D>) => void;
}

const CustomizedNode:React.FC<CustomizedNodeProps> = (props) => {
    const {droppable, id, data, text} = props.node;
    const indent = props.depth * 24;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(id);
    };

    const handleSelect = () => props.onSelect(props.node);
    const handleContextMenu = (node: NodeModel<Object3D>) => (event: React.MouseEvent) => props.handleContextMenu(event, node);

    let icon: React.ElementType<SvgIconProps>;
    switch (data!.type) {
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

    /*<Box sx={{display: 'flex', alignItems: 'center', p: 0.5, pr: 0}}>
            <Box component={icon} color="inherit" sx={{mr: 1}}/>
            <Typography variant="body2" sx={{fontWeight: 'inherit', flexGrow: 1}}>
                {text}
            </Typography>
            <Typography variant="caption" color="inherit">
                {props.text}
            </Typography>
        </Box>*/
    return <div
            className={`tree-node ${styles.root} ${props.isSelected ? styles.isSelected : ""}`}
            style={{ paddingInlineStart: indent }}
            onClick={handleSelect}
            onContextMenu={handleContextMenu(props.node)}
        >
            <div className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""}`}>
                {data!.children.some(child => shouldList(child)) && (
                    <div onClick={handleToggle}>
                        <ArrowRightIcon />
                    </div>
                )}
            </div>
            <Box component={icon} color="inherit"/>
            <div className={styles.labelGridItem}>
                <Typography variant="body2">
                    {text}
                </Typography>
            </div>
        </div>;
}

type Props = {
    droppable: boolean;
};

export const TypeIcon: React.FC<Props> = (props) => {
    /*if (props.droppable) {
        return <FolderIcon />;
    }

    switch (props.fileType) {
        case "image": return <ImageIcon />;
        case "csv": return <ListAltIcon />;
        case "text": return <DescriptionIcon />;
        default: return null;
    }*/
    return <CollectionsIcon />;
};

type PreviewProps = {
    monitorProps: DragLayerMonitorProps<Object3D>;
};

export const CustomDragPreview: React.FC<PreviewProps> = (props) => {
    const item = props.monitorProps.item;

    return (
        <div >
            <div >
                <TypeIcon
                    droppable={item.droppable || false}
                />
            </div>
            <div >{item.text}</div>
        </div>
    );
};

type PlaceholderProps = {
    node: NodeModel;
    depth: number;
}

export const Placeholder: React.FC<PlaceholderProps> = (props) => {
    const left = props.depth * 24;
    return (
        <div className={styles.placeholderRoot} style={{left}}></div>
    )
};

const shouldList = (child: Object3D) => {
    return child.type !== 'BatchedParticleRenderer' && child.type !== 'AxesHelper' && child.type !== 'BoxHelper'
        && child.name !== 'TransformControls' && child.userData.listable !== false;
}

export const SceneGraphDraggableView: React.FC<SceneGraphDraggableViewProps> = (props) => {


    const context = useContext(ApplicationContext)!;


    const renderObject = useCallback((object3d: Object3D, list: NodeModel[]) => {
        if (shouldList(object3d) &&  object3d !== context.scene) {
            list.push({
                id: object3d.uuid,
                parent: object3d.parent!.uuid,
                text: getObjectName(object3d),
                droppable: true,
                data: object3d
            });
        }
        for (const child of object3d.children) {
            if (shouldList(child)) {
                renderObject(child, list);
            }
        }
    }, []);

    const treeData: NodeModel<Object3D>[] = [];
    renderObject(context.scene, treeData);

    const handleDrop = (newTreeData: NodeModel<Object3D>[], options: DropOptions<Object3D>) => {
        let dropTarget;
        if (options.dropTargetId === context.scene.uuid) {
            dropTarget = context.scene;
        } else if (options.dropTarget) {
            dropTarget = options.dropTarget.data;
        }
        if (dropTarget && options.dragSource) {
            const dragSourceObj = options.dragSource.data!;
            dropTarget.attach(dragSourceObj);
            if (options.destinationIndex) {
                //console.log(options.destinationIndex);
                let currentIndex = 0;
                for (let i = 0 ; i < dropTarget.children.length; i++) {
                    if (currentIndex === options.destinationIndex) {
                        dropTarget.children.splice(i, 0, dragSourceObj);
                        dropTarget.children.pop();
                        break;
                    }
                    if (shouldList(dropTarget.children[i])) {
                        currentIndex ++;
                    }
                }
            }
            context.updateProperties();
        }
        //console.log(options);
        //treeData
    };

    const [selectedNode, setSelectedNode] = useState<NodeModel<Object3D> | null>(null);
    const handleSelect = (node: NodeModel<Object3D>) =>  {
            //const index = parseInt(nodeIds);
        let selected;
        context.scene.traverse((obj) => {
            if (obj.uuid === node.id) selected = obj;
        });
        //const [object3d, ] = countIndex(index, context.scene);
        if (selected) {
            context.actions.selectObject3d(selected);
        }
        setSelectedNode(node);
    }

    const [contextObject, setContextObject] = React.useState<Object3D | null>(null);

    const [contextMenu, setContextMenu] = React.useState<{
        mouseX: number;
        mouseY: number;
    } | null>(null);

    const handleContextMenu = (event: React.MouseEvent, node: NodeModel<Object3D>) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX - 2,
                    mouseY: event.clientY - 4,
                }
                : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
                  // Other native context menus might behave different.
                  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
                null,
        );
        setContextObject(node.data!);
    };

    return <Box sx={{height: 270, flexGrow: 1, overflow: 'auto'}}>
        <Typography variant={"h6"}> Outline </Typography>
        <Tree
            tree={treeData}
            rootId={context.scene.uuid}
            onDrop={handleDrop}
            render={(node, { depth, isOpen, onToggle }) => (
                <CustomizedNode node={node}
                                depth={depth}
                                isOpen={isOpen}
                                isSelected={node.id === selectedNode?.id}
                                onToggle={onToggle}
                                onSelect={handleSelect}
                                handleContextMenu={handleContextMenu}/>
            )}
            dragPreviewRender={(monitorProps) => (
                <CustomDragPreview monitorProps={monitorProps} />
            )}
            classes={{
                root: styles.treeRoot,
                draggingSource: styles.draggingSource,
                placeholder: styles.placeholderContainer
            }}
            sort={false}
            insertDroppableFirst={false}
            canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                if (dragSource?.parent === dropTargetId) {
                    return true;
                }
            }}
            dropTargetOffset={10}
            placeholderRender={(node, { depth }) => (
                <Placeholder node={node} depth={depth} />
            )}
        />
        <SceneGraphContextMenu open={contextMenu != null}
                               close={() => {setContextMenu(null)}}
                               mouseX={contextMenu ? contextMenu.mouseX : 0}
                               mouseY={contextMenu ? contextMenu.mouseY : 0}
                               object3d={contextObject}/>
    </Box>;
}


