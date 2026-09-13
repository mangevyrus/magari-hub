
import { useEffect, useState } from "react";
import { Globe2, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const [open, setOpen] = useState(false);

    const currentLanguage = i18n.language === "en"
        ? "en"
        : "sw";

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);

        localStorage.setItem(
            "magarihub_language",
            language
        );

        setOpen(false);
    };

    useEffect(() => {
        const closeDropdown = (event) => {
            if (
                !event.target.closest(
                    "[data-language-switcher]"
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "click",
            closeDropdown
        );

        return () => {
            document.removeEventListener(
                "click",
                closeDropdown
            );
        };
    }, []);

    return (
        <div
            className="relative"
            data-language-switcher
        >
            <button
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen((value) => !value);
                }}
                className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm font-bold text-[#12395B] transition hover:bg-[#EAF6FF]"
            >
                <Globe2 size={17} />

                <span>
                    {currentLanguage === "sw"
                        ? "Kiswahili"
                        : "English"}
                </span>

                <ChevronDown
                    size={15}
                    className={`transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-blue-100 bg-white p-1.5 shadow-xl">

                    <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t("nav.language")}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            changeLanguage("sw")
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${
                            currentLanguage === "sw"
                                ? "bg-[#EAF6FF] text-[#12395B]"
                                : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        <span>🇹🇿 Kiswahili</span>

                        {currentLanguage === "sw" && (
                            <Check size={16} />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            changeLanguage("en")
                        }
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold transition ${
                            currentLanguage === "en"
                                ? "bg-[#EAF6FF] text-[#12395B]"
                                : "text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        <span>🇬🇧 English</span>

                        {currentLanguage === "en" && (
                            <Check size={16} />
                        )}
                    </button>

                </div>
            )}
        </div>
    );
}

export default LanguageSwitcher;

