import ReactFlow, {addEdge, Background, Controls, MiniMap, Position, useEdgesState, useNodesState} from "reactflow";
import React, {useCallback, useMemo} from "react";
import {NodeGraph} from "three.quarks";

import 'reactflow/dist/style.css';
//import './overview.css';

/*
const nodeTypes = {
    custom: CustomNode,
};*/

const minimapStyle = {
    height: 120,
};

const onInit = (reactFlowInstance: any) => console.log('flow loaded:', reactFlowInstance);

interface NodeGraphEditorProps {
    nodeGraph: NodeGraph;
}

const NodeGraphEditor: React.FC<NodeGraphEditorProps> = (props) => {
    const initialNodes = useMemo(() => {
        return props.nodeGraph.nodes.map(node => {
            return {
                id: node.id,
                //type: 'input',
                data: {
                    label: node.type.name,
                },
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
                type: 'bezier',
                sourceHandle: 'handle-' + wire.inputIndex,
                targetHandle: 'handle-' + wire.outputIndex,
                data: {
                    selectIndex: 0,
                },
            };
        });
    }, [props.nodeGraph]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    // we are using a bit of a shortcut here to adjust the edge type
    // this could also be done with a custom edge for example
    /*const edgesWithUpdatedTypes = edges.map((edge) => {
        if (edge.sourceHandle) {
            const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle];
            edge.type = edgeType;
        }

        return edge;
    });*/

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            fitView
            attributionPosition="top-right"
            //nodeTypes={nodeTypes}
        >
            <MiniMap style={minimapStyle} zoomable pannable />
            <Controls />
            <Background color="#aaa" gap={16} />
        </ReactFlow>
    );
};

export default NodeGraphEditor;
