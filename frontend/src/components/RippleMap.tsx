import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Network } from 'lucide-react';

const initialNodes = [
  { id: '1', position: { x: 50, y: 150 }, data: { label: 'Mumbai (0m)' }, className: 'bg-green-900 border-green-500 text-white rounded-md p-2 w-32 text-center shadow-lg' },
  { id: '2', position: { x: 250, y: 150 }, data: { label: 'Nashik (+15m)' }, className: 'bg-yellow-900 border-yellow-500 text-white rounded-md p-2 w-32 text-center shadow-lg' },
  { id: '3', position: { x: 450, y: 150 }, data: { label: 'Bhusaval (+45m)' }, className: 'bg-orange-900 border-orange-500 text-white rounded-md p-2 w-32 text-center shadow-lg' },
  { id: '4', position: { x: 650, y: 150 }, data: { label: 'Bhopal (+75m)' }, className: 'bg-red-900 border-red-500 text-white rounded-md p-2 w-32 text-center shadow-lg' },
  { id: '5', position: { x: 850, y: 150 }, data: { label: 'Delhi (+90m)' }, className: 'bg-red-950 border-red-600 text-white rounded-md p-2 w-32 text-center shadow-lg' },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#eab308', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#eab308' } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#f97316', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#ef4444', strokeWidth: 3 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' } },
];

export default function RippleMap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-[500px] flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Network className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold">Delay Ripple Visualization</h2>
      </div>
      <div className="flex-1 w-full rounded-lg overflow-hidden border border-border bg-background/50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#333" gap={16} />
          <Controls className="bg-background border-border fill-foreground" />
        </ReactFlow>
      </div>
    </div>
  );
}
