import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/quiz/select', label: 'Take Quiz', icon: '📝' },
    { to: '/performance', label: 'Performance', icon: '📈' },
    { to: '/recommendations', label: 'Recommendations', icon: '💡' },
    { to: '/resources', label: 'Resources', icon: '📚' },
    { to: '/history', label: 'Quiz History', icon: '🕐' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/students', label: 'Students', icon: '👥' },
    { to: '/admin/questions', label: 'Questions', icon: '❓' },
    { to: '/admin/topics', label: 'Topics', icon: '📚' },
    { to: '/admin/resources', label: 'Resources', icon: '🔗' },
    { to: '/admin/attempts', label: 'Quiz Attempts', icon: '📝' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 min-h-[calc(100vh-4rem)] p-4 hidden md:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
            end={link.to === '/admin' || link.to === '/dashboard'}
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
