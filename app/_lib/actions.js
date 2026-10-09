"use server";

import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}

export async function updateGuest(formData) {
  const session = await auth()
  if (!session) throw new Error("You Must be looged in");

  const nationalID = formData.get('nationalID')
  const [nationality, countryFlag] = formData.get('nationality').split('%')

  if (!/^\d{14}$/.test(nationalID)) throw new Error("Wrrong nationalID")
  const updatedFields = { nationality, countryFlag, nationalID }
  const { data, error } = await supabase
    .from('guests')
    .update(updatedFields)
    .eq('id', session.user.guestId)
    .select()
    .single();
  console.log(data, error)
}
