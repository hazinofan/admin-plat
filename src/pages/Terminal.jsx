import React, { useEffect, useState } from 'react';
import { Terminal } from 'primereact/terminal';
import { TerminalService } from 'primereact/terminalservice';
import Layout from '../components/Layout';
import { getProducts } from '../core/services/products.services';

export default function TerminalDemo() {

    const [products, setProducts] = useState([]);

    async function fetchProducts() {
        try {
            const productsData = await getProducts();
            console.log("Fetched products:", productsData.length);
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    const commandHandler = (text) => {
        let response;
        let argsIndex = text.indexOf(' ');
        let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

        switch (command) {
            case 'date':
                response = 'Today is ' + new Date().toDateString();
                break;

            case 'prod_num':
                response = 'Total Number of products is ' + products.length;
                break;

            case 'mehdi':
                response = 'Hola ' + 'Mehdi';
                break;

            case 'random':
                response = Math.floor(Math.random() * 100);
                break;

            case 'clear':
                response = null;
                break;

            default:
                response = 'Unknown command: ' + command;
                break;
        }

        if (response)
            TerminalService.emit('response', response);
        else
            TerminalService.emit('clear');
    };

    useEffect(() => {
        fetchProducts()
        TerminalService.on('command', commandHandler);

        return () => {
            TerminalService.off('command', commandHandler);
        };
    }, []);

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