import api from "./axios";


export const getDepartments = () =>
    api.get("/admin/departments");


export const createDepartment = (data) =>
    api.post("/admin/departments", data);


export const updateDepartment = (id, data) =>
    api.put(`/admin/departments/${id}`, data);


export const deactivateDepartment = (id) =>
    api.patch(`/admin/departments/${id}/deactivate`);



export const getCategories = () =>
    api.get("/admin/categories");


export const createCategory = (data) =>
    api.post("/admin/categories", data);


export const updateCategory = (id, data) =>
    api.put(`/admin/categories/${id}`, data);


export const deleteCategory = (id) =>
    api.delete(`/admin/categories/${id}`);



export const getUsers = () =>
    api.get("/admin/users");


export const updateUser = (id, data) =>
    api.put(`/admin/users/${id}`, data);