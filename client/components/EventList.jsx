import { truncate } from '@/utils/helper'
import Link from 'next/link'
import React from 'react'
import { FaEthereum } from 'react-icons/fa'

const EventList = ({ events }) => {
  return (
    <section className="mt-10">
      <main className="lg:w-2/2 w-full mx-auto m-5">
        <h4 className="text-2xl font-semibold my-8 m-2 text-center">Recent Events</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto  w-full justify-items-center">
          {events.map((event, i) => (
            <Card key={i} event={event} />
          ))}
        </div>
      </main>
    </section>
  )
}

const Card = ({ event }) => {
  return (
    <Link href={'/events/' + event.id} className="rounded-lg shadow-lg bg-white mr-3 ml-3 max-w-xs">
      <div className="relative">
        <img src={event.imageUrl} alt={event.title} className="h-40 w-[350px] !important object-cover" />
        {!event.minted ? (
          <span className="bg-orange-600 text-white absolute right-3 top-3 rounded-xl px-4">
            Open
          </span>
        ) : (
          <span className="bg-cyan-600 text-white absolute right-3 top-3 rounded-xl px-4">
            Minted
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-gray-900 text-lg font-bold mb-2 capitalize">
          {truncate({
            text: event.title,
            startChars: 45,
            endChars: 0,
            maxLength: 48,
          })}
        </h3>
        <p>
          {truncate({
            text: event.description,
            startChars: 100,
            endChars: 0,
            maxLength: 103,
          })}
        </p> 
        <div className="flex justify-between items-center mt-3">
          <div className="flex justify-start items-center">
            <FaEthereum />
            <p className="uppercase text-green-800 font-medium ">
              {event.ticketCost.toFixed(3)} ETH
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventList
