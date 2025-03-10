import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import environement from "../core/environement";
import { getAllUsers } from "../core/services/users.service";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";

const Dashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState(null);

  const ENGINE = environement.ENGINE_URL;
  const navigate = useNavigate();

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  function groupByMonth(data) {
    return data.reduce((acc, item) => {
      const month = new Date(item.created_at).toLocaleString("default", { month: "short", year: "numeric" });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});
  }

  async function getUsersOrders() {
    setLoading(true);
    try {
        const response = await fetch(`${ENGINE}/users`);
        const data = await response.json();

        const allOrders = data.flatMap(user => user.orders).map(order => ({
            ...order,
            created_at: formatDate(order.created_at),
        }));

        const allTickets = data.flatMap(user => user.ticket).map(ticket => ({
            ...ticket,
            created_at: formatDate(ticket.created_at),
        }));

        setOrders(allOrders);
        setTickets(allTickets);

        const ordersByMonth = groupByMonth(allOrders);
        const ticketsByMonth = groupByMonth(allTickets);
        const usersByMonth = groupByMonth(data);

        const allLabels = [...new Set([
            ...Object.keys(ordersByMonth),
            ...Object.keys(ticketsByMonth),
            ...Object.keys(usersByMonth)
        ])].map(label => ({
            label,
            date: new Date(`${label} 1`) // Ensure date format for sorting
        })).sort((a, b) => a.date - b.date);

        // Filter for two months before and after current month
        const currentDate = new Date();
        const filteredLabels = allLabels
            .filter(({ date }) => {
                const diff = (date.getFullYear() - currentDate.getFullYear()) * 12 + (date.getMonth() - currentDate.getMonth());
                return diff >= -2 && diff <= 2; // Keep within the range
            })
            .map(item => item.label);

        setChartData({
            labels: filteredLabels,
            datasets: [
                {
                    label: "Orders",
                    data: filteredLabels.map(month => ordersByMonth[month] || 0),
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    tension: 0.4, // Smooth curves
                    fill: false,
                },
                {
                    label: "Users",
                    data: filteredLabels.map(month => usersByMonth[month] || 0),
                    borderColor: "#ec4899",
                    backgroundColor: "rgba(236, 72, 153, 0.2)",
                    tension: 0.4,
                    fill: false,
                },
                {
                    label: "Tickets",
                    data: filteredLabels.map(month => ticketsByMonth[month] || 0),
                    borderColor: "#facc15",
                    backgroundColor: "rgba(250, 204, 21, 0.2)",
                    tension: 0.4,
                    fill: false,
                },
            ],
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
    } finally {
        setLoading(false);
    }
}


  async function fetchUsers() {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error(error);
    }
  }

  const statusBodyTemplate = (rowData) => {
    return <Tag value={rowData.status} severity={rowData.status === "open" ? "warning" : "success"} />;
  };

  useEffect(() => {
    fetchUsers();
    getUsersOrders();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 mt-16">
        <div
          className="flex items-center justify-between bg-purple-500/75 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <i className="pi pi-credit-card text-3xl mr-3"></i>
            <h2 className="text-xl font-semisemibold">Total Number of orders</h2>
          </div>
          <h2 className="text-3xl font-semibold">{orders.length}</h2>
        </div>

        <div
          className="flex items-center justify-between bg-red-400/75 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <i className="pi pi-user text-3xl mr-3"></i>
            <h2 className="text-xl font-semisemibold">Total Number of Users</h2>
          </div>
          <h2 className="text-3xl font-semibold">{users.length}</h2>
        </div>

        <div
          className="flex items-center justify-between bg-orange-500/75 text-white p-4 rounded-lg shadow-lg"
        >
          <div className="flex items-center">
            <i className="pi pi-ticket text-3xl mr-3"></i>
            <h2 className="text-xl font-semisemibold">Total Number of Support Tickets</h2>
          </div>
          <h2 className="text-3xl font-semibold">{tickets.length}</h2>
        </div>
      </div>

      {/* Pending tickets Datatable */}
      <div className="p-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">Open Support Tickets</h2>
        <DataTable value={tickets.filter(ticket => ticket.status === 'open')} paginator rows={5}>
          <Column field="id" header="Ticket ID" sortable></Column>
          <Column field="created_at" header="Date" sortable></Column>
          <Column field="status" header="Status" body={statusBodyTemplate}></Column>
        </DataTable>
      </div>

      {/* Latest 5 Orders Table */}
      <div className="p-4 mt-8">
        <h2 className="text-xl font-semibold mb-4">Latest Orders</h2>
        <DataTable value={orders.slice(0, 5)} paginator rows={5}>
          <Column field="id" header="Order ID" sortable></Column>
          <Column field="total_price" header="Total price" sortable></Column>
          <Column field="user.email" header="Client Email" sortable></Column>
          <Column field="created_at" header="Date" sortable></Column>
          <Column field="status" header="status"
            body={(rowData) => (
              <span style={{ color: rowData.status ? 'green' : 'orange' }}>
                {rowData.status ? "Done" : "Pending"}
              </span>
            )}
          ></Column>
        </DataTable>
      </div>

      {/* Line Chart */}
      <div className="p-4 mt-8">
        {chartData && <Chart type="line" data={chartData} />}
      </div>
    </Layout>
  );
};

export default Dashboard;