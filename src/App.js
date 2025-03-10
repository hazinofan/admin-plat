import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "quill/dist/quill.snow.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import AddBlogs from "./pages/AddBlogs";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Terminal from "./pages/Terminal";
import Tickets from "./pages/Tickets";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/add-blogs" element={<AddBlogs />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/users" element={<Users />} />
        <Route path="/cmd" element={<Terminal />} />
        <Route path="/tickets" element={<Tickets />} />
      </Routes>
    </Router>
  );
}

export default App;
