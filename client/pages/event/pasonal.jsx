import EventList from '@/components/EventList'
import { generateEventData } from '@/utils/fakeData'
import { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getMyEvents } from '@/services/blockchain'


const Page = () => {
  const [end, setEnd] = useState(6)
  const [count] = useState(6)
  const [collection, setCollection] = useState([])
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    setCollection(events.slice(0, end))
  }, [events, end])

  useEffect(() => {
    const fetchData = async () => {
      const events = await getMyEvents()
      setEvents(events)
    }

    fetchData()
  }, [])

  return (
    <div>
      <Head>
        <title>MM Ticket | Personal</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EventList events={collection} />

      <div className="mt-10 h-20 "></div>

      {collection.length > 0 && events.length > collection.length && (
        <div className="w-full flex justify-center items-center">
          <button
            className="bg-orange-500 shadow-md rounded-full py-3 px-4
        text-white duration-300 transition-all"
            onClick={() => setEnd(end + count)}
          >
            {' '}
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default Page
