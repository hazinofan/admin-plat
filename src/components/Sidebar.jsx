import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <aside
      className={`h-screen bg-white border-r dark:bg-gray-900 dark:border-gray-700 transition-all duration-300 ${isExpanded ? "w-64" : "w-20"
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
        {/* MANIPULATION */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${isExpanded ? "block" : "hidden"
              }`}
          >
            MANIPULATIONS
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/dashboard"
          >
            <i className="pi pi-chart-line text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Dashboard</span>}
          </Link>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/products"
          >
            <i className="pi pi-cart-arrow-down text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Products</span>}
          </Link>
          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/blogs"
          >
            <i className="pi pi-file-edit text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Blogs</span>}
          </Link>
          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/orders"
          >
            <i className="pi pi-credit-card text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Order Validation</span>}
          </Link>
        </div>

        {/* DATA */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${isExpanded ? "block" : "hidden"
              }`}
          >
            manage resources
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/users"
          >
            <i className="pi pi-user text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium"> Platinium Users</span>}
          </Link>
          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/tickets"
          >
            <i className="pi pi-ticket text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium"> Support Tickets</span>}
          </Link>
        </div>

        {/* Customization */}
        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${isExpanded ? "block" : "hidden"
              }`}
          >
            Admin Commande prompt
          </label>

          <Link
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            to="/cmd"
          >
            <i className="pi pi-desktop text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium">Commande Prompt</span>}
          </Link>
        </div>

        <div className="space-y-3">
          <label
            className={`px-3 text-xs text-gray-500 uppercase dark:text-gray-400 ${isExpanded ? "block" : "hidden"
              }`}
          >
            Actions
          </label>

          <a
            className={`flex items-center px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            href="https://platinium-iptv.com"  // ✅ External URL
            target="_blank"  // ✅ Open in new tab
            rel="noopener noreferrer"  // ✅ Security best practice
          >
            <i className="pi pi-eye text-lg"></i>
            {isExpanded && <span className="ml-2 text-sm font-medium"> VISIT PLATINIUM WEBSITE</span>}
          </a>


          <a
            className={`flex items-center  px-3 py-2 text-gray-600 transition-all duration-300 rounded-lg hover:bg-red-100 dark:hover:bg-gray-800 hover:text-gray-700 ${isExpanded ? "" : "justify-center"
              }`}
            onClick={logout}
          >
            <i className="pi pi-sign-out text-red-500 text-lg"></i>
            {isExpanded && <span className="ml-2 text-red-500 text-sm font-medium">LOG OUT</span>}
          </a>


        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
