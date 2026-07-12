import { useEffect, useState } from "react";

import {
    getDepartments,
    createDepartment,
    deactivateDepartment,
    updateDepartment,
    getUsers,
    updateUser,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../api/organization";

import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

export default function OrganizationSetup() {
    const [activeTab, setActiveTab] = useState("departments");
    const [departments, setDepartments] = useState([]);
    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [departmentName, setDepartmentName] = useState("");
    const [categoryName, setCategoryName] = useState("");

    const [editingDepartment, setEditingDepartment] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingUser, setEditingUser] = useState(null);

    const [departmentForm, setDepartmentForm] = useState({
        name: "",
        head_user_id: "",
        parent_department_id: "",
        status: "active"
    });

    const [categoryEditName, setCategoryEditName] = useState("");

    const [userForm, setUserForm] = useState({
        role: "",
        department_id: ""
    });

    const tabs = [
        { key: "departments", label: "Departments" },
        { key: "categories", label: "Categories" },
        { key: "employees", label: "Employees" },
    ];

    const loadDepartments = async () => {
        try {
            const res = await getDepartments();
            setDepartments(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await getUsers();
            setUsers(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadCategories = async () => {
        try {
            const res = await getCategories();
            setCategories(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setError("");
            try {
                await Promise.all([loadDepartments(), loadUsers(), loadCategories()]);
            } catch {
                setError("Failed to load organization data");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    const formatRole = (role) => {
        if (!role) return "-";
        return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const createDept = async () => {
        if (!departmentName.trim()) return;
        await createDepartment({ name: departmentName.trim() });
        setDepartmentName("");
        loadDepartments();
    };

    const toggleDepartmentStatus = async (dep) => {
        if (dep.status === "active") {
            await deactivateDepartment(dep.id);
        } else {
            await updateDepartment(dep.id, { status: "active" });
        }
        loadDepartments();
    };

    const saveDepartment = async () => {
        await updateDepartment(editingDepartment.id, departmentForm);
        setEditingDepartment(null);
        loadDepartments();
    };

    const createCat = async () => {
        if (!categoryName.trim()) return;
        await createCategory({ name: categoryName.trim(), department_id: departments[0]?.id });
        setCategoryName("");
        loadCategories();
    };

    const saveCategory = async () => {
        await updateCategory(editingCategory.id, {
            name: categoryEditName,
            department_id: editingCategory.department_id
        });
        setEditingCategory(null);
        loadCategories();
    };

    const removeCategory = async (id) => {
        await deleteCategory(id);
        loadCategories();
    };

    const saveUser = async () => {
        await updateUser(editingUser.id, userForm);
        setEditingUser(null);
        loadUsers();
    };

    if (loading) return <LoadingSpinner text="Loading organization data..." />;

    if (error) {
        return (
            <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Organization Setup</h1>
                <p className="text-slate-500 mb-6">Admin organization management</p>
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">{error}</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">Organization Setup</h1>
            <p className="text-slate-500 mb-6">Admin organization management</p>

            <div className="flex gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:scale-105 ${
                            activeTab === tab.key
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "departments" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Department Management</h2>
                    </div>

                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <div className="flex gap-3">
                            <input
                                className="border border-slate-300 rounded-lg p-2.5 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Department Name"
                                value={departmentName}
                                onChange={(e) => setDepartmentName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && createDept()}
                            />
                            <button
                                onClick={createDept}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    {departments.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left">
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Head</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departments.map((dep) => (
                                        <tr key={dep.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200">
                                            <td className="p-4 text-sm font-medium text-slate-800">{dep.name}</td>
                                            <td className="p-4 text-sm text-slate-600">{dep.head_name || "-"}</td>
                                            <td className="p-4"><StatusBadge status={dep.status} /></td>
                                            <td className="p-4 space-x-2">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    onClick={() => {
                                                        setEditingDepartment(dep);
                                                        setDepartmentForm({
                                                            name: dep.name,
                                                            head_user_id: dep.head_user_id || "",
                                                            parent_department_id: dep.parent_department_id || "",
                                                            status: dep.status
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105 ${
                                                        dep.status === "active"
                                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    }`}
                                                    onClick={() => toggleDepartmentStatus(dep)}
                                                >
                                                    {dep.status === "active" ? "Deactivate" : "Activate"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No departments created yet.</div>
                    )}
                </div>
            )}

            {activeTab === "categories" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Asset Category Management</h2>
                    </div>

                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                        <div className="flex gap-3">
                            <input
                                className="border border-slate-300 rounded-lg p-2.5 flex-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Category Name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && createCat()}
                            />
                            <button
                                onClick={createCat}
                                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    {categories.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left">
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category Name</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200">
                                            <td className="p-4 text-sm font-medium text-slate-800">{cat.name}</td>
                                            <td className="p-4 space-x-2">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    onClick={() => {
                                                        setEditingCategory(cat);
                                                        setCategoryEditName(cat.name);
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    onClick={() => removeCategory(cat.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No categories created yet.</div>
                    )}
                </div>
            )}

            {activeTab === "employees" && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                    <div className="p-5 border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800">Employee Directory</h2>
                    </div>

                    {users.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left">
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
                                        <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors duration-200">
                                            <td className="p-4 text-sm font-medium text-slate-800">{user.name}</td>
                                            <td className="p-4 text-sm text-slate-600">{user.email}</td>
                                            <td className="p-4"><StatusBadge status={user.role} /></td>
                                            <td className="p-4 text-sm text-slate-600">{user.department_name || "-"}</td>
                                            <td className="p-4">
                                                <button
                                                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setUserForm({
                                                            role: user.role,
                                                            department_id: user.department_id || ""
                                                        });
                                                    }}
                                                >
                                                    Manage Role
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">No employees found.</div>
                    )}
                </div>
            )}

            {/* Edit Department Modal */}
            {editingDepartment && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingDepartment(null)}>
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Edit Department</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                    className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={departmentForm.name}
                                    onChange={(e) => setDepartmentForm({ ...departmentForm, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department Head</label>
                                <select
                                    className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={departmentForm.head_user_id}
                                    onChange={(e) => setDepartmentForm({ ...departmentForm, head_user_id: e.target.value })}
                                >
                                    <option value="">Select Department Head</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Department</label>
                                <select
                                    className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={departmentForm.parent_department_id}
                                    onChange={(e) => setDepartmentForm({ ...departmentForm, parent_department_id: e.target.value })}
                                >
                                    <option value="">None (Top Level)</option>
                                    {departments.filter((d) => d.id !== editingDepartment.id).map((dep) => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingDepartment(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveDepartment}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {editingCategory && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingCategory(null)}>
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Edit Category</h2>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                            <input
                                className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={categoryEditName}
                                onChange={(e) => setCategoryEditName(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingCategory(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveCategory}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setEditingUser(null)}>
                    <div className="bg-white p-6 rounded-xl shadow-lg w-96 border border-slate-200" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Manage Role - {editingUser.name}</h2>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select
                                    className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={userForm.role}
                                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                                >
                                    <option value="employee">Employee</option>
                                    <option value="department_head">Department Head</option>
                                    <option value="asset_manager">Asset Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select
                                    className="border border-slate-300 rounded-lg p-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={userForm.department_id}
                                    onChange={(e) => setUserForm({ ...userForm, department_id: e.target.value })}
                                >
                                    <option value="">No Department</option>
                                    {departments.map((dep) => (
                                        <option key={dep.id} value={dep.id}>{dep.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveUser}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-150 cursor-pointer hover:scale-105"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}