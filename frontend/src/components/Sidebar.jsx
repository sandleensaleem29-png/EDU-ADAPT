import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Lightbulb,
  BookOpen,
  History,
  Users,
  HelpCircle,
  FolderOpen,
  FileText,
} from "lucide-react";

const Sidebar = ({ role }) => {
  const studentLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/quiz/select",
      label: "Take Quiz",
      icon: ClipboardList,
    },
    {
      to: "/performance",
      label: "Performance",
      icon: BarChart3,
    },
    {
      to: "/recommendations",
      label: "Recommendations",
      icon: Lightbulb,
    },
    {
      to: "/resources",
      label: "Resources",
      icon: BookOpen,
    },
    {
      to: "/history",
      label: "Quiz History",
      icon: History,
    },
  ];

  const adminLinks = [
    {
      to: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      to: "/admin/students",
      label: "Students",
      icon: Users,
    },
    {
      to: "/admin/questions",
      label: "Questions",
      icon: HelpCircle,
    },
    {
      to: "/admin/topics",
      label: "Topics",
      icon: BookOpen,
    },
    {
      to: "/admin/resources",
      label: "Resources",
      icon: FolderOpen,
    },
    {
      to: "/admin/attempts",
      label: "Quiz Attempts",
      icon: FileText,
    },
  ];

  const links = role === "admin" ? adminLinks : studentLinks;

  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r border-gray-800 bg-slate-900 p-4 md:block">
      {/* Sidebar Header */}
      <div className="mb-6 px-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {role === "admin" ? "Administration" : "Learning"}
        </p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin" || link.to === "/dashboard"}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-md shadow-primary-900/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.5 : 2}
                    className="shrink-0"
                  />

                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Info */}
      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600/20 text-primary-400">
            <Lightbulb size={16} />
          </div>

          <span className="text-sm font-semibold text-white">
            Keep Learning
          </span>
        </div>

        <p className="text-xs leading-5 text-slate-400">
          Practice regularly to improve your performance.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
