import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Sidebar() {

    const { user } = useAuth();


    const links = [
        {
            name: "Dashboard",
            path: "/dashboard"
        },
        {
            name: "Assets",
            path: "/assets"
        },
        {
            name: "Bookings",
            path: "/bookings"
        },
        {
            name: "Maintenance",
            path: "/maintenance"
        }
    ];


    if (user?.role === "admin") {

        links.push({
            name: "Organization Setup",
            path: "/organization"
        });

    }


    return (

        <aside className="w-64 min-h-screen bg-slate-900 text-white p-5">

            <h1 className="text-2xl font-bold mb-8">
                AssetFlow
            </h1>


            <nav className="space-y-2">

                {links.map((link) => (

                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({isActive}) =>
                            `
                            block px-4 py-3 rounded-lg transition
                            ${
                                isActive
                                ? "bg-blue-600"
                                : "hover:bg-slate-700"
                            }
                            `
                        }
                    >

                        {link.name}

                    </NavLink>

                ))}

            </nav>

        </aside>

    );

}