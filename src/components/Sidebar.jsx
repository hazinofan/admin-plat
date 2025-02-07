import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside
      className={`h-screen bg-white border-r dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      {/* Sidebar Header */}
      <div className={`flex items-center justify-between p-5 ${!isExpanded ? "justify-self-center" : ""}`}>
        {isExpanded && (
          <Link to="/">
            <img
              className="w-auto h-12"
              src="/assets/favicon.png"
              alt="Logo"
            />
          </Link>
        )}

        {/* Toggle Button */}
        <button
          className="text-gray-600 dark:text-gray-200"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className="pi pi-bars text-xl"></i>
        </button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-6 space-y-3 pl-3">
        {/* Analytics */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${
              isExpanded ? "block" : "hidden"
            }`}
          >
            Analytics
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${
              isExpanded ? "" : "justify-center"
            }`}
            to="/dashboard"
          >
            <i className="pi pi-chart-line text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Dashboard</span>}
          </Link>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${
              isExpanded ? "" : "justify-center"
            }`}
            to="/products"
          >
            <i className="pi pi-cart-arrow-down text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Products</span>}
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${
              isExpanded ? "block" : "hidden"
            }`}
          >
            Content
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${
              isExpanded ? "" : "justify-center"
            }`}
            to="/guides"
          >
            <i className="pi pi-book text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Guides</span>}
          </Link>
        </div>

        {/* Customization */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${
              isExpanded ? "block" : "hidden"
            }`}
          >
            Customization
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${
              isExpanded ? "" : "justify-center"
            }`}
            to="/themes"
          >
            <i className="pi pi-palette text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Themes</span>}
          </Link>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${
              isExpanded ? "" : "justify-center"
            }`}
            to="/settings"
          >
            <i className="pi pi-cog text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Settings</span>}
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
