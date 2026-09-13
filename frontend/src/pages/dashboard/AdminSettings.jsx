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
        name: "Bingwa Magari Used",
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

            {/* HEADER - DEEP REDISH */}

            <header className="border-b border-[#8B1A1A]/20 bg-white">

                <div className="mx-auto max-w-7xl px-5 py-7 md:px-8">

                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                        Bingwa Magari Used Admin
                    </p>

                    <h1 className="mt-1 text-3xl font-extrabold text-[#2D1B0E]">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-[#6A5A4A]">
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


                    {/* SIDEBAR - DEEP REDISH */}

                    <aside className="h-fit rounded-2xl border border-[#8B1A1A]/20 bg-white p-3 shadow-sm">

                        <SettingsTabRed
                            icon={User}
                            label="Profile"
                            active={activeTab === "profile"}
                            onClick={() =>
                                setActiveTab("profile")
                            }
                        />

                        <SettingsTabRed
                            icon={Lock}
                            label="Security"
                            active={activeTab === "security"}
                            onClick={() =>
                                setActiveTab("security")
                            }
                        />

                        <SettingsTabRed
                            icon={Building2}
                            label="Dealership"
                            active={activeTab === "dealership"}
                            onClick={() =>
                                setActiveTab("dealership")
                            }
                        />

                        <SettingsTabRed
                            icon={Bell}
                            label="Notifications"
                            active={activeTab === "notifications"}
                            onClick={() =>
                                setActiveTab("notifications")
                            }
                        />

                    </aside>


                    {/* CONTENT */}

                    <section className="rounded-2xl border border-[#8B1A1A]/20 bg-white shadow-sm">


                        {/* PROFILE */}

                        {activeTab === "profile" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeaderRed
                                    title="Admin Profile"
                                    description="Update your administrator account information."
                                />

                                <div className="mt-8 grid gap-5 md:grid-cols-2">

                                    <InputRed
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

                                    <InputRed
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

                                    <InputRed
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

                                    <InputRed
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

                                <SaveButtonRed
                                    onClick={saveSettings}
                                />

                            </div>

                        )}


                        {/* SECURITY */}

                        {activeTab === "security" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeaderRed
                                    title="Security"
                                    description="Change your administrator password."
                                />

                                <div className="mt-8 max-w-xl space-y-5">

                                    <PasswordInputRed
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

                                    <PasswordInputRed
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

                                    <PasswordInputRed
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
                                    className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
                                >

                                    <Lock size={18} />

                                    Change Password

                                </button>

                            </div>

                        )}


                        {/* DEALERSHIP */}

                        {activeTab === "dealership" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeaderRed
                                    title="Dealership Information"
                                    description="Manage the information displayed throughout Bingwa Magari Used."
                                />

                                <div className="mt-8 grid gap-5 md:grid-cols-2">

                                    <InputRed
                                        label="Business Name"
                                        value={dealership.name}
                                        onChange={(e) =>
                                            updateDealership(
                                                "name",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputRed
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

                                    <InputRed
                                        label="Business Email"
                                        value={dealership.email}
                                        onChange={(e) =>
                                            updateDealership(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="info@bingwamagari.com"
                                    />

                                    <InputRed
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

                                    <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
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
                                        className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                                    />

                                </div>


                                <div className="mt-8 border-t border-[#8B1A1A]/10 pt-7">

                                    <h3 className="font-extrabold text-[#2D1B0E]">
                                        Vehicle Defaults
                                    </h3>

                                    <div className="mt-5 grid gap-5 md:grid-cols-2">

                                        <SelectRed
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

                                        <SelectRed
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

                                <SaveButtonRed
                                    onClick={saveSettings}
                                />

                            </div>

                        )}


                        {/* NOTIFICATIONS */}

                        {activeTab === "notifications" && (

                            <div className="p-6 md:p-8">

                                <SettingsHeaderRed
                                    title="Notifications"
                                    description="Choose which admin notifications you want to receive."
                                />

                                <div className="mt-8 space-y-3">

                                    <NotificationRowRed
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

                                    <NotificationRowRed
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

                                    <NotificationRowRed
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

                                    <NotificationRowRed
                                        title="System Updates"
                                        description="Receive important system updates."
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

                                <SaveButtonRed
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
/* COMPONENTS - DEEP REDISH */
/* ========================================================= */

function SettingsTabRed({
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
                    ? "bg-[#8B1A1A]/10 text-[#8B1A1A]"
                    : "text-[#6A5A4A] hover:bg-[#FDF8F5] hover:text-[#2D1B0E]"
            }`}
        >

            <Icon size={19} />

            {label}

        </button>
    );
}


function SettingsHeaderRed({
    title,
    description,
}) {

    return (

        <div className="border-b border-[#8B1A1A]/10 pb-6">

            <h2 className="text-2xl font-extrabold text-[#2D1B0E]">
                {title}
            </h2>

            <p className="mt-1 text-sm text-[#6A5A4A]">
                {description}
            </p>

        </div>
    );
}


function InputRed({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
            />

        </div>
    );
}


function PasswordInputRed({
    label,
    value,
    show,
    setShow,
    onChange,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
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
                    className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(!show)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#8B1A1A]"
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


function SelectRed({
    label,
    value,
    onChange,
    options,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-[#8B1A1A]/20 bg-[#FDF8F5] px-4 py-3 text-sm font-semibold text-[#2D1B0E] outline-none focus:border-[#8B1A1A] focus:ring-4 focus:ring-[#8B1A1A]/10"
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


function SaveButtonRed({
    onClick,
}) {

    return (

        <button
            onClick={onClick}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#8B1A1A] px-6 py-3.5 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:bg-[#6B1515] hover:shadow-xl hover:shadow-[#8B1A1A]/30"
        >

            <Save size={18} />

            Save Changes

        </button>
    );
}


function NotificationRowRed({
    title,
    description,
    checked,
    onChange,
}) {

    return (

        <div className="flex items-center justify-between gap-5 rounded-xl border border-[#8B1A1A]/10 bg-[#FDF8F5] p-4">

            <div>

                <p className="font-bold text-[#2D1B0E]">
                    {title}
                </p>

                <p className="mt-1 text-sm text-[#6A5A4A]">
                    {description}
                </p>

            </div>

            <button
                onClick={onChange}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                    checked
                        ? "bg-[#8B1A1A]"
                        : "bg-[#D4A8A8]"
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