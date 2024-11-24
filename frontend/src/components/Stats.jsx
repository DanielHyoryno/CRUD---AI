import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Stats = () => {
    const [data, setData] = useState({
        above50: 0,
        below50: 0,
        monthlyCounts: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/patient-stats");
            console.log("Fetched Stats:", response.data); // Debugging
            setData(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching stats:", error.response || error.message);
            if (error.response) {
                console.error("Server responded with:", error.response.data);
            }
            setError("Failed to load statistics.");
            setLoading(false);
        }
    };    

    // Prepare chart data
    const pieData = {
        labels: ["With Pneumonia (Above 50%)", "Without Pneumonia (Below 50%)"],
        datasets: [
            {
                data: [data.above50, data.below50],
                backgroundColor: ["#FF6384", "#36A2EB"],
            },
        ],
    };

    const barData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Update labels dynamically if required
        datasets: [
            {
                label: "Monthly Patient Count",
                data: data.monthlyCounts,
                backgroundColor: "#36A2EB",
            },
        ],
    };

    // Chart options to prevent overflow
    const pieOptions = {
        maintainAspectRatio: true, // Maintain aspect ratio
        responsive: true, // Make the chart responsive
    };

    const barOptions = {
        maintainAspectRatio: true, // Maintain aspect ratio
        responsive: true, // Make the chart responsive
    };

    // Loading or Error Handling
    if (loading) return <p>Loading statistics...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 bg-gray-100">
            <h3 className="text-2xl font-semibold mb-4">Patient Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pneumonia Distribution Pie Chart */}
                <div className="bg-white p-4 rounded shadow h-64 flex items-center justify-center"> {/* Center the chart */}
                    <h4 className="font-semibold mb-2 pd-30">Pneumonia Distribution</h4>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>
                {/* Monthly Patient Count Bar Chart */}
                <div className="bg-white p-4 rounded shadow h-64 flex items-center justify-center"> {/* Center the chart */}
                    <h4 className="font-semibold mb-2 pd-30 pr-50">Monthly Patient Count</h4>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Bar data={barData} options={barOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
