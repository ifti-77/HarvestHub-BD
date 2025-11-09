"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

function Commodity({ itemDetails }) {
    const { name, division, price, updatedDate } = itemDetails;

    const [mouseOn, setMouseOn] = useState(false);
    const [prices, setPrices] = useState(price);
    const [priceRatio, setPriceRatio] = useState(0);
    
    const router = useRouter()

    useEffect(() => {
        if (price.length > 7) {
            setPrices(price.slice(-7));
        } else {
            setPrices(price);
        }


        if (price.length >= 2) {
            const latest = price[price.length - 1].rate;
            const prev = price[price.length - 2].rate;
            const ratio = ((latest - prev) / prev) * 100;
            setPriceRatio(ratio.toFixed(1));
        } else {
            setPriceRatio(0);
        }
    }, [price]);

    const getRatioColor = () => {
        if (priceRatio > 0) return "bg-green-500";
        if (priceRatio < 0) return "bg-red-500";
        return "bg-gray-400";
    };

    return (
        <div
            className="bg-white border border-gray-200 rounded-xl shadow-md p-3 m-4 w-[280px] h-[200px] flex flex-col justify-between transition-transform transform hover:scale-[1.02] hover:shadow-lg cursor-pointer"
            onMouseEnter={() => setMouseOn(true)}
            onMouseLeave={() => setMouseOn(false)}
        >
            {/* Header */}
            <div className="flex justify-between items-center bg-blue-100 rounded-t-lg py-1.5 px-2">
                <span className="font-semibold text-gray-800 text-sm">{name}</span>
                <div className="flex items-center gap-2">
                    <span
                        className={`${getRatioColor()} text-white text-xs font-medium px-2 py-0.5 rounded-full`}
                    >
                        {priceRatio > 0 && "+"}
                        {priceRatio}%
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-row grow mt-2">
                <div className="flex flex-col justify-between w-1/3 text-sm text-gray-600">
                    <span className="font-medium">{division}</span>
                    <span className="text-gray-800 font-semibold text-sm">
                        {prices[prices.length - 1]?.rate} BDT/{prices[prices.length - 1]?.unit}
                    </span>
                    <span className="text-xs text-gray-400">{updatedDate}</span>
                </div>

                <div className="w-2/3 h-full rounded-md">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prices}>
                            <XAxis dataKey="date" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#f9f9f9",
                                    borderRadius: "6px",
                                    border: "1px solid #ddd",
                                    fontSize: "12px",
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={{ r: 2 }}
                                activeDot={{ r: 5 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Footer */}
            <button onClick={()=>{
                router.push(`/commodity/${itemDetails.uniqueID}`)
            }}>
                <span
                    className={`text-gray-500 text-xs text-center mt-1 transition-opacity duration-200 ${mouseOn ? "opacity-100 cursor-pointer" : "opacity-0"
                        }`}
                >
                    View Detail
                </span>
            </button>
        </div>
    );
}

export default Commodity;
