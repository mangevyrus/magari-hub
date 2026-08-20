import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminSettings from "./pages/dashboard/AdminSettings";
import Home from "./pages/home/Home";
import Vehicles from "./pages/vehicles/Vehicles";
import VehicleDetails from "./pages/vehicles/VehicleDetails";

import AdminLogin from "./pages/auth/AdminLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AddVehicle from "./pages/dashboard/AddVehicle";
import AdminVehicles from "./pages/dashboard/AdminVehicles";
import EditVehicle from "./pages/dashboard/EditVehicle";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Analytics from "./pages/dashboard/Analytics";
import CustomerLogin from "./pages/auth/CustomerLogin";
function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ================================================= */}
                {/* PUBLIC ROUTES */}
                {/* ================================================= */}

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
    path="/admin/settings"
    element={<AdminSettings />}
/>

<Route
    path="/register"
    element={<CustomerRegister />}
/>

<Route
    path="/login"
    element={<CustomerLogin />}
/>

                </Route>


            </Routes>

        </BrowserRouter>

    );

}


export default App;