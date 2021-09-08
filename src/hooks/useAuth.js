import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";

export function UseAuth() {
    const value = useContext(AuthContext);

    return value;
}