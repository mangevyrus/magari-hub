
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    const linkClass =
        "group relative inline-block text-sm text-[#CDBCAF] transition-all duration-300 hover:translate-x-1 hover:text-[#F4A460]";

    return (
        <footer className="relative overflow-hidden bg-[#2D1B0E] text-[#FDF8F5]">

            {/* Decorative animated glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 animate-pulse rounded-full bg-[#B22222]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 animate-pulse rounded-full bg-[#F4A460]/10 blur-3xl" />

            {/* Main Footer */}
            <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="group">
                        <Link
                            to="/"
                            className="inline-block text-xl font-black tracking-tight text-[#F4A460] transition-all duration-300 hover:scale-105"
                        >
                            Bingwa Wa Magari Used
                        </Link>

                        <div className="mt-3 h-0.5 w-10 rounded-full bg-[#B22222] transition-all duration-500 group-hover:w-20" />

                        <p className="mt-4 max-w-xs text-sm leading-6 text-[#BFAEA1]">
                            {t("footer.description")}
                        </p>

                        {/* Social */}
                        <div className="mt-5">
                            <a
                                href="#"
                                aria-label="Instagram"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#6A5A4A] text-base font-bold text-[#D8C7B8] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:border-[#F4A460] hover:bg-[#F4A460] hover:text-[#2D1B0E]"
                            >
                                ◎
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4A460]">
                            {t("footer.quickLinks")}
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <Link to="/" className={linkClass}>
                                    {t("nav.home")}
                                    <span className="absolute bottom-0 left-0 h-px w-0 bg-[#F4A460] transition-all duration-300 group-hover:w-full" />
                                </Link>
                            </li>

                            <li>
                                <Link to="/vehicles" className={linkClass}>
                                    {t("nav.vehicles")}
                                </Link>
                            </li>

                            <li>
                                <Link to="/account" className={linkClass}>
                                    {t("nav.account")}
                                </Link>
                            </li>

                            <li>
                                <Link to="/cart" className={linkClass}>
                                    {t("nav.cart")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4A460]">
                            {t("footer.customer")}
                        </h3>

                        <ul className="mt-4 space-y-2.5">
                            <li>
                                <Link to="/account" className={linkClass}>
                                    {t("footer.myAccount")}
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/account/inquiries"
                                    className={linkClass}
                                >
                                    {t("footer.myInquiries")}
                                </Link>
                            </li>

                            <li>
                                <Link to="/orders" className={linkClass}>
                                    {t("footer.myOrders")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#F4A460]">
                            {t("footer.contact")}
                        </h3>

                        <div className="mt-4 space-y-3 text-sm text-[#CDBCAF]">

                            <a
                                href="tel:+255000000000"
                                className="block transition-all duration-300 hover:translate-x-1 hover:text-[#F4A460]"
                            >
                                <span className="mr-2 text-[#F4A460]">✆</span>
                                +255 711 398 600
                            </a>

                            <a
                                href="mailto:info@bingwamagari.com"
                                className="block transition-all duration-300 hover:translate-x-1 hover:text-[#F4A460]"
                            >
                                <span className="mr-2 text-[#F4A460]">✉</span>
                                info@bingwamagari.com
                            </a>

                            <p className="text-[#BFAEA1]">
                                <span className="mr-2 text-[#F4A460]">⌖</span>
                                Tanzania
                            </p>
                        </div>
                    </div>
                </div>
            </div>

{/* Floating WhatsApp Button */}
<a
    href="https://wa.me/255711398600"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat with us on WhatsApp"
    className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl sm:bottom-7 sm:right-7"
>
    {/* Pulse animation */}
    <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50" />

    {/* WhatsApp icon */}
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-7 w-7"
        aria-hidden="true"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982 1-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.002 5.45-4.437 9.884-9.887 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.304-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.478-8.413" />
    </svg>

    {/* Tooltip */}
    <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-[#2D1B0E] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 sm:block">
        Chat on WhatsApp
    </span>
</a>


            {/* Bottom Bar */}
            <div className="relative border-t border-[#4A0E0E]">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-xs text-[#917F72] sm:flex-row lg:px-8">

                    <p>
                        © {new Date().getFullYear()} Bingwa Magari.{" "}
                        {t("footer.rights")}
                    </p>

                    <p>
                        {t("footer.developedBy")}{" "}
                        <a
                            href="https://john-mange.netlify.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-[#F4A460] transition-colors duration-300 hover:text-white"
                        >
                            JS Mange
                        </a>
                    </p>

                </div>
            </div>
        </footer>
    );
}
