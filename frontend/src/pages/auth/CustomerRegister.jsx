import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlus,
    Eye,
    EyeOff,
    Loader2,
    CheckCircle2,
    AlertCircle,
    CarFront,
} from "lucide-react";

import { registerCustomer } from "../../services/customerAuthService";


function CustomerRegister() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirm: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setError("");
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (form.password !== form.password_confirm) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        if (form.password.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }

        try {

            setLoading(true);

            await registerCustomer(form);

            setSuccess(
                "Your account has been created successfully."
            );

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        } catch (err) {

            setError(
                err.message ||
                "Registration failed."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="min-h-screen bg-[#F5F9FC]">


            {/* HEADER */}

            <header className="border-b border-blue-100 bg-white">

                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">

                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#12395B] text-white">

                            <CarFront size={22} />

                        </div>

                        <span className="text-xl font-extrabold text-[#12395B]">
                            Magari<span className="text-[#2F80C0]">Hub</span>
                        </span>

                    </Link>


                    <Link
                        to="/login"
                        className="text-sm font-bold text-[#2F80C0] hover:text-[#12395B]"
                    >
                        Already have an account?
                    </Link>

                </div>

            </header>


            {/* REGISTER */}

            <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-10">

                <div className="w-full max-w-2xl">


                    {/* TITLE */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF6FF]">

                            <UserPlus
                                size={30}
                                className="text-[#2F80C0]"
                            />

                        </div>

                        <h1 className="mt-5 text-3xl font-extrabold text-[#12395B] md:text-4xl">
                            Create your account
                        </h1>

                        <p className="mt-2 text-slate-500">
                            Join MagariHub and start exploring quality vehicles.
                        </p>

                    </div>


                    {/* CARD */}

                    <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-[0_20px_60px_rgba(18,57,91,0.08)] md:p-8">


                        {/* ERROR */}

                        {error && (

                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-600">

                                <AlertCircle
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {error}
                                </span>

                            </div>

                        )}


                        {/* SUCCESS */}

                        {success && (

                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-600">

                                <CheckCircle2
                                    size={19}
                                    className="mt-0.5 shrink-0"
                                />

                                <span>
                                    {success}
                                </span>

                            </div>

                        )}


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* NAME */}

                            <div className="grid gap-5 md:grid-cols-2">

                                <Input
                                    label="First Name"
                                    name="first_name"
                                    value={form.first_name}
                                    onChange={handleChange}
                                    placeholder="John"
                                    required
                                />

                                <Input
                                    label="Last Name"
                                    name="last_name"
                                    value={form.last_name}
                                    onChange={handleChange}
                                    placeholder="Mange"
                                    required
                                />

                            </div>


                            {/* USERNAME */}

                            <Input
                                label="Username"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                placeholder="smilingvyrus"
                                required
                            />


                            {/* EMAIL */}

                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="johnmange@example.com"
                                required
                            />


                            {/* PASSWORD */}

                            <PasswordInput
                                label="Password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                show={showPassword}
                                setShow={setShowPassword}
                                required
                            />


                            {/* CONFIRM PASSWORD */}

                            <PasswordInput
                                label="Confirm Password"
                                name="password_confirm"
                                value={form.password_confirm}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                                show={showConfirmPassword}
                                setShow={setShowConfirmPassword}
                                required
                            />


                            {/* BUTTON */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#12395B] py-4 font-extrabold text-white shadow-lg shadow-blue-900/10 transition hover:bg-[#2F80C0] disabled:cursor-not-allowed disabled:opacity-60"
                            >

                                {loading ? (

                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Creating account...
                                    </>

                                ) : (

                                    <>
                                        <UserPlus size={19} />

                                        Create Account
                                    </>

                                )}

                            </button>

                        </form>


                        {/* LOGIN */}

                        <p className="mt-7 text-center text-sm text-slate-500">

                            Already have an account?{" "}

                            <Link
                                to="/login"
                                className="font-extrabold text-[#2F80C0] hover:text-[#12395B]"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Reusable Input
|--------------------------------------------------------------------------
*/

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required,
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-bold text-[#12395B]">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 text-sm text-[#12395B] outline-none transition placeholder:text-slate-400 focus:border-[#2F80C0] focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Password Input
|--------------------------------------------------------------------------
*/

function PasswordInput({
    label,
    name,
    value,
    onChange,
    placeholder,
    show,
    setShow,
    required,
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
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full rounded-xl border border-blue-100 bg-[#F5F9FC] px-4 py-3.5 pr-12 text-sm text-[#12395B] outline-none transition placeholder:text-slate-400 focus:border-[#2F80C0] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <button
                    type="button"
                    onClick={() =>
                        setShow(!show)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#2F80C0]"
                >

                    {show ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}

                </button>

            </div>

        </div>
    );
}


export default CustomerRegister;