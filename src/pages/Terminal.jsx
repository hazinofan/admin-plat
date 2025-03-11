import React, { useEffect, useState } from 'react';
import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import Layout from '../components/Layout';
import { getProducts } from '../core/services/products.services';
import { useNavigate } from 'react-router-dom';
import { getAllUsers } from '../core/services/users.service';
import environement from '../core/environement';

export default function TerminalDemo() {

    const [products, setProducts] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [emails, setEmails] = useState([])
    const [loading, setLoading] = useState(false)
    const [ordersId, setOrdersId] = useState([])
    const navigate = useNavigate();
const API_URL = environement.BACKEND_URL

    async function fetchProducts() {
        try {
            const productsData = await getProducts();
            console.log("Fetched products:", productsData.length);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    async function fetchUsers() {
        try {
            const response = await getAllUsers()
            const userEmails = response.map(user => user.email)
            console.log(userEmails, 'emails');

            setEmails(userEmails)
        } catch (error) {
            console.error(error)
        }
    }

    async function getUsersOrders() {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();

            const allOrders = data
                .flatMap(user => user.orders)
                .filter(order => order.status === false)
                .map(order => order.id);

            setOrdersId(allOrders)
        } catch (error) {
            console.error("Error fetching orders:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }


    const commandHandler = (text) => {
        let response;
        let args = text.split(' '); // Split command into parts
        let command = args[0]; // Get the base command (first word)
        let subCommand = args.slice(1).join(' '); // Get the rest (sub-command)

        if (command === 'santito') {
            if (subCommand === 'prods') {
                response = 'Total Number of products is ' + products.length;
            } else if (subCommand === 'emails') {
                response = 'All Users emails: ' + emails.join(', ');
            } else if (subCommand === 'pending orders') {
                response = " Pending orders ID's :" + ' ' + ordersId
            }
            else if (!subCommand) {
                response = 'Santito requires a valid sub-command (e.g., "santito prod_num" or "santito emails").';
            } else {
                response = 'Unknown sub-command for santito: ' + subCommand;
            }
        } else {
            switch (command) {
                case 'date':
                    response = new Date().toDateString();
                    break;

                case 'random':
                    response = Math.floor(Math.random() * 100);
                    break;

                case 'email':
                    response = emails.join(', ');
                    break;

                case 'clear':
                    response = null;
                    break;

                default:
                    response = 'Unknown command: ' + command;
                    break;
            }
        }

        if (response)
            TerminalService.emit('response', response);
        else
            TerminalService.emit('clear');
    };

    useEffect(() => {
        fetchProducts()
        getUsersOrders()
        fetchUsers()
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, []);

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
            <div className=" justify-items-center mt-5">
                <h1 className='text-3xl font-roboto'> Easy Access to Data Terminal</h1>
                <span className=' text-sm font-normal text-gray-500'> The documentation of available commande are in the bottom right of the page </span>
            </div>

            <div className="card terminal-demo mt-10">
                <Terminal
                    welcomeMessage="Welcome to Platinium CMD"
                    prompt="PLATINIUM $"
                    pt={{
                        root: 'bg-gray-900 text-white border-round',
                        prompt: 'text-gray-400 mr-2',
                        command: 'text-primary-300',
                        response: 'text-primary-300'
                    }}
                />
            </div>


            {/* Floating Button */}
            <button
                className="fixed bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg transition-all"
                onClick={() => alert("Opening Documentation...")} // Replace with your function
            >
                📜 Docs
            </button>
        </Layout>
    );
}