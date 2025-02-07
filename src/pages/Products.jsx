import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";
import { addProduct, deleteProduct, getProductById, getProducts } from "../core/services/products.services";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

function Products() {
    const [visible, setVisible] = useState(false);
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [products, setProducts] = useState([]);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const toast = useRef(null);
    const columns = [
        { field: 'name', header: 'Nom' },
        { field: 'type', header: 'Type' },
        { field: 'price', header: 'Price' },
        { field: 'price_before', header: 'Perfect Before' }
    ];
    const [product, setProduct] = useState({
        name: "",
        type: "",
        description: "",
        price: "",
        price_before: "",
        features: "",
        photos: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    async function fetchProducts() {
        try {
            const productsData = await getProducts();
            console.log("Fetched products:", productsData);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const onUpload = async (event) => {
        const file = event.files[0];
        if (!file) {
            console.error("No file selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `http://localhost:3001/upload`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            console.log("File uploaded successfully:", response.data);

            // Update state with the file name
            setUploadedFileName(file.name);

            setProduct((prevProduct) => ({
                ...prevProduct,
                photos: response.data.path,
            }));
        } catch (error) {
            console.error("Error during file upload:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await addProduct(product);
            console.log("Product added successfully:", response.data);
            toast.current.show({
                severity: "success",
                summary: "Product Added",
                detail: "Product has been successfully added.",
                life: 3000,
            });
            setVisible(false)
            fetchProducts()
        } catch (error) {
            console.error("Error adding product:", error.response?.data || error.message);
            toast.current.show({
                severity: "error",
                summary: "Add Failed",
                detail: "An error occurred while adding the product.",
                life: 3000,
            });
        }
    };

    const handleDelete = async (productId) => {
        try {
            const response = await deleteProduct(productId);
            console.log("Product deleted successfully:", response.data);

            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Product Deleted",
                    detail: "Product has been successfully deleted.",
                    life: 3000,
                });
            }

            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error.response?.data || error.message);

            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Delete Failed",
                    detail: "An error occurred while deleting the product.",
                    life: 3000,
                });
            }
        }
    };

    const handleViewDetails = async (productId) => {
        try {
            const data = await getProductById(productId)
            console.log(data)
            setSelectedProduct(data);
            setDetailsVisible(true)
        } catch (error) {
            console.error(error)
        }
    };


    useEffect(() => {
        fetchProducts();
    }, []);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2 gap-3">
                <i className="pi pi-pencil" style={{ color: 'slateblue' }}></i>
                <i className="pi pi-trash cursor-pointer" style={{ color: 'slateblue' }} onClick={() => { handleDelete(rowData.id) }}></i>
                <i className="pi pi-eye cursor-pointer" style={{ color: 'slateblue' }} onClick={() => { handleViewDetails(rowData.id) }} ></i>
            </div>
        );
    };

    return (
        <Layout>
            <Toast ref={toast} />
            <div className="flex flex-row justify-between px-10">
                <h2 className="mb-4 text-xl font-semibold">Products Page</h2>
                <button
                    className="px-10 py-2 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm hover:rounded-lg bg-gradient-to-r from-red-500 to-purple-500 text-white text-lg font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all"
                    onClick={() => setVisible(true)}
                >
                    Add Product
                </button>
                <Dialog
                    header="Add Product"
                    visible={visible}
                    maximizable
                    style={{ width: "50vw" }}
                    onHide={() => setVisible(false)}
                >
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Name:</label>
                        <InputText
                            name="name"
                            value={product.name}
                            onChange={handleInputChange}
                            placeholder="Enter Name"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Type:</label>
                        <InputText
                            name="type"
                            value={product.type}
                            onChange={handleInputChange}
                            placeholder="Enter Type"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Description:</label>
                        <InputTextarea
                            name="description"
                            value={product.description}
                            onChange={handleInputChange}
                            rows={5}
                            cols={30}
                            placeholder="Enter Description"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Price:</label>
                        <InputText
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            placeholder="Enter Price"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Price Before:</label>
                        <InputText
                            name="price_before"
                            value={product.price_before}
                            onChange={handleInputChange}
                            placeholder="Enter Price Before"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-col space-y-2 mb-5">
                        <label className="font-medium text-gray-700">Features:</label>
                        <InputTextarea
                            name="features"
                            value={product.features}
                            onChange={handleInputChange}
                            rows={5}
                            cols={30}
                            placeholder="Enter Features"
                            className="p-2"
                            style={{ border: "2px solid gray", borderRadius: "4px" }}
                        />
                    </div>
                    <div className="flex flex-row gap-5 items-center card justify-content-center">
                        <Toast ref={toast}></Toast>
                        <FileUpload
                            mode="basic"
                            name="file"
                            customUpload={true}
                            uploadHandler={onUpload}
                            accept="image/*"
                            maxFileSize={1000000}
                            auto
                        />
                        {uploadedFileName && (<span className=" font-semibold"> {uploadedFileName} </span>)}
                    </div>
                    <div className="flex justify-end mt-5">
                        <button
                            className="px-6 py-1 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm hover:rounded-lg bg-gradient-to-r from-red-500 to-purple-500 text-white text-lg font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </Dialog>

                {/* Dialog for showing the products Details */}
                <Dialog
                    header="Products Details"
                    visible={detailsVisible}
                    maximizable
                    style={{ width: "50vw" }}
                    onHide={() => setDetailsVisible(false)}
                >
                    {selectedProduct ? (
                        <div className="flex flex-col">
                            {selectedProduct.photos && (
                                <img
                                    src={selectedProduct.photos}
                                    alt="Product"
                                    className="h-auto rounded-md object-cover w-56 mt-3"
                                    style={{ alignSelf: "center"}}          
                                />
                            )}
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Name:</label>
                                <InputText
                                    name="name"
                                    value={selectedProduct.name}
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Type:</label>
                                <InputText
                                    name="type"
                                    value={selectedProduct.type}
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Description:</label>
                                <InputTextarea
                                    name="description"
                                    value={selectedProduct.description}
                                    rows={5}
                                    cols={30}
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Price:</label>
                                <InputText
                                    name="price"
                                    value={selectedProduct.price}
                                    placeholder="Enter Price"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Price Before:</label>
                                <InputText
                                    name="price_before"
                                    value={selectedProduct.price_before}
                                    placeholder="Enter Price Before"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            {selectedProduct.features.length > 0 && (
                                <div className="w-full mt-4">
                                    <h3 className="text-lg font-medium text-gray-700">Features:</h3>
                                    <ul className="list-disc list-inside p-4 rounded-lg ">
                                        {selectedProduct.features.map((feature, index) => (
                                            <li key={index} className="text-gray-700 text-xl py-1 pl-2">
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading product details...</p>
                    )}
                </Dialog>
            </div>
            <DataTable
                value={products}
                tableStyle={{ minWidth: '50rem', marginTop: '60px' }}
            >
                {columns.map((col, i) => (
                    <Column key={col.field} field={col.field} header={col.header} />
                ))}
                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>
        </Layout>
    );
}

export default Products;

