import { X, Mail, MessageCircle, Search } from "lucide-react";

interface ActionPanelProps {
  onClose: () => void;
  onSelectAction: (type: "email" | "telegram") => void;
}

export function ActionPanel({ onClose, onSelectAction }: ActionPanelProps) {
  const actions = [
    {
      id: "email",
      title: "Send Email",
      description: "Send an email notification",
      icon: Mail,
      category: "Communication",
    },
    {
      id: "telegram",
      title: "Send Telegram Message",
      description: "Send a message via Telegram",
      icon: MessageCircle,
      category: "Communication",
    },
  ];

  return (
    <div className="absolute right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 z-50">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            What happens next?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search nodes..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => onSelectAction(action.id as "email" | "telegram")}
              className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-400 transition-colors">
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-sm">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
