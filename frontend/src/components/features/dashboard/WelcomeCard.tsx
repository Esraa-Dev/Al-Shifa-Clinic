import { useAuth } from "../../../context/AuthContext";

export const WelcomeCard = () => {
    const { user } = useAuth();

    const getDisplayName = () => {
        if (!user) return "";
        const prefix = user.role === "doctor" ? "Dr. " : "";
        return `${prefix}${user.firstName}`;
    };

    return (
        <section className="bg-linear-to-l from-primary to-secondary rounded-2xl p-6 text-white shadow-lg text-left h-36">
            <h1 className="text-2xl font-bold mb-2">
                {user?.role === "admin" ? "Welcome back" : "Welcome"}, {getDisplayName()}! 👋
            </h1>
            <p className="text-blue-100">
                {user?.role === "admin"
                    ? "Here is an overview of the clinic's performance today"
                    : "Here are your appointments and patient stats for today"}
            </p>
        </section>
    );
};