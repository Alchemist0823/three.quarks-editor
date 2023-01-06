import ReactFlow, {
    addEdge,
    Node,
    Edge,
    Connection,
    Background,
    Controls,
    MiniMap,
    Position,
    useEdgesState,
    useNodesState,
    updateEdge
} from "reactflow";
import React, {useCallback, useMemo, useRef} from "react";
import {NodeGraph, Wire} from "three.quarks";
import CustomNode from "./CustomNode";

import 'reactflow/dist/style.css';
import './node-graph.scss';

const nodeTypes = {
    custom: CustomNode,
};

const minimapStyle = {
    height: 120,
};

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

interface NodeGraphEditorProps {
    nodeGraph: NodeGraph;
}

const NodeGraphEditor: React.FC<NodeGraphEditorProps> = (props) => {
    const initialNodes = useMemo(() => {
        return Array.from(props.nodeGraph.allNodes.values()).map(node => {
            return {
                id: node.id,
                type: 'custom',
                data: node,
                position: node.position,

                sourcePosition: Position.Right,
                targetPosition: Position.Left,
            }
        });
    }, [props.nodeGraph]);


    const initialEdges = useMemo(() => {
        return props.nodeGraph.wires.map(wire => {
            return {
                id: 'e' + wire.input.id + '_' + wire.inputIndex + '-' + wire.output.id + '_' + wire.outputIndex,
                source: wire.input.id,
                target: wire.output.id,
                //type: 'bezier',
                sourceHandle: 'handle-s' + wire.inputIndex,
                targetHandle: 'handle-t' + wire.outputIndex,
                data: wire,
            };
        });
    }, [props.nodeGraph]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params: Connection) => {
        props.nodeGraph.addWire(new Wire(props.nodeGraph.getNode(params.source!)!, parseInt(params.sourceHandle!.substring(8)), props.nodeGraph.getNode(params.target!)!, parseInt(params.targetHandle!.substring(8))));
        setEdges((eds) => addEdge(params, eds));
    }, [props.nodeGraph]);

    const onNodeDragStop = useCallback(
        (_, node: Node) => {
            node.data.position.set(node.position.x, node.position.y);
            /*const closeEdge = getClosestEdge(node);
            setEdges((es) => {
                const nextEdges = es.filter((e) => e.className !== 'temp');
                if (closeEdge) {
                    nextEdges.push(closeEdge);
                }
                return nextEdges;
            });*/
        },
        []
    );

    const edgeUpdateSuccessful = useRef(true);

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge: Edge<Wire>, newConnection: Connection) => {
        edgeUpdateSuccessful.current = true;
        const wire = oldEdge.data!;
        props.nodeGraph.deleteWire(wire);
        wire.input = props.nodeGraph.getNode(newConnection.source!)!;
        wire.inputIndex = parseInt(newConnection.sourceHandle!.substring(8));
        wire.output = props.nodeGraph.getNode(newConnection.target!)!;
        wire.outputIndex = parseInt(newConnection.targetHandle!.substring(8));
        props.nodeGraph.addWire(wire);

        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, [props.nodeGraph]);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            props.nodeGraph.deleteWire(edge.data!);
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, [props.nodeGraph]);


    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onNodeDragStop={onNodeDragStop}
            onConnect={onConnect}
            onInit={onInit}
            fitView
            attributionPosition="top-right"
            nodeTypes={nodeTypes}
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
};

export default NodeGraphEditor;
