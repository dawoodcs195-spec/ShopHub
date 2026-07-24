import { memo, useMemo } from 'react';
import Select from '../../../components/forms/Select';

const getPaymentStatusPill = (status) => {
    switch (status) {
        case "Paid": return "bg-green-100 text-green-700";
        case "Failed": return "bg-red-100 text-red-700";
        default: return "bg-yellow-100 text-yellow-700";
    }
};

const getOrderStatusPill = (status) => {
    switch (status) {
        case "Delivered": return "bg-green-100 text-green-700";
        case "Shipped": return "bg-blue-100 text-blue-700";
        case "Processing": return "bg-yellow-100 text-yellow-700";
        case "Cancelled": return "bg-red-100 text-red-700";
        default: return "bg-gray-100 text-gray-700";
    }
};

const AdminOrderRow = ({ order, onStatusChange }) => {
    const shortId = useMemo(() => order._id.slice(-6).toUpperCase(), [order._id]);
    const createdAtDate = useMemo(() => new Date(order.createdAt).toLocaleDateString(), [order.createdAt]);
    
    return (
        <tr className="border-b border-border hover:bg-background transition-colors">
            <td className="px-4 py-3 whitespace-nowrap font-mono text-sm text-primary font-semibold">#{shortId}</td>
            <td className="px-4 py-3 whitespace-nowrap text-sm text-text-secondary">{createdAtDate}</td>
            <td className="px-4 py-3">
                <div className="font-semibold text-text-primary">{order.user?.name}</div>
                <div className="text-sm text-text-secondary">{order.user?.email}</div>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-text-primary font-semibold">Rs. {order.totalPrice.toLocaleString()}</td>
            <td className="px-4 py-3">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPaymentStatusPill(order.paymentStatus)}`}>
                    {order.paymentStatus}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-text-secondary">{order.paymentMethod}</td>
            <td className="px-4 py-3">
                 <Select
                    value={order.orderStatus}
                    onChange={(e) => onStatusChange(order._id, e.target.value)}
                    className={`text-xs font-semibold !py-1 !px-2 ${getOrderStatusPill(order.orderStatus)}`}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </Select>
            </td>
        </tr>
    );
};

export default memo(AdminOrderRow);