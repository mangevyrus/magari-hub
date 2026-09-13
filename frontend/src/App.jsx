
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminSettings from "./pages/dashboard/AdminSettings";
import Home from "./pages/home/Home";
import Vehicles from "./pages/vehicles/Vehicles";
import VehicleDetails from "./pages/vehicles/VehicleDetails";

import AdminLogin from "./pages/auth/AdminLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";
import CustomerLogin from "./pages/auth/CustomerLogin";
import ChangePassword from "./pages/account/ChangePassword";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AddVehicle from "./pages/dashboard/AddVehicle";
import AdminVehicles from "./pages/dashboard/AdminVehicles";
import EditVehicle from "./pages/dashboard/EditVehicle";
import Analytics from "./pages/dashboard/Analytics";
import Inquiries from "./pages/account/Inquiries";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Account from "./pages/account/Account";
import AdminInquiries from "./pages/dashboard/AdminInquiries";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Orders from "./pages/account/Orders"; 
import OrderDetails from "./pages/account/OrderDetails";
import AdminOrderDetails from "./pages/dashboard/AdminOrderDetails";
import AdminOrders from "./pages/dashboard/AdminOrders";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminUserDetails from "./pages/dashboard/AdminUserDetails";
import AdminBrands from "./pages/dashboard/AdminBrands";
import AccountSettings from "./pages/account/AccountSettings";
import SellCar from "./pages/vehicles/SellCar";
import Footer from "./components/Footer";
function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ================================================= */}
                {/* PUBLIC ROUTES */}
                {/* ================================================= */}
<Route path="/vehicles/sellcar" element={<SellCar />} />
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/vehicles"
                    element={<Vehicles />}
                />

                <Route
                    path="/vehicles/:id"
                    element={<VehicleDetails />}
                />

                {/* ================================================= */}
                {/* CUSTOMER AUTH ROUTES */}
                {/* ================================================= */}

                <Route
                    path="/login"
                    element={<CustomerLogin />}
                />

                <Route
                    path="/register"
                    element={<CustomerRegister />}
                />

                {/* ================================================= */}
                {/* CUSTOMER ACCOUNT */}
                {/* ================================================= */}

                <Route
                    path="/account"
                    element={<Account />}
                />
<Route
    path="/account/inquiries"
    element={<Inquiries />}
/>

<Route
    path="/account/settings"
    element={<AccountSettings />}
/>

<Route
    path="/account/change-password"
    element={<ChangePassword />}
/>

<Route
    path="/cart"
    element={<Cart />}
/>

<Route
    path="/checkout"
    element={<Checkout />}
/>

<Route
    path="/orders"
    element={<Orders />}
/>

<Route
    path="/orders/:id"
    element={<OrderDetails />}
/>


                {/* ================================================= */}
                {/* ADMIN LOGIN */}
                {/* ================================================= */}

                <Route
                    path="/admin/login"
                    element={<AdminLogin />}
                />

                {/* ================================================= */}
                {/* PROTECTED ADMIN ROUTES */}
                {/* ================================================= */}

                <Route element={<ProtectedAdminRoute />}>

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/vehicles"
                        element={<AdminVehicles />}
                    />

                    <Route
                        path="/admin/vehicles/new"
                        element={<AddVehicle />}
                    />

                    <Route
                        path="/admin/vehicles/:id/edit"
                        element={<EditVehicle />}
                    />

                    <Route
                        path="/admin/analytics"
                        element={<Analytics />}
                    />

                    <Route
                        path="/admin/orders"
                        element={<AdminOrders />}
                    />

                                        
                    <Route
                        path="/admin/brands"
                        element={<AdminBrands />}
                    />


<Route
    path="/admin/users"
    element={<AdminUsers />}
/>

<Route
    path="/admin/users/:id"
    element={<AdminUserDetails />}
/>

<Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
                    <Route
                        path="/admin/settings"
                        element={<AdminSettings />}
                    />

                </Route>

<Route
    path="/admin/inquiries"
    element={<AdminInquiries />}
/>
            </Routes>
         <Footer /> 
        </BrowserRouter>
    );
}

export default App;

