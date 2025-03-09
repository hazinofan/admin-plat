import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "quill/dist/quill.snow.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Blogs from "./pages/Blogs";
import AddBlogs from "./pages/AddBlogs";
import Orders from "./pages/Orders";


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

      </Routes>
    </Router>
  );
}

export default App;
