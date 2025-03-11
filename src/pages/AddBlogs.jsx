import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import Layout from "../components/Layout";
import { saveBlog } from "../core/services/blogs.services";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import environement from "../core/environement";

const AddBlogs = () => {
    const quillRef = useRef(null);
    const toast = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // ✅ Fixed
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useNavigate()
    const navigate = useNavigate()

    const ENGINE = environement.ENGINE_URL

    const linkHandler = (quill) => {
        const url = prompt("Enter the URL (e.g., https://example.com):");

        if (url) {
            let validatedUrl = url.trim();

            // ✅ Ensure the link starts with http:// or https://
            if (!/^https?:\/\//i.test(validatedUrl)) {
                validatedUrl = `https://${validatedUrl}`;
            }

            const range = quill.getSelection();
            quill.format("link", validatedUrl);
            console.log("🔗 Link Inserted:", validatedUrl);
        }
    };


    useEffect(() => {
        const quill = new Quill(quillRef.current, {
            theme: "snow",
            placeholder: "Write your blog...",
            modules: {
                toolbar: {
                    container: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"],
                        ["clean"],
                    ],
                    handlers: {
                        link: () => linkHandler(quill),
                    },
                },
            },
        });
        quill.on("text-change", () => {
            const updatedContent = quill.root.innerHTML.trim();
            setContent(updatedContent);
        });

        return () => quill.off("text-change");
    }, []);

    const onUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(`${ENGINE}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.path) {
                setImageUrl(response.data.path);
                toast.current.show({ severity: "success", summary: "Success", detail: "Image uploaded successfully!" });
                console.log("✅ Image URL Set:", response.data.path);
            } else {
                console.error("Upload response does not contain a valid image URL:", response.data);
            }
        } catch (error) {
            console.error("Error during file upload:", error.response?.data || error.message);
            toast.current.show({ severity: "error", summary: "Error", detail: "Image upload failed!" });
        }
    };

    const handleSaveBlog = async () => {
        console.log("📝 Saving Blog With:", { title, content, imageUrl });

        if (!title.trim() || !content.trim() || !imageUrl) {
            toast.current.show({ severity: "error", summary: "Error", detail: "Title, content, and image are required!" });
            return;
        }

        const payload = {
            title,
            content,
            coverImage: imageUrl,
        };

        console.log("🚀 Sending Blog Payload:", payload);

        setLoading(true);
        try {
            await saveBlog(payload);
            toast.current.show({ severity: "success", summary: "Success", detail: "Blog saved successfully!" });

            setTitle("");
            setContent("");
            setImageUrl(null);

            router('/blogs')
        } catch (error) {
            console.error("❌ Error Saving Blog:", error.response?.data || error.message);
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to save blog!" });
        } finally {
            setLoading(false);
        }
    };

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
            <div className="container mx-auto mt-10 p-5">
                <Toast ref={toast} />
                <h1 className="text-3xl font-bold mb-5">Add New Blog</h1>

                <div className="mb-4">
                    <label className="block text-lg font-medium">Title:</label>
                    <InputText value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium">Content:</label>
                    <div ref={quillRef} className="w-full h-60 border rounded"></div>
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium">Cover Image:</label>
                    <input type="file" accept="image/*" onChange={onUpload} className="w-full p-2 border rounded" />
                    {imageUrl && <img src={imageUrl} alt="Cover" className="mt-3 w-32 h-32 object-cover rounded" />}
                </div>

                <button
                    onClick={handleSaveBlog}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save Blog"}
                </button>
            </div>
        </Layout>
    );
};

export default AddBlogs;
