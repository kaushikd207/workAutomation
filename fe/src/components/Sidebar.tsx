import {
  Home,
  User,
  FolderPlus,
  Settings,
  FileText,
  BarChart3,
  HelpCircle,
  Bell,
  Star,
} from "lucide-react";

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: "Overview", active: false },
    { icon: User, label: "Personal", active: true },
  ];

  const projectItems = [{ icon: FolderPlus, label: "Add project" }];

  const bottomItems = [
    { icon: Settings, label: "Admin Panel" },
    { icon: FileText, label: "Templates" },
    { icon: BarChart3, label: "Variables" },
    { icon: BarChart3, label: "Insights" },
    { icon: HelpCircle, label: "Help" },
    { icon: Bell, label: "What's New" },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">n8n</span>
          </div>
          <span className="text-white font-semibold">n8n</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  item.active
                    ? "bg-gray-700 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-3">
            Projects
          </h3>
          {projectItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-700">
        <nav className="space-y-1">
          {bottomItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.label}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">KD</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium">Kaushik Das</p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <Star className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
