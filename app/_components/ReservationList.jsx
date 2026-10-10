"use client"
import { useOptimistic } from "react"
import ReservationCard from "./ReservationCard"
import { deleteReservation } from '../_lib/actions';

const ReservationList = ({ bookings }) => {
  const [optBookings, optDelete] = useOptimistic(bookings, (currBookings, bookingId) => {
    return currBookings.filter((booking) => booking.id !== bookingId)
  })

  function handleDelete(bookingId) {
    optDelete(bookingId)
    deleteReservation(bookingId)
  }
  return (
    <ul className="space-y-6">
      {optBookings?.map((booking) => (
        <ReservationCard booking={booking} key={booking.id} onDelete={handleDelete} />
      ))}
    </ul>

  )
}

export default ReservationList
