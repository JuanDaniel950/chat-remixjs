import { useOutletContext } from "@remix-run/react";

export const useSupabase = () => {
  const { supabase }: any = useOutletContext();
  return supabase;
};
