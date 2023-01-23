import { useSupabase } from "~/hoooks/useSupabase";

export function Login() {
    const supabase= useSupabase();
    const handleLogout = async ()  => {
        const { error } = await supabase.auth.signOut();
        if(error) console.log('error al Cerrar Sesiòn',error);
    }
    const handleLogin= async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider:"github"
        })

        if(error) console.log('error al Iniciar Sesiòn',error);
    };
    return (
        <div style={{display:"flex", gap:"12px"}}>
        <button onClick={handleLogout}>Cerrar Sesiòn</button>
        <button onClick={handleLogin}>Iniciar Sesiòn</button>
        </div>
    );
}