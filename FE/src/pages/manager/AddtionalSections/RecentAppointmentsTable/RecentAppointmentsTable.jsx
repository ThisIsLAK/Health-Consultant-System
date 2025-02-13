import React from 'react';

const RecentAppointmentsTable = () => {
    const mockItems = [
        {
            _id: '1',
            number: '#2644',
            customer: 'Nguyễn Minh Hoàng',
            product: 'Samsung Galaxy Z Flip6 5G 12GB/256GB',
            price: 1299.99,
            status: 'Approved',
        },
        {
            _id: '2',
            number: '#2457',
            customer: 'Ngô Chí Kiên',
            product: 'Samsung Galaxy Z Flip6 5G 12GB/256GB',
            price: 799.99,
            status: 'Pending',
        },
        {
            _id: '3',
            number: '#2147',
            customer: 'Trần Phương Khánh',
            product: 'Samsung Galaxy Z Flip6 5G 12GB/256GB',
            price: 199.99,
            status: 'Rejected',
        },
        {
            _id: '4',
            number: '#2049',
            customer: 'Tô Triều Vỹ',
            product: 'Samsung Galaxy Z Flip6 5G 12GB/256GB',
            price: 49.99,
            status: 'Approved',
        },
        {
            _id: '5',
            number: '#3592',
            customer: 'Nguyễn Phương Nam',
            product: 'Samsung Galaxy Z Flip6 5G 12GB/256GB',
            price: 129.99,
            status: 'Pending',
        },
    ];

    const handleStatus = status => {
        switch (status) {
            case 'Approved':
                return 'success';
            case 'Pending':
                return 'warning';
            case 'Rejected':
                return 'danger';
            default:
                return 'success';
        }
    };

    return (
        <table className="table table-borderless datatable">
            <thead className="table-light">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {mockItems.map(item => (
                    <tr key={item._id}>
                        <th scope="row">
                            <a href="#">{item.number}</a>
                        </th>
                        <td>{item.customer}</td>
                        <td>
                            <a href="#" className="text-primary fw-bold">
                                {item.product}
                            </a>
                        </td>
                        <td>${item.price.toFixed(2)}</td>
                        <td>
                            <span className={`badge bg-${handleStatus(item.status)}`}>
                                {item.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default RecentAppointmentsTable;
