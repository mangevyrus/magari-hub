
import { useState } from "react";

import { Link } from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    CarFront,
    CheckCircle2,
    ImagePlus,
    MapPin,
    Phone,
    ShieldCheck,
    User,
    X,
} from "lucide-react";

import { useTranslation } from "react-i18next";

import Navbar from "../../components/Navbar";

function SellCar() {
    const { t } = useTranslation();

    const [images, setImages] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        email: "",
        location: "",
        brand: "",
        model: "",
        year: "",
        condition: "used",
        mileage: "",
        price: "",
        description: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleImages = (event) => {
        const selectedFiles = Array.from(event.target.files || []);

        setImages((current) => [
            ...current,
            ...selectedFiles,
        ]);
    };

    const removeImage = (index) => {
        setImages((current) =>
            current.filter((_, imageIndex) => imageIndex !== index)
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // API integration will be added after the backend
        // selling/listing endpoint is ready.
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#FDF8F5]">
            <Navbar />

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-[#8B1A1A]/20 bg-white">
                <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#B22222]/5 blur-3xl" />
                <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F4A460]/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
                    <Link
                        to="/vehicles"
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#6A5A4A] transition hover:text-[#8B1A1A]"
                    >
                        <ArrowLeft size={17} />

                        {t("sellCar.backToVehicles")}
                    </Link>

                    <div className="mt-8 max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#D4A853]/20 bg-[#8B1A1A]/5 px-4 py-2 text-sm font-bold text-[#8B1A1A]">
                            <CarFront size={17} />

                            {t("sellCar.hero.badge")}
                        </div>

                        <h1 className="mt-5 text-4xl font-black leading-tight text-[#2D1B0E] md:text-6xl">
                            {t("sellCar.hero.title")}
                            <span className="block text-[#B22222]">
                                {t("sellCar.hero.highlight")}
                            </span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-[#6A5A4A] md:text-lg">
                            {t("sellCar.hero.description")}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <a
                                href="#sell-form"
                                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/30"
                            >
                                {t("sellCar.hero.startButton")}

                                <ArrowRight size={18} />
                            </a>

                            <Link
                                to="/vehicles"
                                className="inline-flex items-center gap-2 rounded-xl border border-[#8B1A1A]/20 bg-white px-6 py-3.5 text-sm font-bold text-[#8B1A1A] transition hover:bg-[#FDF8F5]"
                            >
                                {t("sellCar.hero.browseButton")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="border-b border-[#F4A460]/20 bg-[#FDF8F5]">
                <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                            {t("sellCar.process.eyebrow")}
                        </p>

                        <h2 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                            {t("sellCar.process.title")}
                        </h2>

                        <p className="mx-auto mt-3 max-w-2xl text-[#6A5A4A]">
                            {t("sellCar.process.description")}
                        </p>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-3">
                        {[
                            {
                                number: "01",
                                title: t("sellCar.process.steps.details.title"),
                                description: t(
                                    "sellCar.process.steps.details.description"
                                ),
                            },
                            {
                                number: "02",
                                title: t("sellCar.process.steps.review.title"),
                                description: t(
                                    "sellCar.process.steps.review.description"
                                ),
                            },
                            {
                                number: "03",
                                title: t("sellCar.process.steps.sell.title"),
                                description: t(
                                    "sellCar.process.steps.sell.description"
                                ),
                            },
                        ].map((step) => (
                            <div
                                key={step.number}
                                className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm"
                            >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A] text-sm font-black text-white">
                                    {step.number}
                                </div>

                                <h3 className="mt-5 text-xl font-black text-[#2D1B0E]">
                                    {step.title}
                                </h3>

                                <p className="mt-2 leading-6 text-[#6A5A4A]">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FORM */}
            <section id="sell-form" className="bg-white">
                <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
                    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
                        <div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#B22222]">
                                    {t("sellCar.form.eyebrow")}
                                </p>

                                <h2 className="mt-2 text-3xl font-black text-[#2D1B0E] md:text-4xl">
                                    {t("sellCar.form.title")}
                                </h2>

                                <p className="mt-3 max-w-2xl text-[#6A5A4A]">
                                    {t("sellCar.form.description")}
                                </p>
                            </div>

                            {submitted ? (
                                <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600">
                                        <CheckCircle2 size={30} />
                                    </div>

                                    <h3 className="mt-5 text-2xl font-black text-[#2D1B0E]">
                                        {t("sellCar.success.title")}
                                    </h3>

                                    <p className="mt-2 max-w-xl leading-7 text-[#6A5A4A]">
                                        {t("sellCar.success.description")}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSubmitted(false)}
                                        className="mt-6 rounded-xl bg-[#8B1A1A] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#4A0E0E]"
                                    >
                                        {t("sellCar.success.submitAnother")}
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-8 space-y-8"
                                >
                                    {/* SELLER INFORMATION */}
                                    <div className="rounded-3xl border border-[#F4A460]/20 bg-[#FDF8F5] p-6 md:p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                                <User size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black text-[#2D1B0E]">
                                                    {t(
                                                        "sellCar.form.seller.title"
                                                    )}
                                                </h3>

                                                <p className="text-sm text-[#6A5A4A]">
                                                    {t(
                                                        "sellCar.form.seller.description"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.fullName"
                                                )}
                                                name="full_name"
                                                value={form.full_name}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.fullName"
                                                )}
                                                required
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.phone"
                                                )}
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.phone"
                                                )}
                                                type="tel"
                                                required
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.email"
                                                )}
                                                name="email"
                                                value={form.email}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.email"
                                                )}
                                                type="email"
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.location"
                                                )}
                                                name="location"
                                                value={form.location}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.location"
                                                )}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* VEHICLE INFORMATION */}
                                    <div className="rounded-3xl border border-[#F4A460]/20 bg-[#FDF8F5] p-6 md:p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                                <CarFront size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black text-[#2D1B0E]">
                                                    {t(
                                                        "sellCar.form.vehicle.title"
                                                    )}
                                                </h3>

                                                <p className="text-sm text-[#6A5A4A]">
                                                    {t(
                                                        "sellCar.form.vehicle.description"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.brand"
                                                )}
                                                name="brand"
                                                value={form.brand}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.brand"
                                                )}
                                                required
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.model"
                                                )}
                                                name="model"
                                                value={form.model}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.model"
                                                )}
                                                required
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.year"
                                                )}
                                                name="year"
                                                value={form.year}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.year"
                                                )}
                                                type="number"
                                                required
                                            />

                                            <div>
                                                <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                                    {t(
                                                        "sellCar.form.fields.condition"
                                                    )}
                                                </label>

                                                <select
                                                    name="condition"
                                                    value={form.condition}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-[#D4A853]/20 bg-white px-4 py-3 text-sm font-semibold text-[#2D1B0E] outline-none transition focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10"
                                                >
                                                    <option value="used">
                                                        {t(
                                                            "sellCar.form.conditions.used"
                                                        )}
                                                    </option>

                                                    <option value="new">
                                                        {t(
                                                            "sellCar.form.conditions.new"
                                                        )}
                                                    </option>

                                                    <option value="certified">
                                                        {t(
                                                            "sellCar.form.conditions.certified"
                                                        )}
                                                    </option>
                                                </select>
                                            </div>

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.mileage"
                                                )}
                                                name="mileage"
                                                value={form.mileage}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.mileage"
                                                )}
                                                type="number"
                                            />

                                            <InputField
                                                label={t(
                                                    "sellCar.form.fields.price"
                                                )}
                                                name="price"
                                                value={form.price}
                                                onChange={handleChange}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.price"
                                                )}
                                                type="number"
                                                required
                                            />
                                        </div>

                                        <div className="mt-5">
                                            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                                                {t(
                                                    "sellCar.form.fields.description"
                                                )}
                                            </label>

                                            <textarea
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                rows={5}
                                                placeholder={t(
                                                    "sellCar.form.placeholders.description"
                                                )}
                                                className="w-full resize-none rounded-xl border border-[#D4A853]/20 bg-white px-4 py-3 text-sm font-medium text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10"
                                            />
                                        </div>
                                    </div>

                                    {/* IMAGES */}
                                    <div className="rounded-3xl border border-[#F4A460]/20 bg-[#FDF8F5] p-6 md:p-8">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                                <ImagePlus size={21} />
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black text-[#2D1B0E]">
                                                    {t(
                                                        "sellCar.form.images.title"
                                                    )}
                                                </h3>

                                                <p className="text-sm text-[#6A5A4A]">
                                                    {t(
                                                        "sellCar.form.images.description"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <label className="mt-6 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D4A853]/30 bg-white px-5 py-8 text-center transition hover:border-[#8B1A1A]/40 hover:bg-[#FDF8F5]">
                                            <ImagePlus
                                                size={30}
                                                className="text-[#8B1A1A]"
                                            />

                                            <p className="mt-3 text-sm font-bold text-[#2D1B0E]">
                                                {t(
                                                    "sellCar.form.images.choose"
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-[#8A7A6A]">
                                                {t(
                                                    "sellCar.form.images.hint"
                                                )}
                                            </p>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImages}
                                                className="hidden"
                                            />
                                        </label>

                                        {images.length > 0 && (
                                            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                                {images.map(
                                                    (image, index) => (
                                                        <div
                                                            key={`${image.name}-${index}`}
                                                            className="group relative aspect-square overflow-hidden rounded-2xl border border-[#F4A460]/20 bg-white"
                                                        >
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    image
                                                                )}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeImage(
                                                                        index
                                                                    )
                                                                }
                                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                                                                aria-label={t(
                                                                    "sellCar.form.images.remove"
                                                                )}
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* SUBMIT */}
                                    <div className="flex flex-col gap-4 rounded-3xl border border-[#8B1A1A]/10 bg-[#FDF8F5] p-6 md:flex-row md:items-center md:justify-between md:p-8">
                                        <div className="flex items-start gap-3">
                                            <ShieldCheck
                                                size={22}
                                                className="mt-0.5 shrink-0 text-[#8B1A1A]"
                                            />

                                            <p className="text-sm leading-6 text-[#6A5A4A]">
                                                {t(
                                                    "sellCar.form.privacyNote"
                                                )}
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B22222] to-[#8B1A1A] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#B22222]/20 transition hover:shadow-xl hover:shadow-[#B22222]/30"
                                        >
                                            {t(
                                                "sellCar.form.submit"
                                            )}

                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* SIDE INFORMATION */}
                        <aside className="h-fit space-y-5 lg:sticky lg:top-24">
                            <div className="rounded-3xl bg-gradient-to-br from-[#4A0E0E] to-[#8B1A1A] p-7 text-white shadow-xl">
                                <CarFront size={32} />

                                <h3 className="mt-5 text-2xl font-black">
                                    {t("sellCar.sidebar.title")}
                                </h3>

                                <p className="mt-3 leading-7 text-white/80">
                                    {t("sellCar.sidebar.description")}
                                </p>

                                <div className="mt-6 space-y-4">
                                    <div className="flex gap-3">
                                        <CheckCircle2
                                            size={19}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <span className="text-sm text-white/90">
                                            {t(
                                                "sellCar.sidebar.points.reachBuyers"
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <CheckCircle2
                                            size={19}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <span className="text-sm text-white/90">
                                            {t(
                                                "sellCar.sidebar.points.professionalListing"
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        <CheckCircle2
                                            size={19}
                                            className="mt-0.5 shrink-0"
                                        />

                                        <span className="text-sm text-white/90">
                                            {t(
                                                "sellCar.sidebar.points.support"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-[#F4A460]/20 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B1A1A]/10 text-[#8B1A1A]">
                                        <MapPin size={21} />
                                    </div>

                                    <div>
                                        <h3 className="font-black text-[#2D1B0E]">
                                            {t(
                                                "sellCar.sidebar.locationTitle"
                                            )}
                                        </h3>

                                        <p className="text-sm text-[#6A5A4A]">
                                            {t(
                                                "sellCar.sidebar.locationDescription"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#FDF8F5] p-4">
                                    <Phone
                                        size={18}
                                        className="text-[#8B1A1A]"
                                    />

                                    <span className="text-sm font-bold text-[#2D1B0E]">
                                        {t(
                                            "sellCar.sidebar.contactNote"
                                        )}
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </div>
    );
}

function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = "text",
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-bold text-[#2D1B0E]">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full rounded-xl border border-[#D4A853]/20 bg-white px-4 py-3 text-sm font-medium text-[#2D1B0E] outline-none transition placeholder:text-[#8A7A6A] focus:border-[#8B1A1A] focus:ring-2 focus:ring-[#8B1A1A]/10"
            />
        </div>
    );
}

export default SellCar;

