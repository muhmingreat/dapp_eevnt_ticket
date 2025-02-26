  
import React, { FormEvent, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import {useAppKitAccount } from 'reown/appkit/react'
import { globalActions } from '@/store/globalSlices'
import { useDispatch, useSelector } from 'react-redux'
import { buyTicket } from '@/services/blockchain'

const BuyTicket = ({ event }) => {
  const{ticketModal} = useSelector((state) => state.globalStates)
  const {setTicketModal} = globalActions;
  const { address } = useAppKitAccount()
  const [tickets, setTickets] = useState('')

  const dispatch = useDispatch()



  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    await toast.promise(
      new Promise(async (resolve, reject) => {
        buyTicket(event,Number(tickets))
        .then((tx) => {
          dispatch(setTicketModal('scale-0'))
          setTickets('')
          console.log(tx)
          resolve(tx)
        })
        .catch((error) => reject(error)) 
      }),
      {
        pending: 'Approve transaction...',
        success: 'Ticket purchased successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
        bg-black bg-opacity-50 transform z-50 transition-transform duration-300 ${ticketModal}`}
    >
      <div className="bg-white text-black shadow-md shadow-orange-500 rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Buy Tickets</p>
            <button onClick={()=> dispatch(setTicketModal('scale-0'))}
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col justify-center items-start my-5">
            <div className="w-full bg-gray-200 rounded-xl p-2 mb-5">
              <div
                className="block w-full text-sm bg-transparent
                border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step="1"
                  min="1"
                  name="tickets"
                  placeholder="Ticket e.g 3"
                  value={tickets}
                  onChange={(e) => setTickets(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Buy Now
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyTicket