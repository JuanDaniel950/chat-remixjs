import { json, LinksFunction, LoaderArgs, MetaFunction, Response } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import styles from "./styles/global.css";
import { CreateSupabaseClient } from '~/utils/supabase.server';
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { Database } from "./types/database";
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Chat App",
  viewport: "width=device-width,initial-scale=1",
});

//importar estilos remixjs
export const links: LinksFunction =()=>[
  {rel:"stylesheet", href: styles},
];

//export loader supabase
export const loader = async ({request}:LoaderArgs) => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  }

const response= new Response();

const supabase = CreateSupabaseClient({request,response});
const {data:{ session }}=await supabase.auth.getSession();
  return json({env,session}, {headers:response.headers});
}


export default function App() {
const {env, session:ServerSession} = useLoaderData<typeof loader>();

const revalidator=useRevalidator();

const [supabase] =  useState(() => createBrowserClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY))

useEffect(() => {
  const {data:{subscription}} = supabase.auth.onAuthStateChange(async (event, session) => {
    if(session?.access_token !== ServerSession?.access_token) {
      //window.location.reload();
      revalidator.revalidate();
    };
  });
  return () => subscription?.unsubscribe();
},[]);

  return (
    <html lang="es">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet context={{supabase}} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
