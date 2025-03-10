import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import environement from "../core/environement";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { getTicketById, updateTicketStatus } from "../core/services/Tickets.service";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";

function Tickets() {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [status, setStatus] = useState("open"); // ✅ Add state for status
    const toast = useRef(null);
    const ENGINE = environement.ENGINE_URL;
    const [ticket, setTicket] = useState([]);

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const handleViewDetails = async (ticketId) => {
        try {
            const data = await getTicketById(ticketId);
            console.log(data);
            const formattedData = {
                ...data,
                created_at: formatDate(data.created_at),
            };

            setSelectedTicket(formattedData);
            setStatus(formattedData.status); // ✅ Set status from the ticket
            setVisible(true);
        } catch (error) {
            console.error(error);
        }
    };

    async function getUsersTickets() {
        setLoading(true);
        try {
            const response = await fetch(`${ENGINE}/users`);
            const data = await response.json();
            const allTickets = data
                .flatMap((user) => user.ticket)
                .map((ticket) => ({
                    ...ticket,
                    created_at: formatDate(ticket.created_at),
                }));
            setTicket(allTickets);
            console.log(allTickets);
        } catch (error) {
            console.error(error, " Error fetching Tickets");
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (e) => {
        const newStatus = e.value ? "closed" : "open"; // ✅ Update status dynamically

        try {
            await updateTicketStatus(selectedTicket.id, newStatus); // ✅ Send update request
            setStatus(newStatus);

            toast.current.show({
                severity: "success",
                summary: "Status Updated",
                detail: `Ticket marked as ${newStatus}`,
                life: 3000,
            });

            getUsersTickets(); // ✅ Refresh tickets after update
        } catch (error) {
            console.error("Error updating status:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Failed to update ticket status",
                life: 3000,
            });
        }
    };

    const statusBodyTemplate = (rowData) => {
        return <Tag value={rowData.status} severity={rowData.status === "open" ? "warning" : "success"} />;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex space-x-2 gap-3">
                <i className="pi pi-eye cursor-pointer" style={{ color: "slateblue" }} onClick={() => handleViewDetails(rowData.id)}></i>
            </div>
        );
    };

    useEffect(() => {
        getUsersTickets();
    }, []);

    return (
        <Layout>
            <Toast ref={toast} /> {/* ✅ Add Toast for Notifications */}

            <div className="">
                <h1 className="text-3xl font-normal font-roboto "> Support tickets</h1>
            </div>

            <DataTable className="mt-16" value={ticket} tableStyle={{ minWidth: "50rem" }}>
                <Column field="id" header="Ticket ID"></Column>
                <Column field="subject" header="Subject"></Column>
                <Column field="created_at" header="Creation Date"></Column>
                <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                <Column header="Action" body={actionBodyTemplate} />
            </DataTable>

            {/* Ticket Details Dialog */}
            <Dialog header="Ticket Details" visible={visible} style={{ width: "50vw" }} onHide={() => setVisible(false)}>
                <div className="flex flex-col space-y-2 mb-5">
                    <p className="mb-5 text-xl font-semibold text-purple-500"> New Ticket from : <span className="text-black"> { selectedTicket?.user.full_name}</span></p>
                    <label className="font-medium text-gray-700">USER EMAIL :</label>
                    <InputText
                        name="created_at"
                        value={selectedTicket?.user.email}
                        placeholder="Order Date"
                        className="p-2"
                        readOnly
                        style={{ border: "2px solid gray", borderRadius: "4px" }}
                    />
                </div>
                <div className="flex flex-col space-y-2 mb-5">
                    <label className="font-medium text-gray-700">CREATION DATE :</label>
                    <InputText
                        name="created_at"
                        value={selectedTicket?.created_at}
                        placeholder="Order Date"
                        className="p-2"
                        readOnly
                        style={{ border: "2px solid gray", borderRadius: "4px" }}
                    />
                </div>
                <div className="flex flex-col space-y-2 mb-5">
                    <label className="font-medium text-gray-700">TICKET SUBJECT :</label>
                    <InputText
                        name="created_at"
                        value={selectedTicket?.subject}
                        placeholder="Order Date"
                        className="p-2"
                        readOnly
                        style={{ border: "2px solid gray", borderRadius: "4px" }}
                    />
                </div>
                <div className="flex flex-col space-y-2 mb-16">
                    <label className="font-medium text-gray-700">TICKET MESSAGE :</label>
                    <InputText
                        name="created_at"
                        value={selectedTicket?.message}
                        placeholder="Order Date"
                        className="p-2 "
                        readOnly
                        style={{ border: "2px solid gray", borderRadius: "4px" }}
                    />
                </div>

                {/* ✅ Ticket Status Toggle */}
                <p className=" mt-5"> TICKET STATUS :</p>
                <div className="flex items-center gap-4 mt-4">
                    <span>Open</span>
                    <InputSwitch checked={status === "closed"} onChange={handleStatusChange} />
                    <span>Closed</span>
                </div>
            </Dialog>
        </Layout>
    );
}

export default Tickets;
