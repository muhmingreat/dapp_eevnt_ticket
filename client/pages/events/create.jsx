                           
import { NextPage } from 'next'
import Head from 'next/head'
import { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { useAccount } from 'wagmi'
import { createEvent, ethUSD } from '@/services/blockchain'


const Page = () => {
  const { address } = useAccount()

  const [selectedFile, setSelectedFile] = useState(null)
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [event, setEvent] = useState({
    title: '',
    imageUrl: '',
    description: '',
    ticketCost: '',
    capacity: '',
    startsAt: '',
    endsAt: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }))
    }
    const handleImageSelect = ({ target }) => {
      setSelectedFile(target.files[0])
    }
  
    const uploadImage = useCallback(async () => {
      if (selectedFile) {
        setIsLoading(true)
        const formData = new FormData()
        formData.append("file", selectedFile)
  
        try {
          const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
            pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRECT_KEY,
              },
            }
          )
  
          const fileUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
          setUrl(fileUrl)
          setEvent((prevState) => ({
            ...prevState,
            imageUrl: fileUrl,
          }))
        } catch (error) {
          console.error("Pinata upload error:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }, [selectedFile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!address) return toast.warn('Connect wallet first')

    event.startsAt = new Date(event.startsAt).getTime()
    event.endsAt = new Date(event.endsAt).getTime()

    await toast.promise(
      new Promise(async (resolve, reject) => {
        createEvent(event).then((tx) => {
          console.log(tx)
          resetForm()
          resolve(tx)
        })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event creation successful 👌',
        error: 'Encountered error 🤯',
      }
    )
    await toast.promise(
      new Promise(async (resolve, reject) => {
        ethUSD(event).then((tx) => {
          console.log(tx)
          resetForm()
          resolve(tx)
        })
          .catch((error) => reject(error))
      }),
      {
        pending: 'Approve transaction...',
        success: 'Event creation successful 👌',
        error: 'Encountered error 🤯',
      }
    )
  }

  const resetForm = () => {
    setEvent({
      title: '',
      imageUrl: '',
      description: '',
      ticketCost: '',
      capacity: '',
      startsAt: '',
      endsAt: '',
    })
  }

  return (
    <div>
      <Head>
        <title>M M ticket | Create</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="lg:w-2/3 w-full mx-auto bg-white p-5 shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col text-black">
          <div className="flex flex-row justify-between items-center mb-5">
            <p className="font-semibold">Create Event</p>
          </div>

          {event.imageUrl && (
            <div className="flex flex-row justify-center items-center rounded-xl">
              <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20 shadow-md">
                <img src={event.imageUrl} alt={event.title} className="h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              value={event.title}
              onChange={handleChange}
            />
          </div>

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step={1}
                  min={1}
                  name="capacity"
                  placeholder="Capacity"
                  value={event.capacity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  className="block w-full text-sm bg-transparent
                  border-0 focus:outline-none focus:ring-0"
                  type="number"
                  step="0.001"
                  min="0.001"
                  name="ticketCost"
                  placeholder="Ticket cost (ETH) (USDT)"
                  value={event.ticketCost}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
            <div>
          <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="file"
              onChange={handleImageSelect}
            />
            <button
              type="button"
              onClick={uploadImage}
              className="bg-blue-500 p-2 text-white  hidden rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {/* <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <input
              className="block w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0"
              type="file"
              name="imageUrl"
              placeholder="ImageURL"
              // pattern="https?://.+(\.(jpg|png|gif))?$"
              value={event.imageUrl}
              onChange={handleChange}
              required
            />
          </div> */}

          <div
            className="flex flex-col sm:flex-row justify-between items-center w-full
           space-x-0 sm:space-x-2 space-y-5 sm:space-y-0 mt-5"
          >
            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  placeholder="Start Date"
                  className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                  name="startsAt"
                  type="datetime-local"
                  value={event.startsAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-xl p-2">
              <div
                className="block w-full text-sm bg-transparent
              border-0 focus:outline-none focus:ring-0"
              >
                <input
                  placeholder="End Date"
                  className="bg-transparent outline-none w-full placeholder-[#3D3857] text-sm border-none focus:outline-none focus:ring-0 py-0"
                  name="endsAt"
                  type="datetime-local"
                  value={event.endsAt}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-between items-center bg-gray-200 rounded-xl mt-5 p-2">
            <textarea
              className="block w-full text-sm resize-none
              bg-transparent border-0 focus:outline-none focus:ring-0 h-20"
              name="description"
              placeholder="Description"
              value={event.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mt-5">
            <button 
              type="submit"
              className="bg-orange-500 p-2 rounded-full py-3 px-10
            text-white hover:bg-transparent border hover:text-orange-500
            hover:border-orange-500 duration-300 transition-all"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default Page