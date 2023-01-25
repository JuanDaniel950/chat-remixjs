import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Login } from "~/components/Login";
import { RelaTimeMessages } from "~/components/RealTimeMesages";

import { CreateSupabaseClient } from "~/utils/supabase.server";

export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = CreateSupabaseClient({ request, response });
  const { data } = await supabase.from("messages").select();
  return json({ messages: data ?? [] }, { headers: response.headers });
};

//funcion para recuperar el formulario
export const action = async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = CreateSupabaseClient({ request, response });
  //recuperar el formulario

  const formData = await request.formData();
  const { message } = Object.fromEntries(formData);

  console.log(message);

  //guardar en supabase
  await supabase.from("messages").insert({ content: String(message) });

  return json({ message: "ok" }, { headers: response.headers });
};

export default function Index() {
  const { messages } = useLoaderData<typeof loader>();
  return (
    <main>
      <Login />
      <Form method="post" style={{ marginTop: 5 }}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </Form>

      <h1>Messages</h1>
      <RelaTimeMessages serverMessages={messages} />
    </main>
  );
}
