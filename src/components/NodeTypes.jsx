import React, { useState } from 'react';
import { Cloud, Server, Database, Network } from 'lucide-react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data }) {
  const { type, label, alerts, misconfigs } = data;
  const [hovered, setHovered] = useState(false);

  const icon =
    type === 'cloud' ? <Cloud className="w-10 h-10 text-gray-800" /> :
    type === 'aws' ? <Server className="w-10 h-10 text-gray-800" /> :
    type === 'gcp' ? <Network className="w-10 h-10 text-gray-800" /> :
    type === 'saas' ? <Network className="w-10 h-10 text-gray-800" /> :
    <Database className="w-10 h-10 text-gray-800" />;

  const severityColor = alerts > 100
    ? 'bg-red-300 border-red-700'
    : alerts > 50
    ? 'bg-yellow-200 border-yellow-600'
    : 'bg-green-200 border-green-600';

  return (
    <div
      className="relative rounded-full w-36 h-36"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`absolute inset-0 rounded-full w-full h-full flex flex-col justify-center items-center border-2 ${severityColor} transition-shadow hover:shadow-2xl`}
        style={{ backgroundClip: 'padding-box' }}
      >
        <Handle type="target" position={Position.Left} className="!bg-gray-600" />
        <div className="flex flex-col justify-center items-center">
          {icon}
          <div className="text-xl font-semibold text-center leading-tight px-2 mt-1 text-gray-900">
            {label}
          </div>
        </div>
        <Handle type="source" position={Position.Right} className="!bg-gray-600" />

        {hovered && (
          <div className="absolute z-50 px-6 py-4 text-lg bg-white border border-gray-400 rounded-xl shadow-xl -top-40 w-max whitespace-nowrap text-gray-900">
            <div className="font-bold text-xl mb-2">{label}</div>
            <div className="text-lg">🔔 Alerts: <span className="font-semibold">{alerts}</span></div>
            <div className="text-lg">⚙️ Misconfigs: <span className="font-semibold">{misconfigs}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default {
  custom: CustomNode
};
