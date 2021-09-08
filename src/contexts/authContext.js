import { createContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase'




export const AuthContext = createContext({});

export function AuthContextProvider(props) {
    const [user, setUser] = useState();

    async function signIn(usuario, password) {
        let { data, error, status } = await supabase
            .from('users')
            .select().eq('user', usuario).eq('password', password)

        if (error && status !== 406) {
            throw error
        }
        if (data.length <= 0) {
            alert('Usuário ou senha inválido.')
        } else {

            setUser({
                data
            });


        }

    }


    return (
        <AuthContext.Provider value={user, signIn}>
            {props.children}
        </AuthContext.Provider>
    );
}