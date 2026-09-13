
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ShoppingCart,
    User,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import {
    isCustomerAuthenticated,
    logoutCustomer,
    getCurrentCustomer,
} from "../services/customerAuthService";

import { getCart } from "../services/cartService";

import LanguageSwitcher from "./LanguageSwitcher";
import magarilogo from "../assets/magarilogo.png";

function Navbar() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [authenticated, setAuthenticated] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    // ============================================================
    // LOAD AUTHENTICATION + CUSTOMER + CART
    // ============================================================

    const loadNavbarData = async () => {
        const loggedIn = isCustomerAuthenticated();

        setAuthenticated(loggedIn);

        if (!loggedIn) {
            setCustomer(null);
            setCartCount(0);
            return;
        }

        // --------------------------------------------------------
        // CURRENT CUSTOMER
        // --------------------------------------------------------

        try {
            const currentCustomer = await getCurrentCustomer();

            if (currentCustomer) {
                setCustomer(currentCustomer);
            }
        } catch (error) {
            console.error("Failed to load customer:", error);
        }

        // --------------------------------------------------------
        // CART
        // --------------------------------------------------------

        try {
            const cart = await getCart();

            setCartCount(Number(cart?.item_count || 0));
        } catch (error) {
            console.error("Failed to load cart count:", error);
            setCartCount(0);
        }
    };

    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {
        loadNavbarData();

        const handleAuthChange = () => {
            loadNavbarData();
        };

        window.addEventListener(
            "customer-auth-changed",
            handleAuthChange
        );

        return () => {
            window.removeEventListener(
                "customer-auth-changed",
                handleAuthChange
            );
        };
    }, []);

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = async () => {
        try {
            setLoggingOut(true);

            logoutCustomer();

            setAuthenticated(false);
            setCustomer(null);
            setCartCount(0);

            window.dispatchEvent(
                new Event("customer-auth-changed")
            );

            setMobileMenu(false);

            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    // ============================================================
    // CUSTOMER NAME
    // ============================================================

    const getCustomerName = () => {
        if (!customer) {
            return t("nav.account");
        }

        return (
            customer.first_name ||
            customer.username ||
            customer.email ||
            t("nav.account")
        );
    };

    // ============================================================
    // CLOSE MOBILE MENU
    // ============================================================

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 shadow-sm backdrop-blur">

            {/* ==================================================
                MAIN NAVBAR
            ================================================== */}

            <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-3 md:px-4">

                {/* ==================================================
                    LOGO + BRAND
                ================================================== */}

                <Link
                    to="/"
                    className="flex items-center gap-2"
                    onClick={closeMobileMenu}
                >
                    {/* Logo */}
                    <div className="h-14 w-14 flex-shrink-0">
                        <img
                            src={magarilogo}
                            alt="Bingwa Magari Used Logo"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Brand Text */}
                    <div className="flex flex-col leading-tight">
                        <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
                            <span className="text-[#0B1E2E]">
                                Bingwa Wa
                            </span>

                            <span className="ml-1 text-[#D4A853]">
                                Magari Used
                            </span>
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A853]">
                            Used Cars
                        </span>
                    </div>
                </Link>

                {/* ==================================================
                    DESKTOP NAVIGATION
                ================================================== */}

                <nav className="hidden items-center gap-6 md:flex">

                    {/* HOME */}

                    <Link
                        to="/"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        {t("nav.home")}
                    </Link>

                    {/* BUY */}

                    <Link
                        to="/vehicles"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        {t("nav.buy")}
                    </Link>

                    {/* SELL */}

                    <Link
                        to="/vehicles/sellcar"
                        className="text-sm font-semibold text-slate-600 transition hover:text-[#2F80C0]"
                    >
                        {t("nav.sell")}
                    </Link>

                    {/* ==================================================
                        LANGUAGE SWITCHER
                    ================================================== */}

                    <LanguageSwitcher />

                    {/* ==================================================
                        VIEW CART — ALWAYS VISIBLE
                    ================================================== */}

                    <Link
                        to="/cart"
                        className="relative flex items-center gap-2 text-sm font-bold text-[#12395B] transition hover:text-[#2F80C0]"
                    >
                        <ShoppingCart size={19} />

                        <span>
                            {t("nav.viewCart")}
                        </span>

                        {cartCount > 0 && (
                            <span className="absolute -right-4 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2F80C0] px-1 text-[10px] font-black text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* ==================================================
                        ORDERS
                    ================================================== */}

                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF] hover:text-[#2F80C0]"
                    >
                        {t("nav.viewOrders")}
                    </Link>

                    {/* ==================================================
                        AUTHENTICATED CUSTOMER
                    ================================================== */}

                    {authenticated ? (
                        <>
                            {/* ACCOUNT */}

                            <Link
                                to="/account"
                                className="flex items-center gap-2 text-sm font-bold text-[#12395B] transition hover:text-[#2F80C0]"
                            >
                                <User size={18} />

                                <span>
                                    {getCustomerName()}
                                </span>
                            </Link>

                            {/* LOGOUT */}

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loggingOut}
                                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LogOut size={17} />

                                {loggingOut
                                    ? t("nav.loggingOut")
                                    : t("nav.logout")}
                            </button>
                        </>
                    ) : (
                        <>
                            {/* ==================================================
                                GUEST
                            ================================================== */}

                            {/* LOGIN */}

                            <Link
                                to="/login"
                                className="text-sm font-bold text-[#12395B] transition hover:text-[#2F80C0]"
                            >
                                {t("nav.login")}
                            </Link>

                            {/* REGISTER */}

                            <Link
                                to="/register"
                                className="rounded-xl bg-[#12395B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2F80C0]"
                            >
                                {t("nav.register")}
                            </Link>
                        </>
                    )}
                </nav>

                {/* ==================================================
                    MOBILE MENU BUTTON
                ================================================== */}

                <button
                    type="button"
                    onClick={() =>
                        setMobileMenu((value) => !value)
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 text-[#12395B] md:hidden"
                    aria-label={
                        mobileMenu
                            ? "Close menu"
                            : "Open menu"
                    }
                >
                    {mobileMenu ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>
            </div>

            {/* ======================================================
                MOBILE NAVIGATION
            ======================================================= */}

            {mobileMenu && (
                <div className="border-t border-blue-100 bg-white px-5 py-5 md:hidden">

                    <nav className="flex flex-col gap-2">

                        {/* LANGUAGE */}

                        <div className="mb-2 border-b border-blue-100 pb-4">
                            <LanguageSwitcher />
                        </div>

                        {/* HOME */}

                        <Link
                            to="/"
                            onClick={closeMobileMenu}
                            className="rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                        >
                            {t("nav.home")}
                        </Link>

                        {/* BUY / VEHICLES */}

                        <Link
                            to="/vehicles"
                            onClick={closeMobileMenu}
                            className="rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                        >
                            {t("nav.vehicles")}
                        </Link>

                        {/* SELL */}

                        <Link
                            to="/vehicles/sellcar"
                            onClick={closeMobileMenu}
                            className="rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                        >
                            {t("nav.sell")}
                        </Link>

                        {/* VIEW ORDERS */}

                        <Link
                            to="/orders"
                            onClick={closeMobileMenu}
                            className="rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                        >
                            {t("nav.viewOrders")}
                        </Link>

                        {/* ==================================================
                            MOBILE VIEW CART — ALWAYS VISIBLE
                        ================================================== */}

                        <Link
                            to="/cart"
                            onClick={closeMobileMenu}
                            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                        >
                            <span className="flex items-center gap-3">
                                <ShoppingCart size={19} />

                                {t("nav.viewCart")}
                            </span>

                            {cartCount > 0 && (
                                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#2F80C0] px-1.5 text-xs font-black text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="my-2 border-t border-blue-100" />

                        {/* ==================================================
                            AUTHENTICATED CUSTOMER
                        ================================================== */}

                        {authenticated ? (
                            <>
                                {/* ACCOUNT */}

                                <Link
                                    to="/account"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                                >
                                    <User size={19} />

                                    {getCustomerName()}
                                </Link>

                                {/* LOGOUT */}

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={loggingOut}
                                    className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-500 transition hover:bg-red-100 disabled:opacity-60"
                                >
                                    <LogOut size={19} />

                                    {loggingOut
                                        ? t("nav.loggingOut")
                                        : t("nav.logout")}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* LOGIN */}

                                <Link
                                    to="/login"
                                    onClick={closeMobileMenu}
                                    className="rounded-xl px-4 py-3 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
                                >
                                    {t("nav.login")}
                                </Link>

                                {/* REGISTER */}

                                <Link
                                    to="/register"
                                    onClick={closeMobileMenu}
                                    className="rounded-xl bg-[#12395B] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#2F80C0]"
                                >
                                    {t("nav.register")}
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;
