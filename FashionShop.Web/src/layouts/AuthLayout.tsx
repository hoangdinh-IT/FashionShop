import { Outlet } from "react-router-dom";

const AuthLayout = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f3ee]">
            
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.05),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.06),transparent_30%)]" />

            {/* Large Soft Shapes */}
            <div className="absolute -left-32 top-[-120px] h-[420px] w-[420px] rounded-full border border-black/5 bg-white/20 blur-3xl" />

            <div className="absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full border border-black/5 bg-black/[0.015] blur-3xl" />

            {/* Minimal Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, black 1px, transparent 1px),
                        linear-gradient(to bottom, black 1px, transparent 1px)
                    `,
                    backgroundSize: "80px 80px",
                }}
            />

            {/* Floating Accent */}
            <div className="absolute left-[10%] top-[18%] h-3 w-3 rounded-full bg-black/10" />
            <div className="absolute right-[14%] top-[22%] h-2 w-2 rounded-full bg-black/20" />
            <div className="absolute bottom-[18%] left-[20%] h-2 w-2 rounded-full bg-black/10" />

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;