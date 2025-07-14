import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  useReactFlow,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import nodeTypes from './NodeTypes';
import { getAllAncestors, getAllDescendants, processGraphData } from '../utils/graphUtils';
import data from '../data/sampleGraph.json';

function CloudGraphInner() {
  const { nodes: initialNodes, edges: initialEdges } = processGraphData(data);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(n => ({ ...n, collapsed: false })));
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [filter, setFilter] = useState('all');
  const [zoomDelta, setZoomDelta] = useState(null);
  const { setViewport, getZoom } = useReactFlow();

  const handleNodeClick = useCallback((_, node) => {
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const descendants = getAllDescendants(node.id, nodeMap);
    const isCollapsed = !nodeMap[descendants[0]] || !nodeMap[descendants[0]].collapsed;

    setNodes(nds =>
      nds.map(n =>
        descendants.includes(n.id) ? { ...n, collapsed: isCollapsed } : n
      )
    );

    setZoomDelta(isCollapsed ? 1.15 : 0.85);
  }, [nodes]);

  useEffect(() => {
    if (zoomDelta !== null) {
      const currentZoom = getZoom();
      setViewport({ x: 0, y: 0, zoom: currentZoom * zoomDelta }, { duration: 500 });
      setZoomDelta(null);
    }
  }, [zoomDelta, getZoom, setViewport]);

  const filtered = useMemo(() => {
    const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));
    const visibleIds = new Set();

    nodes.forEach(n => {
      if (!n.collapsed) visibleIds.add(n.id);
    });

    if (filter !== 'all') {
      const matched = new Set();
      nodes.forEach(n => {
        const { alerts, misconfigs } = n.data;
        const matches = (filter === 'alerts' && alerts > 0) || (filter === 'misconfigurations' && misconfigs > 0);
        if (matches) {
          matched.add(n.id);
          getAllAncestors(n.id, edges).forEach(a => matched.add(a));
        }
      });
      visibleIds.forEach(id => {
        if (!matched.has(id)) visibleIds.delete(id);
      });
    }

    const filteredNodes = nodes.map(n => ({ ...n, hidden: !visibleIds.has(n.id) }));
    const filteredEdges = edges.map(e => ({
      ...e,
      type: 'step',
      markerEnd: {
        type: MarkerType.ArrowClosed
      },
      hidden: !visibleIds.has(e.source) || !visibleIds.has(e.target)
    }));

    return { filteredNodes, filteredEdges };
  }, [nodes, edges, filter]);

  return (
    <div className="h-[90vh] w-[95vw] flex flex-col gap-4">
      <div className="flex justify-center gap-4 p-3 bg-base-200 rounded-xl shadow-md">
        {['all', 'alerts', 'misconfigurations'].map(type => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full transition-all text-sm font-semibold shadow ${
              filter === type ? 'bg-white text-gray-700 border border-gray-300' : 'bg-primary text-gray-700 hover:bg-white'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <ReactFlow
        nodes={filtered.filteredNodes}
        edges={filtered.filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
        onInit={(reactFlowInstance) => {
          reactFlowInstance.fitView({ padding: 0.2 });
        }}
        defaultEdgeOptions={{
          type: 'step',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }}
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function CloudGraph() {
  return (
    <ReactFlowProvider>
      <CloudGraphInner />
    </ReactFlowProvider>
  );
}
