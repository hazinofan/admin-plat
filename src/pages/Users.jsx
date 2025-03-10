import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { deleteUser, getAllUsers, getUserById, updateUser } from '../core/services/users.service'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import { Dropdown } from 'primereact/dropdown'
import { useNavigate } from 'react-router-dom'

function Users() {
    const [users, setUsers] = useState([])
    const [viewDialog, setViewDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const toast = useRef(null)

    const [formData, setFormData] = useState({
        full_name: "",
        country: "",
        created_at: "",
        email: "",
        username: "",
        phone_number: "",
    });

    const countryOptions = [
        { label: "United States", value: "United States" },
        { label: "United Kingdom", value: "United Kingdom" },
        { label: "Canada", value: "Canada" },
        { label: "France", value: "France" },
        { label: "Germany", value: "Germany" },
        { label: "Spain", value: "Spain" },
        { label: "Italy", value: "Italy" },
        { label: "Morocco", value: "Morocco" },
        { label: "Tunisia", value: "Tunisia" },
        { label: "Algeria", value: "Algeria" },
        { label: "Not Assigned", value: "" },
    ];


    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    async function fetchUsers() {
        try {
            const response = await getAllUsers()
            console.log(response)
            setUsers(response)
        } catch (error) {
            console.error(error)
        }
    }

    const handleViewDetails = async (userId) => {
        try {
            const data = await getUserById(userId)
            console.log(data)
            const formattedData = {
                ...data,
                created_at: formatDate(data.created_at)
            }
            setSelectedUser(formattedData);
            setViewDialog(true)
        } catch (error) {
            console.error(error)
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUser(userId);

            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Deleted",
                    detail: "User deleted successfully!",
                    life: 3000
                });
            }

            fetchUsers();
        } catch (error) {
            console.error("Error deleting user:", error);

            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to delete user!",
                    life: 3000
                });
            }
        }
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2 gap-3">
                <i className="pi pi-trash text-red-400 hover:text-red-800 cursor-pointer transition-colors" onClick={() => handleDeleteUser(rowData.id)}></i>
                <i className="pi pi-eye cursor-pointer text-purple-500 hover:text-purple-700 transition-colors" onClick={() => handleViewDetails(rowData.id)}></i>
                <i className="pi pi-pencil cursor-pointer text-yellow-500 hover:text-purple-700 transition-colors" onClick={() => handleEditUser(rowData.id)}></i>
            </div>
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateUser(selectedUser.id, formData);

            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Updated",
                    detail: "User updated successfully!",
                    life: 3000
                });
            }

            setEditDialog(false);
            fetchUsers();
        } catch (error) {
            console.error("Error updating user:", error);

            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Failed to update user!",
                    life: 3000
                });
            }
        }
    };



    const handleEditUser = async (userId) => {
        try {
            const data = await getUserById(userId);
            setSelectedUser(data);
            setFormData({
                full_name: data.full_name || "",
                country: data.country || "",
                email: data.email || "",
                username: data.username || "",
                phone_number: data.phone_number || "",
            });
            setEditDialog(true);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        fetchUsers()
        if (selectedUser) {
            setFormData({
                full_name: selectedUser.full_name || "",
                country: selectedUser.country || "",
                created_at: selectedUser.created_at || "",
                email: selectedUser.email || "",
                username: selectedUser.username || "",
                phone_number: selectedUser.phone_number || "",
            });
            setEditDialog(true)
        }
    }, [selectedUser])



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate])

    return (
        <div>
            <Layout>
                <Toast ref={toast} />
                <div className=" justify-items-center">
                    <h1 className='text-2xl font-roboto font-semibold mb-10'> List of users Platinium</h1>
                </div>

                <DataTable value={users} tableStyle={{ minWidth: '50rem' }}>
                    <Column field="id" header="User ID"></Column>
                    <Column field="country" header="Country"></Column>
                    <Column field="email" header="Email"></Column>
                    <Column field="full_name" header="Name"></Column>
                    <Column header="Action" body={actionBodyTemplate} />
                </DataTable>

                <Dialog header="User Details" draggable={false} visible={viewDialog} style={{ width: '50vw' }} onHide={() => setViewDialog(false)}>
                    {selectedUser ? (
                        <>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Name:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.full_name}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Country:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.country || 'Not assigned'}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Creation date:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.created_at}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Email:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.email}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Username:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.username}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-col space-y-2 mb-10">
                                <label className="font-medium text-gray-700">Country:</label>
                                <InputText
                                    name="name"
                                    value={selectedUser.phone_number + ' ' + `country is ` + ' ' + `${selectedUser.country ? selectedUser.country : 'Not Assigned'} `}
                                    placeholder="Enter Name"
                                    className="p-2"
                                    style={{ border: "2px solid gray", borderRadius: "4px" }}
                                />
                            </div>
                            <div className="flex flex-row gap-10 justify-center">
                                <div className="flex flex-row items-center gap-3">
                                    <p> Number of Orders :</p>
                                    <p> {selectedUser.orders.length}</p>
                                </div>
                                <div className="flex flex-row items-center gap-3">
                                    <p> Number of Support tickets Requests :</p>
                                    <p> {selectedUser.orders.length}</p>
                                </div>
                            </div>

                        </>
                    ) : (
                        <p> LOADING USERS DATA </p>
                    )}
                </Dialog>

                {/* dialog to edit users */}
                <Dialog header="Edit User" draggable={false} visible={editDialog} style={{ width: '50vw' }} onHide={() => setEditDialog(false)}>
                    <div className="p-5">
                        <Toast ref={toast} />
                        <h2 className="text-lg font-semibold mb-3">Edit User</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Name:</label>
                                <InputText name="full_name" value={formData.full_name} onChange={handleChange} className="p-2 border-2 rounded-md" />
                            </div>

                            <Dropdown
                                name="country"
                                value={formData.country}
                                options={countryOptions}
                                filter
                                showClear
                                onChange={(e) => setFormData({ ...formData, country: e.value })}
                                placeholder="Select a country"
                                className="mb-3 border-2 rounded-md w-full"
                            />

                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Creation Date:</label>
                                <InputText name="created_at" value={formData.created_at} disabled className="p-2 border-2 rounded-md bg-gray-200" />
                            </div>

                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Email:</label>
                                <InputText name="email" value={formData.email} onChange={handleChange} className="p-2 border-2 rounded-md" />
                            </div>

                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Username:</label>
                                <InputText name="username" value={formData.username} onChange={handleChange} className="p-2 border-2 rounded-md" />
                            </div>

                            <div className="flex flex-col space-y-2 mb-5">
                                <label className="font-medium text-gray-700">Phone Number:</label>
                                <InputText name="phone_number" value={formData.phone_number} onChange={handleChange} className="p-2 border-2 rounded-md" />
                            </div>

                            <div className="flex justify-center mt-5 gap-4">
                                <button type="submit" className="p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">Save Changes</button>
                                <button type="button" onClick={() => setEditDialog(false)} className="p-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancel</button>
                            </div>
                        </form>
                    </div>
                </Dialog>
            </Layout>
        </div>
    )
}

export default Users