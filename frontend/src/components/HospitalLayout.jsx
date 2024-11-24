import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const HospitalLayout = () => {
    return (
        <div className="flex h-screen">
            <nav className="h-full flex-col w-64 bg-gray-800 shadow-sm text-white p-4">
                <h1 className="text-2xl font-bold mb-6">Pneumonia Lab Detector</h1>
                <ul>
                    <li className="mb-4">
                        <Link to="/add" className="hover:text-gray-300">Add User</Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/" className="hover:text-gray-300">User List</Link>
                    </li>
                    <li className="mb-4">
                        <Link to="/stats" className="hover:text-gray-300">Statistics</Link> {/* Link to Stats */}
                    </li>
                </ul>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-semibold">Dashboard</h2>
                    <div className="flex items-center">
                        <img 
                            src="https://via.placeholder.com/40" 
                            alt="Profile" 
                            className="rounded-full mr-2" 
                        />
                        <span className="text-lg">Guest - 127</span>
                    </div>
                </header>

                {/* Outlet for nested routes */}
                <Outlet />
            </div>
        </div>
    );
};

export default HospitalLayout;