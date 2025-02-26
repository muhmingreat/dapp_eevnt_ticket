import { ethers } from 'ethers'
import { address } from './contants'
import { abi } from './contants'
import { globalActions } from '@/store/globalSlices'
import { store } from '@/store'
import axios from 'axios'

export const toWei = (num) => ethers.parseEther(num.toString())
export const fromWei = (num) => ethers.formatEther(num)

let ethereum
let tx

if (typeof window !== 'undefined') ethereum = window.ethereum
const { setEvent, setTickets } = globalActions

const getEthereumContracts = async () => {
  const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

  if (accounts?.length > 0) {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const contracts = new ethers.Contract(address, abi, signer)

    return contracts
  }
  else {
    const provider = new ethers.JsonRpcProvider(
      "https://base-sepolia.g.alchemy.com/v2/" + process.env.NEXT_RPC_URL
    )
    const wallet = ethers.Wallet.createRandom()
    const signer = wallet.connect(provider)
    const contracts = new ethers.Contract(address, abi, signer)

    return contracts
  }
}

const createEvent = async (event) => {
  try {
    

    if (!ethereum) {
      reportError('Please install a browser provider')
      return Promise.reject(new Error('Browser provider not installed'))
    }
    const contract = await getEthereumContracts()
    
    tx = await contract.createEvent(
      
      event.title,
      event.description,
      event.imageUrl,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt,

    )
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const updateEvent = async (event) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.updateEvent(
      event.id,
      event.title,
      event.description,
      event.imageUrl,
      event.capacity,
      toWei(Number(event.ticketCost)),
      event.startsAt,
      event.endsAt
    )
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}
const ethUSD = async () => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }
  try {
    const contract = await getEthereumContracts()
    tx = await contract.getEHTPrice()
    tx.await()
    console.log(tx)
    return Promise.resolve(tx)
  } catch (error) {
    return Promise.reject(error)
  }
}

const deleteEvent = async (eventId) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.deleteEvent(eventId)
    await tx.wait()

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const payout = async (eventId) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.payout(eventId)
    await tx.wait()

    const eventData = await getEvent(eventId)
    store.dispatch(setEvent(eventData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const buyTicket = async (event, tickets) => {
  if (!ethereum) {
    reportError('Please install a browser provider')
    return Promise.reject(new Error('Browser provider not installed'))
  }

  try {
    const contract = await getEthereumContracts()
    tx = await contract.buyTickets(event.id, tickets, { value: toWei(tickets * event.ticketCost) })
    await tx.wait()

    const eventData = await getEvent(event.id)
    store.dispatch(setEvent(eventData))

    const ticketsData = await getTickets(event.id)
    store.dispatch(setTickets(ticketsData))

    return Promise.resolve(tx)
  } catch (error) {
    reportError(error)
    return Promise.reject(error)
  }
}

const getEvents = async () => {
  const contract = await getEthereumContracts()
  
  const events = await contract.getEvents()
  

  return structuredEvent(events)
}

const getMyEvents = async () => {
  const contract = await getEthereumContracts()
  const events = await contract.getMyEvents()
  return structuredEvent(events)
}

const getEvent = async (eventId) => {
  const contract = await getEthereumContracts()
  const event = await contract.getSingleEvent(eventId)
  return structuredEvent([event])[0]
}

const getTickets = async (eventId) => {
  const contract = await getEthereumContracts()
  const tickets = await contract.getTickets(eventId)
  return structuredTicket(tickets)
}

const structuredEvent = (events) =>
  events
    .map((event) => ({
      id: Number(event.id),
      title: event.title,
      imageUrl: event.imageUrl,
      description: event.description,
      owner: event.owner,
      sales: Number(event.sales),
      ticketCost: parseFloat(fromWei(event.ticketCost)),
      capacity: Number(event.capacity),
      seats: Number(event.seats),
      startsAt: Number(event.startsAt),
      endsAt: Number(event.endsAt),
      timestamp: Number(event.timestamp),
      deleted: event.deleted,
      paidOut: event.paidOut,
      refunded: event.refunded,
      minted: event.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

const structuredTicket = (tickets) =>
  tickets
    .map((ticket) => ({
      id: Number(ticket.id),
      eventId: Number(ticket.eventId),
      owner: ticket.owner,
      ticketCost: parseFloat(fromWei(ticket.ticketCost)),
      timestamp: Number(ticket.timestamp),
      refunded: ticket.refunded,
      minted: ticket.minted,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

export {
  getEvents,
  getMyEvents,
  getEvent,
  getTickets,
  createEvent,
  updateEvent,
  deleteEvent,
  buyTicket,
  payout,
  ethUSD
}


