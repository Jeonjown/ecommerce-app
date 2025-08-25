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
import {
  useDashboardStats,
  useMonthlySales,
  useLowStockProducts,
} from "@/hooks/useStats";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: salesData, isLoading: salesLoading } = useMonthlySales();
  const { data: products, isLoading: productsLoading } = useLowStockProducts(5);

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Order Status Stats */}
      {statsLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link to={"/admin/orders"}>
              <Card className="bg-yellow-500 text-white">
                <CardHeader>
                  <CardTitle>Pending Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats?.pendingOrders}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to={"/admin/orders"}>
              <Card className="bg-red-500 text-white">
                <CardHeader>
                  <CardTitle>Cancelled Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats?.cancelledOrders}</p>
                </CardContent>
              </Card>
            </Link>
            <Link to={"/admin/orders"}>
              <Card className="bg-purple-500 text-white">
                <CardHeader>
                  <CardTitle>Refund Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats?.refundRequests}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </>
      )}

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Net Sales (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <p>Loading sales data...</p>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData?.map((item) => ({
                    ...item,
                    sales: Number(item.sales).toFixed(2),
                  }))}
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
          )}
        </CardContent>
      </Card>

      {/* Totals Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ₱ {Number(stats?.totalSales ?? 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalOrders}</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products */}
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent>
          {productsLoading ? (
            <p>Loading products...</p>
          ) : (
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
                {products?.map((product) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
