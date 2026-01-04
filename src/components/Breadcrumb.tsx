import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  const location = useLocation();

  // Generate breadcrumb items from path if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathnames = location.pathname.split("/").filter((x) => x);

    return pathnames.map((name, index) => {
      const path = `/${pathnames.slice(0, index + 1).join("/")}`;
      const label =
        name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");

      return {
        label,
        path: index < pathnames.length - 1 ? path : undefined,
      };
    });
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto">
      <Link
        to="/dashboard"
        className="flex items-center hover:text-downy transition-colors flex-shrink-0"
      >
        <Home className="w-4 h-4" />
        <span className="ml-1 hidden sm:inline">Home</span>
      </Link>

      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center flex-shrink-0">
          <ChevronRight className="w-4 h-4 mx-1 sm:mx-2 text-gray-400" />
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-downy transition-colors truncate max-w-[100px] sm:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium truncate max-w-[100px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
