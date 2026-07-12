import { useAuth } from "../context/AuthContext";


export default function Topbar(){

    const { user, logout } = useAuth();


    return (

        <header className="h-16 bg-white border-b flex items-center justify-between px-6">

            <h2 className="text-xl font-semibold text-slate-800">
                Dashboard
            </h2>


            <div className="flex items-center gap-4">

                <div className="text-right">

                    <p className="font-medium text-slate-800">
                        {user?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                        {user?.role}
                    </p>

                </div>


                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

        </header>

    );

}