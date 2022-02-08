import GenericService from "./GenericService";

export const login = async (body) => {
    return await GenericService("/login", "POST", body);
}

export const createUser = async (body) => {
    return await GenericService("/user", "POST", body);
}

export const getUserInfo = async (id) => {
    return await GenericService(`/user/${id}`, "GET");
}

export const deleteUser = async (id) => {
    return await GenericService(`/user/${id}`, "DELETE");
}

export const updateUserInfo = async (id, body) => {
    return await GenericService(`/user/${id}`, "PUT", body);
}