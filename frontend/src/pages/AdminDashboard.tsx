import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  // Hardcoded Stats
  const stats = [
    { title: "Total Orders", value: 124, color: "bg-blue-500" },
    { title: "Total Sales", value: "₱ 52,400", color: "bg-green-500" },
    { title: "Pending Orders", value: 7, color: "bg-yellow-500" },
    { title: "Cancelled Orders", value: 2, color: "bg-red-500" },
    { title: "Refund Requests", value: 3, color: "bg-purple-500" },
  ];

  // Hardcoded Sales Data
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 2000 },
    { month: "May", sales: 2780 },
    { month: "Jun", sales: 3500 },
    { month: "Jul", sales: 4200 },
  ];

  // Hardcoded Refund Requests
  const refundRequests = [
    {
      id: 201,
      customer: "John Doe",
      orderId: 101,
      amount: 1200,
      status: "requested",
    },
    {
      id: 202,
      customer: "Jane Smith",
      orderId: 102,
      amount: 5400,
      status: "processing",
    },
    {
      id: 203,
      customer: "Alice Johnson",
      orderId: 103,
      amount: 2300,
      status: "requested",
    },
  ];

  // Hardcoded Low Stock Products
  const products = [
    { id: 1, name: "Product A", stock: 12, price: 500 },
    { id: 2, name: "Product B", stock: 2, price: 1200 },
    { id: 3, name: "Product C", stock: 5, price: 750 },
  ];

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-200 text-yellow-800",
    paid: "bg-green-200 text-green-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-600 text-white",
    cancelled: "bg-red-200 text-red-800",
    requested: "bg-purple-200 text-purple-800",
    processing: "bg-orange-200 text-orange-800",
    completed: "bg-green-600 text-white",
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title} className={`${stat.color} text-white`}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Refund Requests */}
      <Card>
        <CardHeader>
          <CardTitle>User Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.customer}</TableCell>
                  <TableCell>{request.orderId}</TableCell>
                  <TableCell>₱ {request.amount}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[request.status]}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    {request.status === "requested" && (
                      <>
                        <button className="rounded bg-green-500 px-2 py-1 text-white">
                          Approve
                        </button>
                        <button className="rounded bg-red-500 px-2 py-1 text-white">
                          Reject
                        </button>
                      </>
                    )}
                    {request.status === "processing" && (
                      <button className="rounded bg-yellow-500 px-2 py-1 text-white">
                        Mark Completed
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.stock <= 5 ? (
                      <Badge className="bg-red-200 text-red-800">
                        {product.stock} - Low Stock
                      </Badge>
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell>₱ {product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
