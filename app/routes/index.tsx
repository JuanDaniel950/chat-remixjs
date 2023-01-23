
import { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Login } from "~/components/Login";

import { supabase } from "~/utils/supabase.server";


export const loader = async ({}: LoaderArgs) => {
 const {data} = await supabase.from('messages').select();
return {messages: data ?? []};
}
export default function Index() {
  const {messages} = useLoaderData<typeof loader>();
  return (
   <main>
    <Login />
      <h1>Messages</h1>
      <pre>
        {JSON.stringify(messages, null, 2)}
      </pre>
   </main>
  );
}
