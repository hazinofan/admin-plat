import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar - Stays Fixed */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-purple-50" style={{ height: "max-content"}}>
        {children} 
      </div>
    </div>
  );
};

export default Layout;
