function StatCard({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (

        <div className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_8px_30px_rgba(18,57,91,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(18,57,91,0.09)]">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-400">
                        {title}
                    </p>

                    <p className="mt-2 text-3xl font-black text-[#12395B]">
                        {value}
                    </p>

                    {description && (

                        <p className="mt-2 text-xs text-slate-400">
                            {description}
                        </p>

                    )}

                </div>


                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF6FF] text-[#2F80C0] transition group-hover:bg-[#2F80C0] group-hover:text-white">

                    <Icon size={22} />

                </div>

            </div>

        </div>
    );
}

export default StatCard;