import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";
import {
    User,
    Lock,
    Building2,
    Bell,
    Save,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

function AdminSettings() {

    const [activeTab, setActiveTab] = useState("profile");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
    });

    const [password, setPassword] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [dealership, setDealership] = useState({
        name: "MagariHub",
        phone: "",
        email: "",
        location: "",
        description: "",
    });

    const [vehicleSettings, setVehicleSettings] = useState({
        default_status: "available",
        currency: "TZS",
    });

    const [notifications, setNotifications] = useState({
        new_vehicle: true,
        vehicle_sold: true,
        vehicle_reserved: true,
        system_updates: true,
    });


    const updateProfile = (name, value) => {
        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const updatePassword = (name, value) => {
        setPassword((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const updateDealership = (name, value) => {
        setDealership((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const updateVehicleSettings = (name, value) => {
        setVehicleSettings((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    const updateNotification = (name) => {
        setNotifications((previous) => ({
            ...previous,
            [name]: !previous[name],
        }));
    };


    const saveSettings = async () => {

        setMessage("");
        setError("");

        try {

            /*
             * Backend API connection will be added here.
             *
             * Example:
             *
             * await updateAdminProfile(profile);
             */

            setMessage("Settings saved successfully.");

            setTimeout(() => {
                setMessage("");
            }, 3000);

        } catch (err) {

            setError(
                err.message ||
                "Failed to save settings."
            );

        }
    };


    const changePassword = async () => {

        setMessage("");
        setError("");

        if (
            !password.current_password ||
            !password.new_password ||
            !password.confirm_password
        ) {
            setError("Please fill in all password fields.");
            return;
        }

        if (
            password.new_password !==
            password.confirm_password
        ) {
            setError("New passwords do not match.");
            return;
        }

        if (password.new_password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        try {

            /*
             * Django password API will be connected here.
             */

            setMessage(
                "Password changed successfully."
            );

            setPassword({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });

        } catch (err) {

            setError(
                err.message ||
                "Failed to change password."
            );

        }
    };


    return (

        <AdminLayout>

            {/* HEADER */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#2F80C0]">
                        MagariHub Admin
                    </p>

                    <h1 className="mt-1 text-3xl font-extrabold text-[#12395B]">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your administrator account and dealership settings.
                    </p>

                </div>

            </header>


            <main className="mx-auto max-w-7xl px-5 py-8 md:px-8">

                {/* SUCCESS */}

                {message && (

                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-4 text-sm font-semibold text-green-600">

                        <CheckCircle2 size={19} />

                        {message}

                    </div>

                )}


                {/* ERROR */}

                {error && (

                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm font-semibold text-red-600">

                        <AlertCircle size={19} />

                        {error}

                    </div>

                )}


                <div className="grid gap-8 lg:grid-cols-[250px_1fr]">


                    {/* SIDEBAR */}

                    <aside className="h-fit rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">

                        <SettingsTab
                            icon={User}
                            label="Profile"
                            active={activeTab === "profile"}
                            onClick={() =>
                                setActiveTab("profile")
                            }
                        />

                        <SettingsTab
                            icon={Lock}
                            label="Security"
                            active={activeTab === "security"}
                            onClick={() =>
                                setActiveTab("security")
                            }
                        />

                        <SettingsTab
                            icon={Building2}
                            label="Dealership"
                            active={activeTab === "dealership"}
                            onClick={() =>
                                setActiveTab("dealership")
                            }
                        />

                        <SettingsTab
                            icon={Bell}
                            label="Notifications"
                            active={activeTab === "notifications"}
                            onClick={() =>
                                setActiveTab("notifications")
                            }
                        />

                    </aside>


                    {/* CONTENT */}

                    <section className="rounded-2xl border border-blue-100 bg-white shadow-sm">


                        {/* PROFILE */}

                        {activeTab === "profile" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeader
                                    title="Admin Profile"
                                    description="Update your administrator account information."
                                />

                                <div className="mt-8 grid gap-5 md:grid-cols-2">

                                    <Input
                                        label="First Name"
                                        value={profile.first_name}
                                        onChange={(e) =>
                                            updateProfile(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="First name"
                                    />

                                    <Input
                                        label="Last Name"
                                        value={profile.last_name}
                                        onChange={(e) =>
                                            updateProfile(
                                                "last_name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Last name"
                                    />

                                    <Input
                                        label="Username"
                                        value={profile.username}
                                        onChange={(e) =>
                                            updateProfile(
                                                "username",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Username"
                                    />

                                    <Input
                                        label="Email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            updateProfile(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="admin@example.com"
                                    />

                                </div>

                                <SaveButton
                                    onClick={saveSettings}
                                />

                            </div>

                        )}


                        {/* SECURITY */}

                        {activeTab === "security" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeader
                                    title="Security"
                                    description="Change your administrator password."
                                />

                                <div className="mt-8 max-w-xl space-y-5">

                                    <PasswordInput
                                        label="Current Password"
                                        value={
                                            password.current_password
                                        }
                                        show={showCurrent}
                                        setShow={setShowCurrent}
                                        onChange={(e) =>
                                            updatePassword(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <PasswordInput
                                        label="New Password"
                                        value={
                                            password.new_password
                                        }
                                        show={showNew}
                                        setShow={setShowNew}
                                        onChange={(e) =>
                                            updatePassword(
                                                "new_password",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <PasswordInput
                                        label="Confirm New Password"
                                        value={
                                            password.confirm_password
                                        }
                                        show={showConfirm}
                                        setShow={setShowConfirm}
                                        onChange={(e) =>
                                            updatePassword(
                                                "confirm_password",
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                                <button
                                    onClick={changePassword}
                                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#12395B] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0]"
                                >

                                    <Lock size={18} />

                                    Change Password

                                </button>

                            </div>

                        )}


                        {/* DEALERSHIP */}

                        {activeTab === "dealership" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeader
                                    title="Dealership Information"
                                    description="Manage the information displayed throughout MagariHub."
                                />

                                <div className="mt-8 grid gap-5 md:grid-cols-2">

                                    <Input
                                        label="Business Name"
                                        value={dealership.name}
                                        onChange={(e) =>
                                            updateDealership(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <Input
                                        label="Phone"
                                        value={dealership.phone}
                                        onChange={(e) =>
                                            updateDealership(
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="+255..."
                                    />

                                    <Input
                                        label="Business Email"
                                        value={dealership.email}
                                        onChange={(e) =>
                                            updateDealership(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="info@magarihub.com"
                                    />

                                    <Input
                                        label="Location"
                                        value={dealership.location}
                                        onChange={(e) =>
                                            updateDealership(
                                                "location",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Dar es Salaam, Tanzania"
                                    />

                                </div>

                                <div className="mt-5">

                                    <label className="mb-2 block text-sm font-bold text-[#12395B]">
                                        Business Description
                                    </label>

                                    <textarea
                                        value={
                                            dealership.description
                                        }
                                        onChange={(e) =>
                                            updateDealership(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        rows="5"
                                        placeholder="Tell customers about your dealership..."
                                        className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
                                    />

                                </div>


                                <div className="mt-8 border-t border-blue-50 pt-7">

                                    <h3 className="font-extrabold text-[#12395B]">
                                        Vehicle Defaults
                                    </h3>

                                    <div className="mt-5 grid gap-5 md:grid-cols-2">

                                        <Select
                                            label="Default Vehicle Status"
                                            value={
                                                vehicleSettings.default_status
                                            }
                                            onChange={(e) =>
                                                updateVehicleSettings(
                                                    "default_status",
                                                    e.target.value
                                                )
                                            }
                                            options={[
                                                ["available", "Available"],
                                                ["draft", "Draft"],
                                                ["reserved", "Reserved"],
                                            ]}
                                        />

                                        <Select
                                            label="Currency"
                                            value={
                                                vehicleSettings.currency
                                            }
                                            onChange={(e) =>
                                                updateVehicleSettings(
                                                    "currency",
                                                    e.target.value
                                                )
                                            }
                                            options={[
                                                ["TZS", "Tanzanian Shilling (TZS)"],
                                                ["USD", "US Dollar (USD)"],
                                            ]}
                                        />

                                    </div>

                                </div>

                                <SaveButton
                                    onClick={saveSettings}
                                />

                            </div>

                        )}


                        {/* NOTIFICATIONS */}

                        {activeTab === "notifications" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeader
                                    title="Notifications"
                                    description="Choose which admin notifications you want to receive."
                                />

                                <div className="mt-8 space-y-3">

                                    <NotificationRow
                                        title="New Vehicle Added"
                                        description="Notify me when a vehicle is added to inventory."
                                        checked={
                                            notifications.new_vehicle
                                        }
                                        onChange={() =>
                                            updateNotification(
                                                "new_vehicle"
                                            )
                                        }
                                    />

                                    <NotificationRow
                                        title="Vehicle Sold"
                                        description="Notify me when a vehicle is marked as sold."
                                        checked={
                                            notifications.vehicle_sold
                                        }
                                        onChange={() =>
                                            updateNotification(
                                                "vehicle_sold"
                                            )
                                        }
                                    />

                                    <NotificationRow
                                        title="Vehicle Reserved"
                                        description="Notify me when a customer reserves a vehicle."
                                        checked={
                                            notifications.vehicle_reserved
                                        }
                                        onChange={() =>
                                            updateNotification(
                                                "vehicle_reserved"
                                            )
                                        }
                                    />

                                    <NotificationRow
                                        title="System Updates"
                                        description="Receive important MagariHub system updates."
                                        checked={
                                            notifications.system_updates
                                        }
                                        onChange={() =>
                                            updateNotification(
                                                "system_updates"
                                            )
                                        }
                                    />

                                </div>

                                <SaveButton
                                    onClick={saveSettings}
                                />

                            </div>

                        )}

                    </section>

                </div>

            </main>

        </AdminLayout>
    );
}


/* ========================================================= */
/* COMPONENTS */
/* ========================================================= */

function SettingsTab({
    icon: Icon,
    label,
    active,
    onClick,
}) {

    return (

        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold transition ${
                active
                    ? "bg-[#EAF6FF] text-[#2F80C0]"
                    : "text-slate-500 hover:bg-[#F5F9FC] hover:text-[#12395B]"
            }`}
        >

            <Icon size={19} />

            {label}

        </button>
    );
}


function SettingsHeader({
    title,
    description,
}) {

    return (

        <div className="border-b border-blue-50 pb-6">

            <h2 className="text-2xl font-extrabold text-[#12395B]">
                {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>

        </div>
    );
}


function Input({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#12395B]">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
            />

        </div>
    );
}


function PasswordInput({
    label,
    value,
    show,
    setShow,
    onChange,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#12395B]">
                {label}
            </label>

            <div className="relative">

                <input
                    type={
                        show
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#2F80C0] focus:ring-4 focus:ring-blue-100"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(!show)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2F80C0]"
                >

                    {show
                        ? <EyeOff size={18} />
                        : <Eye size={18} />
                    }

                </button>

            </div>

        </div>
    );
}


function Select({
    label,
    value,
    onChange,
    options,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#12395B]">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3 text-sm font-semibold text-[#12395B] outline-none focus:border-[#2F80C0]"
            >

                {options.map(
                    ([value, label]) => (

                        <option
                            key={value}
                            value={value}
                        >
                            {label}
                        </option>

                    )
                )}

            </select>

        </div>
    );
}


function SaveButton({
    onClick,
}) {

    return (

        <button
            onClick={onClick}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#12395B] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0]"
        >

            <Save size={18} />

            Save Changes

        </button>
    );
}


function NotificationRow({
    title,
    description,
    checked,
    onChange,
}) {

    return (

        <div className="flex items-center justify-between gap-5 rounded-xl border border-blue-50 bg-[#F8FCFF] p-4">

            <div>

                <p className="font-bold text-[#12395B]">
                    {title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    {description}
                </p>

            </div>

            <button
                onClick={onChange}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-[#2F80C0]"
                        : "bg-slate-300"
                }`}
            >

                <span
                    className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
                        checked
                            ? "left-6"
                            : "left-1"
                    }`}
                />

            </button>

        </div>
    );
}


export default AdminSettings;