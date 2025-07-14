import { MarkerType } from 'reactflow';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

dagreGraph.setGraph({ rankdir: 'LR' });

export function processGraphData(raw) {
  const nodeWidth = 800;
  const nodeHeight = 250;

  const nodes = raw.nodes.map((n) => {
    dagreGraph.setNode(n.id, { width: nodeWidth, height: nodeHeight });
    return {
      id: n.id,
      data: n,
      type: 'custom',
      position: { x: 0, y: 0 },
    };
  });

  const edges = raw.edges.map((e) => {
    dagreGraph.setEdge(e.source, e.target);
    return {
      id: `${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      type: 'step',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
  });

  dagre.layout(dagreGraph);

  const positionedNodes = nodes.map((node) => {
    const nodeWithPos = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPos.x - nodeWidth / 2,
        y: nodeWithPos.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: positionedNodes, edges };
}

export function getAllDescendants(nodeId, nodeMap) {
  const descendants = [];
  const stack = [nodeId];
  while (stack.length > 0) {
    const current = stack.pop();
    const children = nodeMap[current]?.data?.children || [];
    descendants.push(...children);
    stack.push(...children);
  }
  return descendants;
}

export function getAllAncestors(nodeId, edges, visited = new Set()) {
  const directParents = edges.filter(e => e.target === nodeId).map(e => e.source);
  const allAncestors = [...directParents];
  directParents.forEach(parentId => {
    if (!visited.has(parentId)) {
      visited.add(parentId);
      allAncestors.push(...getAllAncestors(parentId, edges, visited));
    }
  });
  return allAncestors;
}
