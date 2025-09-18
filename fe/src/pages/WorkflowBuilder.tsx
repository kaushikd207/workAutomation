"use client";

import { useCallback, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  type NodeChange,
  type EdgeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { Sidebar } from "../components/Sidebar";
import { ActionPanel } from "../components/ActionPanel";
import { Plus } from "lucide-react";

interface WorkflowNodeData {
  label: string;
  icon: string;
  type: "trigger" | "action";
  isStartNode?: boolean;
  onAddNode?: (nodeId: string) => void;
  onDeleteNode?: (nodeId: string) => void;
}

function WorkflowNode({ data, id }: { data: WorkflowNodeData; id: string }) {
  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onAddNode?.(id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    data.onDeleteNode?.(id);
  };

  return (
    <div className="relative bg-gray-700 border-2 border-gray-600 rounded-lg p-4 min-w-[200px] shadow-lg flex flex-col cursor-grab">
      {/* Input Handle (for all except start node) */}
      {!data.isStartNode && (
        <Handle
          type="target"
          position={Position.Left}
          id="target"
          className="bg-gray-400"
        />
      )}

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

        {!data.isStartNode && data.onDeleteNode && (
          <button
            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-400 text-white text-sm"
            onClick={handleDeleteClick}
          >
            ✕
          </button>
        )}
      </div>

      {/* Plus button */}
      {data.onAddNode && (
        <button
          className="absolute -right-6 bottom-1/2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center hover:bg-teal-400 text-white shadow-md"
          onClick={handlePlusClick}
        >
          <Plus className="w-3 h-3 text-white" />
        </button>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="bg-gray-400"
      />
    </div>
  );
}

export default function WorkflowBuilder() {
  const [workflowId, setWorkflowId] = useState<number | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [nodes, setNodes] = useState<Node<WorkflowNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/workflow")
      .then((res) => res.json())
      .then((data) => {
        let safeNodes: Node<WorkflowNodeData>[] = [];
        let safeEdges: Edge[] = [];

        if (data.length) {
          const wf = data[0];
          setWorkflowId(wf.id);
          setWorkflowTitle(wf.title || "");

          safeNodes = (wf.nodes || []).map((node: any, index: number) => ({
            ...node,
            id: node.id || `${Date.now()}-${Math.random()}`,
            type: "customNode",
            data: {
              ...node.data,
              isStartNode: index === 0,
              label: index === 0 ? wf.title || "Start" : node.data.label,
              onAddNode: handleAddNode,
              onDeleteNode: handleDeleteNode,
            },
          }));

          safeEdges = (wf.connections || []).map((edge: any, idx: number) => ({
            ...edge,
            id: edge.id || `edge-${idx}-${edge.source}-${edge.target}`,
          }));
        } else {
          const startNode: Node<WorkflowNodeData> = {
            id: "start",
            type: "customNode",
            position: { x: 300, y: 200 },
            data: {
              label: workflowTitle || "Start",
              icon: "🚀",
              type: "trigger",
              isStartNode: true,
              onAddNode: handleAddNode,
            },
          };
          safeNodes = [startNode];
        }

        setNodes(safeNodes);
        setEdges(safeEdges);
      });
  }, []);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) =>
        node.data.isStartNode
          ? { ...node, data: { ...node.data, label: workflowTitle || "Start" } }
          : node
      )
    );
  }, [workflowTitle]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );
  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const handleAddNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowActionPanel(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  };

  const handleSelectAction = (type: "email" | "telegram" | "AI_Agent") => {
    if (!selectedNodeId) return;

    const newNodeId = `${Date.now()}`;
    const newNode: Node<WorkflowNodeData> = {
      id: newNodeId,
      type: "customNode",
      position: { x: Math.random() * 400 + 200, y: Math.random() * 200 + 100 },

      data: {
        label:
          type === "email"
            ? "Send Email"
            : type === "telegram"
            ? "Send Telegram Message"
            : "AI Agent",
        icon: type === "email" ? "📧" : "💬",
        type: "action",
        onAddNode: handleAddNode,
        onDeleteNode: handleDeleteNode,
      },
    };

    setNodes((nds) => [...nds, newNode]);

    setEdges((eds) =>
      addEdge(
        {
          id: `${selectedNodeId}-${newNodeId}`,
          source: selectedNodeId,
          sourceHandle: "source",
          target: newNodeId,
          targetHandle: "target",
          type: "smoothstep",
        },
        eds
      )
    );

    setShowActionPanel(false);
    setSelectedNodeId(null);
  };

  const saveWorkflow = async () => {
    if (!workflowId) return alert("No workflow loaded");
    try {
      await fetch(`http://localhost:4000/workflow/${workflowId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: workflowTitle,
          enabled: true,
          nodes,
          connections: edges,
        }),
      });
      alert("Workflow saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save workflow");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar />
      <div className="flex-1 relative">
        <input
          type="text"
          value={workflowTitle}
          onChange={(e) => setWorkflowTitle(e.target.value)}
          placeholder="Workflow Title"
          className="absolute top-4 left-4 px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 z-10"
        />

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={{ customNode: WorkflowNode }}
        >
          <Background />
          <Controls />
        </ReactFlow>

        <button
          onClick={saveWorkflow}
          className="absolute bottom-4 right-4 bg-teal-500 hover:bg-teal-400 px-4 py-2 rounded-lg shadow-md z-10"
        >
          Save Workflow
        </button>

        {showActionPanel && (
          <ActionPanel
            onClose={() => setShowActionPanel(false)}
            onSelectAction={handleSelectAction}
          />
        )}
      </div>
    </div>
  );
}
