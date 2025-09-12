// src/components/WorkflowNode.tsx
import type React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Plus, Trash2 } from "lucide-react";

interface WorkflowNodeData {
  label: string;
  icon: string;
  type: "trigger" | "action";
  onAddNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

export function WorkflowNode({ data, id }: NodeProps<WorkflowNodeData>) {
  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onAddNode?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDeleteNode?.(id);
  };

  return (
    <div className="relative bg-gray-700 border-2 border-gray-600 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white text-lg">
            {data.icon}
          </div>
          <div>
            <h3 className="text-white font-medium">{data.label}</h3>
            <p className="text-gray-400 text-sm capitalize">{data.type}</p>
          </div>
        </div>

        {/* Delete button */}
        <button
          className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 transition-colors text-white"
          onClick={handleDeleteClick}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Input handle */}
      {data.type === "action" && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
        />
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-gray-400 border-2 border-gray-600"
      />

      {/* Plus button */}
      {data.onAddNode && (
        <button
          className="absolute -right-6 top-1/2 -translate-y-1/2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 transition-colors z-10 shadow-md"
          onClick={handlePlusClick}
          type="button"
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  );
}
