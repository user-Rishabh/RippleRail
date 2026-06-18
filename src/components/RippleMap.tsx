import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import { motion } from 'framer-motion';
import 'reactflow/dist/style.css';
import { Network } from 'lucide-react';

// Custom Node Component
function CustomStationNode({ data }: { data: any }) {
  const isHighRisk = data.status === 'high-delay';
  
  let statusClasses = "bg-[#1D9E75]/10 border-[#1D9E75]/50 text-[#1D9E75]";
  if (data.status === 'slight-delay') {
    statusClasses = "bg-amber-500/10 border-amber-500/50 text-amber-400";
  } else if (data.status === 'high-delay') {
    statusClasses = "bg-red-500/10 border-red-500/50 text-red-400";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        boxShadow: isHighRisk 
          ? [
              "0 0 0px rgba(239, 68, 68, 0)",
              "0 0 14px rgba(239, 68, 68, 0.45)",
              "0 0 0px rgba(239, 68, 68, 0)"
            ]
          : "none"
      }}
      transition={{ 
        opacity: { duration: 0.4, delay: data.index * 0.15 },
        scale: { duration: 0.4, delay: data.index * 0.15, type: 'spring' },
        boxShadow: isHighRisk 
          ? {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          : {}
      }}
      className={`px-4 py-3 rounded-xl border ${statusClasses} shadow-lg relative min-w-[140px] text-center backdrop-blur-sm`}
    >
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-700 !border-slate-500" />
      
      <div className="font-bold text-sm leading-tight text-white">{data.stationName}</div>
      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{data.trainNumber}</div>
      <div className="text-xs font-semibold mt-1.5">{data.delayText}</div>
      
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-slate-700 !border-slate-500" />
    </motion.div>
  );
}

const nodeTypes = {
  station: CustomStationNode,
};

const initialNodes = [
  { 
    id: '1', 
    type: 'station',
    position: { x: 50, y: 150 }, 
    data: { 
      stationName: 'Mumbai Central', 
      trainNumber: '12951 Rajdhani', 
      delayMinutes: 0, 
      delayText: '0m delay', 
      status: 'on-time', 
      index: 0 
    } 
  },
  { 
    id: '2', 
    type: 'station',
    position: { x: 260, y: 150 }, 
    data: { 
      stationName: 'Nashik Road', 
      trainNumber: '12951 Rajdhani', 
      delayMinutes: 15, 
      delayText: '+15m delay', 
      status: 'slight-delay', 
      index: 1 
    } 
  },
  { 
    id: '3', 
    type: 'station',
    position: { x: 470, y: 150 }, 
    data: { 
      stationName: 'Bhusaval Jn', 
      trainNumber: '12951 Rajdhani', 
      delayMinutes: 45, 
      delayText: '+45m delay', 
      status: 'slight-delay', 
      index: 2 
    } 
  },
  { 
    id: '4', 
    type: 'station',
    position: { x: 680, y: 150 }, 
    data: { 
      stationName: 'Bhopal Jn', 
      trainNumber: '12951 Rajdhani', 
      delayMinutes: 75, 
      delayText: '+75m delay', 
      status: 'high-delay', 
      index: 3 
    } 
  },
  { 
    id: '5', 
    type: 'station',
    position: { x: 890, y: 150 }, 
    data: { 
      stationName: 'Hazrat Nizamuddin', 
      trainNumber: '12951 Rajdhani', 
      delayMinutes: 90, 
      delayText: '+90m delay', 
      status: 'high-delay', 
      index: 4 
    } 
  },
];

const initialEdges = [
  { 
    id: 'e1-2', 
    source: '1', 
    target: '2', 
    animated: true, 
    style: { stroke: '#1D9E75', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#1D9E75' },
    label: '+15 mins',
    labelStyle: { fill: '#1D9E75', fontWeight: 600, fontSize: 10 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#0D0B1A', fillOpacity: 0.85 }
  },
  { 
    id: 'e2-3', 
    source: '2', 
    target: '3', 
    animated: true, 
    style: { stroke: '#f59e0b', strokeWidth: 2 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
    label: '+30 mins',
    labelStyle: { fill: '#fbbf24', fontWeight: 600, fontSize: 10 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#0D0B1A', fillOpacity: 0.85 }
  },
  { 
    id: 'e3-4', 
    source: '3', 
    target: '4', 
    animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 3 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
    label: '+30 mins',
    labelStyle: { fill: '#f87171', fontWeight: 600, fontSize: 10 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#0D0B1A', fillOpacity: 0.85 }
  },
  { 
    id: 'e4-5', 
    source: '4', 
    target: '5', 
    animated: true, 
    style: { stroke: '#ef4444', strokeWidth: 3 }, 
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
    label: '+15 mins',
    labelStyle: { fill: '#f87171', fontWeight: 600, fontSize: 10 },
    labelBgPadding: [6, 4] as [number, number],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#0D0B1A', fillOpacity: 0.85 }
  },
];

export default function RippleMap() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="bg-card border border-border rounded-xl p-6 h-[500px] flex flex-col shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <Network className="w-6 h-6 text-[#7F77DD]" />
          <div>
            <h2 className="text-xl font-bold leading-tight">Delay Ripple Visualization</h2>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1D9E75] shadow-[0_0_8px_rgba(29,158,117,0.5)]"></span>
                <span>On Time</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                <span>Delayed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse"></span>
                <span>High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {nodes.length === 0 ? (
        <div className="flex-1 w-full rounded-lg border border-border bg-background/50 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-3"
          >
            <Network className="w-12 h-12 text-slate-500/60" />
            <p className="text-slate-500 font-medium">Enter train details above to visualize the ripple effect</p>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 w-full rounded-lg overflow-hidden border border-border bg-background/50 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-right"
          >
            <Background color="rgba(127, 119, 221, 0.15)" gap={16} />
            <Controls className="bg-[#13102A] border border-[#FFFFFF12] rounded-xl p-1 text-white fill-slate-300 [&_button]:bg-transparent [&_button]:border-none [&_button]:text-white [&_button]:hover:bg-[#0D0B1A]" />
          </ReactFlow>

          {/* Selected Node Details Tooltip Overlay */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="absolute bottom-4 left-4 z-20 bg-[#13102A] border border-[#FFFFFF12] p-4 rounded-xl shadow-xl max-w-xs text-white"
            >
              <div className="flex justify-between items-start mb-2 gap-4">
                <h4 className="font-bold text-sm">{selectedNode.data.stationName}</h4>
                <button 
                  onClick={() => setSelectedNode(null)} 
                  className="text-slate-400 hover:text-white transition-colors text-base font-bold px-1"
                >
                  &times;
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-slate-300">
                <div>Train: <span className="font-semibold text-white">{selectedNode.data.trainNumber}</span></div>
                <div>Expected Delay: <span className="font-semibold text-orange-400">{selectedNode.data.delayText}</span></div>
                <div className="flex items-center gap-1.5 mt-2">
                  Risk: 
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedNode.data.status === 'on-time' 
                      ? 'bg-[#1D9E75]/20 text-[#1D9E75] border border-[#1D9E75]/30' 
                      : selectedNode.data.status === 'slight-delay'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {selectedNode.data.status === 'on-time' ? 'SAFE' : selectedNode.data.status === 'slight-delay' ? 'MODERATE' : 'HIGH RISK'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
