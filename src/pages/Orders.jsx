import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout'
import environement from '../core/environement'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { deleteOrder, getOrderById } from '../core/services/Orders.service'
import { InputNumber } from 'primereact/inputnumber'
import { SelectButton } from 'primereact/selectbutton'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useNavigate } from 'react-router-dom'

function Orders() {

    const [loading, setLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false)
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [status, setStatus] = useState(null);
    const toast = useRef(null);
const API_URL = environement.BACKEND_URL

    const statusOptions = [
        { label: 'Pending', value: false },
        { label: 'Done', value: true }
    ];


    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, '0'); // 2-digit day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, '0'); // 2-digit hours
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 2-digit minutes

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }


    async function getUsersOrders() {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/users`)
            const data = await response.json()
            const allOrders = data.flatMap(user => user.orders)
                .map(order => ({
                    ...order,
                    created_at: formatDate(order.created_at)
                }))
            setOrders(allOrders)
            console.log(allOrders)
        } catch (error) {
            console.error(error, ' Error fetching Orders')
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = async (orderId) => {
        try {
            const data = await getOrderById(orderId)
            console.log(data)
            const formattedData = {
                ...data,
                created_at: formatDate(data.created_at) // ✅ Format date before setting state
            };

            setSelectedOrder(formattedData);
            setStatus(formattedData.status);
            setVisible(true)
        } catch (error) {
            console.error(error)
        }
    };

    const updateOrderStatus = async () => {
        if (!selectedOrder) return;

        try {
            const response = await fetch(`${API_URL}/users/orders/${selectedOrder.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }), // ✅ Send new status
            });

            if (!response.ok) {
                throw new Error("Failed to update order status");
            }

            toast.current.show({
                severity: "success",
                summary: "Order Updated",
                detail: "Order Status Updated Successfully !",
                life: 3000,
            });
            setVisible(false);

            // Refresh the orders list
            getUsersOrders();
        } catch (error) {
            console.error("❌ Error updating order status:", error);
        }
    };

    const confirmDeleteOrder = (orderId) => {
        confirmDialog({
            message: "Are you sure you want to delete this order?",
            header: "Confirm Deletion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Yes",
            rejectLabel: "No",
            acceptClassName: "p-button-danger",
            rejectClassName: "p-button-text",
            accept: () => handleDeleteOrder(orderId),
            reject: () => toast.current.show({ severity: "info", summary: "Cancelled", detail: "Order deletion cancelled", life: 2000 }),
        });
    };



    const handleDeleteOrder = async (orderId) => {
        try {
            await deleteOrder(orderId);
            toast.current.show({ severity: "success", summary: "Deleted", detail: "Order deleted successfully!", life: 3000 });
            getUsersOrders();
        } catch (error) {
            console.error("❌ Error deleting order:", error);
            toast.current.show({ severity: "error", summary: "Error", detail: "Failed to delete order!", life: 3000 });
        }
    };




    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2 gap-3">
                <i className="pi pi-trash text-red-400 hover:text-red-800 cursor-pointer" onClick={() => confirmDeleteOrder(rowData.id)}></i>
                <i className="pi pi-eye cursor-pointer" style={{ color: 'slateblue' }} onClick={() => handleViewDetails(rowData.id)}></i>
            </div>
        );
    };

    useEffect(() => {
        getUsersOrders()
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
        } else {
            setIsAuthenticated(true);
        }
    }, [navigate])
    return (
        <Layout>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="">
                <h1 className='text-3xl font-semibold mb-16'> Orders Validation </h1>
            </div>
            <DataTable
                value={orders}
                tableStyle={{ minWidth: '50rem' }}
                paginator
                rows={10}
                rowsPerPageOptions={[10, 20, 50]} // Options for page size selection
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            >
                <Column field="id" header="ID"></Column>
                <Column field="total_price" header="Total Price"></Column>
                <Column field="created_at" header="Order Date/Time"></Column>
                <Column field="products" header="Products"></Column>
                <Column field="user.username" header="User"></Column>
                <Column
                    field="status"
                    header="Status"
                    body={(rowData) => (
                        <span style={{ color: rowData.status ? 'green' : 'orange' }}>
                            {rowData.status ? "Done" : "Pending"}
                        </span>
                    )}
                ></Column>
                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>


            {/* Dialog to Editthe fucking Orders */}
            <Dialog header="Order " visible={visible} style={{ width: '50vw' }} draggable={false} onHide={() => setVisible(false)}>
                {selectedOrder ? ( // ✅ Check if selectedOrder is not null before rendering
                    <>
                        <h1 className='font-roboto text-3xl justify-self-center'> ORDER DETAILS :</h1>
                        <div className="flex flex-col space-y-2 mb-5">
                            <label className="font-medium text-gray-700">ORDER DATE :</label>
                            <InputText
                                name="created_at"
                                value={selectedOrder.created_at}
                                placeholder="Order Date"
                                className="p-2"
                                readOnly
                                style={{ border: "2px solid gray", borderRadius: "4px" }}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 mb-5">
                            <label className="font-medium text-gray-700">TOTAL PRICE :</label>
                            <div className="p-inputgroup flex-1">
                                <InputNumber name="created_at"
                                    value={selectedOrder.total_price}
                                    placeholder="Order Date"
                                    className="p-2"
                                    readOnly
                                    style={{ border: "1px solid #c3c3c3" }} />
                                <span className="p-inputgroup-addon">€</span>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2 mb-5">
                            <label className="font-medium text-gray-700"> CLIENT EMAIL :</label>
                            <InputText
                                name="created_at"
                                value={selectedOrder.user.email}
                                placeholder="Order Date"
                                className="p-2"
                                readOnly
                                style={{ border: "2px solid gray", borderRadius: "4px" }}
                            />
                        </div>
                        <div className="flex flex-col space-y-2 mb-5">
                            <label className="font-medium text-gray-700">COUNTRY PHONE CODE  + CLIENT PHONE NUMBER:</label>
                            <InputText
                                name="created_at"
                                value={selectedOrder.user.country + ' + ' + selectedOrder.user.phone_number}
                                placeholder="Order Date"
                                className="p-2"
                                readOnly
                                style={{ border: "2px solid gray", borderRadius: "4px" }}
                            />
                        </div>

                        <h2 className=' text-xl font-roboto mt-5'> Order Products :</h2>
                        <ul >
                            {selectedOrder?.products?.map((prod, index) => (
                                <li key={index} className=' text-xl'> <i className="pi pi-file-check ml-10 mt-4 text-green-700    " style={{ fontSize: '1rem' }}></i> {prod} </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex flex-row gap-5 items-center">
                            <h2 className="text-lg font-semibold">Order Status:</h2>
                            <SelectButton
                                value={status}
                                options={statusOptions}
                                onChange={(e) => setStatus(e.value)}
                                className="border border-purple-700 rounded-md"
                            />


                        </div>
                        <button
                            onClick={updateOrderStatus} // ✅ Call API when clicked
                            className="px-10 py-1 mt-8 rounded-tl-3xl rounded-br-3xl rounded-tr-sm rounded-bl-sm hover:rounded-lg bg-gradient-to-r from-purple-800 to-purple-500 text-white text-lg font-semibold shadow-lg hover:opacity-90 hover:shadow-xl transition-all"
                        >
                            Update Status
                        </button>

                    </>
                ) : (
                    <p>Loading order details...</p>
                )}
            </Dialog>
        </Layout>
    )
}

export default Orders