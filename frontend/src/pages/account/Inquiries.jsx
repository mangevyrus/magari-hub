
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
    ArrowLeft,
    CarFront,
    Clock,
    CheckCircle2,
    XCircle,
    MessageCircle,
    CalendarDays,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

import { getMyInquiries } from "../../services/inquiryService";

function Inquiries() {
    const { t, i18n } = useTranslation();

    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadInquiries = async () => {
            try {
                const data = await getMyInquiries();

                setInquiries(data);
            } catch (err) {
                console.error(
                    "Failed to load inquiries:",
                    err
                );

                setError(
                    err.message ||
                        t("inquiries.errors.load")
                );
            } finally {
                setLoading(false);
            }
        };

        loadInquiries();
    }, [t]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "responded":
                return {
                    className:
                        "bg-green-50 text-green-700 border-green-200",
                    icon: <CheckCircle2 size={16} />,
                    label: t(
                        "inquiries.status.responded"
                    ),
                };

            case "closed":
                return {
                    className:
                        "bg-slate-100 text-slate-600 border-slate-200",
                    icon: <XCircle size={16} />,
                    label: t(
                        "inquiries.status.closed"
                    ),
                };

            default:
                return {
                    className:
                        "bg-yellow-50 text-yellow-700 border-yellow-200",
                    icon: <Clock size={16} />,
                    label: t(
                        "inquiries.status.pending"
                    ),
                };
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const locale =
            i18n.language === "sw"
                ? "sw-TZ"
                : "en-GB";

        return new Date(date).toLocaleDateString(
            locale,
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* HEADER */}
            <section className="border-b border-[#8B1A1A]/20 bg-white">
                <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
                    <Link
                        to="/account"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#6A5A4A] transition hover:text-[#8B1A1A]"
                    >
                        <ArrowLeft size={17} />

                        {t("inquiries.backToAccount")}
                    </Link>

                    <div className="mt-6 flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4A853]/20 bg-[#8B1A1A]/10 text-[#8B1A1A]">
                            <MessageCircle size={28} />
                        </div>

                        <div>
                            <p className="text-sm font-bold uppercase tracking-widest text-[#8B1A1A]">
                                {t("inquiries.eyebrow")}
                            </p>

                            <h1 className="mt-1 text-3xl font-extrabold text-[#2D1B0E] md:text-4xl">
                                {t("inquiries.title")}
                            </h1>

                            <p className="mt-1 text-[#6A5A4A]">
                                {t("inquiries.description")}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT */}
            <main className="mx-auto max-w-5xl px-5 py-10 md:px-8">
                {loading && (
                    <div className="space-y-5">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-52 animate-pulse rounded-3xl border border-[#8B1A1A]/20 bg-white"
                            />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    inquiries.length === 0 && (
                        <div className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-12 text-center shadow-sm">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#D4A853]/20 bg-[#8B1A1A]/10">
                                <CarFront
                                    size={45}
                                    className="text-[#8B1A1A]"
                                />
                            </div>

                            <h2 className="mt-5 text-2xl font-extrabold text-[#2D1B0E]">
                                {t(
                                    "inquiries.empty.title"
                                )}
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-[#6A5A4A]">
                                {t(
                                    "inquiries.empty.description"
                                )}
                            </p>

                            <Link
                                to="/vehicles"
                                className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#8B1A1A] to-[#4A0E0E] px-6 py-3 font-bold text-white shadow-lg shadow-[#8B1A1A]/20 transition hover:shadow-xl hover:shadow-[#8B1A1A]/40"
                            >
                                {t(
                                    "inquiries.empty.browseVehicles"
                                )}
                            </Link>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    inquiries.length > 0 && (
                        <div className="space-y-5">
                            {inquiries.map((inquiry) => {
                                const status =
                                    getStatusStyle(
                                        inquiry.status
                                    );

                                return (
                                    <article
                                        key={inquiry.id}
                                        className="rounded-3xl border border-[#8B1A1A]/20 bg-white p-6 shadow-sm transition hover:border-[#8B1A1A]/40 hover:shadow-md md:p-7"
                                    >
                                        {/* TOP */}
                                        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                                            <div>
                                                <p className="text-sm font-bold uppercase tracking-wider text-[#8B1A1A]">
                                                    {t(
                                                        "inquiries.vehicleInquiry"
                                                    )}
                                                </p>

                                                <h2 className="mt-1 text-2xl font-extrabold text-[#2D1B0E]">
                                                    {
                                                        inquiry.vehicle_name
                                                    }
                                                </h2>

                                                <p className="mt-1 font-semibold text-[#6A5A4A]">
                                                    {
                                                        inquiry.subject
                                                    }
                                                </p>
                                            </div>

                                            <div
                                                className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-sm font-bold ${status.className}`}
                                            >
                                                {status.icon}

                                                {status.label}
                                            </div>
                                        </div>

                                        {/* MESSAGE */}
                                        <div className="mt-6 rounded-2xl border border-[#D4A853]/10 bg-[#FDF8F5] p-5">
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#8A7A6A]">
                                                {t(
                                                    "inquiries.yourMessage"
                                                )}
                                            </p>

                                            <p className="mt-2 whitespace-pre-line leading-7 text-[#2D1B0E]">
                                                {
                                                    inquiry.message
                                                }
                                            </p>
                                        </div>

                                        {/* ADMIN RESPONSE */}
                                        {inquiry.admin_response && (
                                            <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-5">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2
                                                        size={18}
                                                        className="text-green-600"
                                                    />

                                                    <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                                                        {t(
                                                            "inquiries.adminResponse"
                                                        )}
                                                    </p>
                                                </div>

                                                <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
                                                    {
                                                        inquiry.admin_response
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {/* FOOTER */}
                                        <div className="mt-5 flex items-center gap-2 text-sm text-[#8A7A6A]">
                                            <CalendarDays
                                                size={16}
                                                className="text-[#8B1A1A]"
                                            />

                                            {formatDate(
                                                inquiry.created_at
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
            </main>
        </div>
    );
}

export default Inquiries;
