"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" })
}


export async function createBooking(bookingData, formData) {
  const session = await auth()
  if (!session) throw new Error("You Must be looged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: formData.get("numGuests"),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',

  }
  const { error } = await supabase
    .from('bookings')
    .insert([newBooking])


  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`)
  redirect('/cabins/thankyou')

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

  revalidatePath("/account/profile")
}

export async function deleteReservation(bookingId) {
  const session = await auth()
  if (!session) throw new Error("You must be logged in")

  const guestBookings = await getBookings(session.user.guestId)
  const guestbokkengsIds = guestBookings.map((booking) => booking.id)

  if (!guestbokkengsIds.includes(bookingId)) throw new Error("You dont have the rights to call yourself a west coast gangsta ")
  const { error } = await supabase.from('bookings').delete().eq('id', bookingId);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be deleted');
  }

  revalidatePath("/account/reservations")

}

export async function updateReservation(reservationId, data) {
  // check if user own the booking
  const session = await auth()
  if (!session) throw new Error("You must be logged in")
  const guestBookings = await getBookings(session.user.guestId)
  const guestbokkengsIds = guestBookings.map((booking) => booking.id)
  if (!guestbokkengsIds.includes(+reservationId)) throw new Error("You dont have the rights to call yourself a west coast gangsta ")

  //update booking
  const numGuests = data.get('numGuests')
  const observations = data.get("observations")
  const updatedData = { numGuests, observations }

  const { error } = await supabase
    .from('bookings')
    .update(updatedData)
    .eq('id', reservationId)
    .select()
    .maybeSingle();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  revalidatePath(`/account/reservations/edit/${reservationId}`)
  redirect("/account/reservations")
}
