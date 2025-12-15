import { Outlet } from "react-router-dom";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { useGetCurrentUser } from "../hooks/useGetCurrentUser";

const PublicRoute = () => {
    const { data: user, isLoading } = useGetCurrentUser();

    if (isLoading) return <div>Loading...</div>;
    return (
        <>
            {(!user || user.role === "patient") && <Navbar />}
            <Outlet />
            <Footer />
        </>
    );
};

export default PublicRoute;
