import { useSupabase } from '~/hoooks/useSupabase';
import { useEffect, useState } from 'react';
import type { Database } from '~/types/database';


type Message = Database['public']['Tables']['messages']['Row'];

export function RelaTimeMessages({
    serverMessages

}: {
    serverMessages: Message[]
}){
    const supabase = useSupabase();
    const [messages, setMessages] = useState<Message[]>(serverMessages);

    useEffect(() => {
        const channel = supabase
        .channel('*')
        .on('postgres_changes',{
            schema: 'public',
            table: 'messages',
            event: 'INSERT'
        },(payload) => {
            const newMessage= payload.new as Message;
            setMessages((messages) => [...messages, newMessage]);
          //  if(!messages.some(message=> message.id === newMessage.id)){
            //    setMessages((messages) => [...messages, newMessage]);
           // }
        }).subscribe();
        return () => {supabase.removeChannel(channel)};
    },[]); 
        
   return (
    <pre>
    {JSON.stringify(messages, null, 2)}
     </pre>
   ) 
}