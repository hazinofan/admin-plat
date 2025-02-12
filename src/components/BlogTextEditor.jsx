import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";

const QuillEditor = () => {
    const quillRef = useRef(null);
    const [content, setContent] = useState("");

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
                        image: () => imageHandler(quill),
                    },
                },
            },
        });

        quill.on("text-change", () => {
            setContent(quill.root.innerHTML);
        });

        return () => quill.off("text-change");
    }, []);

    const imageHandler = async (quill) => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post("http://localhost:3001/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                const imageUrl = response.data.url;
                const range = quill.getSelection();
                quill.insertEmbed(range.index, "image", imageUrl);
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        };
    };

    return (
        <div className="p-5 bg-white rounded-md shadow-md w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-3">Quill.js Editor</h2>
            <div ref={quillRef} className="h-60 mb-3"></div>
            <button onClick={() => console.log(content)} className="bg-blue-500 text-white px-4 py-2 rounded">
                Log Content
            </button>
        </div>
    );
};

export default QuillEditor;
