import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Link, useNavigate } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { deleteBlog, getAllBlogs } from "../core/services/blogs.services";

function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate()
    const toast = useRef(null);

    async function getBlogs() {
        try {
            const data = await getAllBlogs();
            console.log(data);
            setBlogs(data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async (blogId) => {
        try {
            const response = await deleteBlog(blogId);
            console.log("Blog deleted successfully:", response.data);

            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Blog Deleted",
                    detail: "Blog has been successfully deleted.",
                    life: 3000,
                });
            }

            getBlogs();
        } catch (error) {
            console.error("Error deleting Blog:", error.response?.data || error.message);

            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Delete Failed",
                    detail: "An error occurred while deleting the Blog.",
                    life: 3000,
                });
            }
        }
    };


    const truncateText = (text, length = 30) => {
        return text.length > length ? text.substring(0, length) + "..." : text;
    };

    const stripHtmlTags = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    const titleBodyTemplate = (rowData) => {
        return <span>{truncateText(rowData.title, 20)}</span>; // Limit title length
    };

    const contentBodyTemplate = (rowData) => {
        const plainText = stripHtmlTags(rowData.content); // Remove HTML tags
        return <span>{truncateText(plainText, 50)}</span>;
    };


    const imageBodyTemplate = (rowData) => {
        return (
            <Button
                label="View Image"
                className="p-button-link"
                onClick={() => {
                    setImagePreview(rowData.coverImage);
                    setIsDialogVisible(true);
                }}
            />
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2 gap-3">
                <i className="pi pi-pencil" style={{ color: "slateblue" }}></i>
                <i className="pi pi-trash cursor-pointer" onClick={() => { handleDelete(rowData.id) }} style={{ color: "slateblue" }}></i>
                <i className="pi pi-eye cursor-pointer" style={{ color: "slateblue" }}></i>
            </div>
        );
    };

    useEffect(() => {
        getBlogs();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            setIsAuthenticated(true);
        }
    },[navigate])

    return (
        <Layout>
            <div className="flex flex-row justify-between">
                <h2 className="mb-4 text-xl font-semibold">Blogs Page</h2>
                <Link
                    to="/add-blogs"
                    className="px-14 py-2 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm hover:rounded-lg bg-gradient-to-r from-red-500 to-purple-500 text-white text-lg font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all"
                >
                    Add Blog
                </Link>
            </div>

            <DataTable value={blogs} tableStyle={{ minWidth: "50rem", marginTop: "60px" }}>
                <Column field="title" header="Title" body={titleBodyTemplate} />
                <Column field="content" header="Content" body={contentBodyTemplate} />
                <Column field="image" header="Image" body={imageBodyTemplate} />
                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>

            <Dialog
                visible={isDialogVisible}
                onHide={() => setIsDialogVisible(false)}
                header="Image Preview"
                modal
                style={{ width: "50vw" }}
            >
                {imagePreview ? (
                    <img
                        src={imagePreview}
                        alt="Blog Cover"
                        style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                    />
                ) : (
                    <p>No image available</p>
                )}
            </Dialog>
        </Layout>
    );
}

export default Blogs;
