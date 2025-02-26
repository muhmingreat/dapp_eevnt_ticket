import {ToastContainer } from 'react-toastify'
import '@/styles/global.css'
import 'react-toastify/dist/ReactToastify.css'
import '@rainbow-me/rainbowkit/styles.css'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'

import { Provider } from 'react-redux';
import { store } from '@/store';
import '@/config/connection'


// import {
//   getDefaultConfig,
//   RainbowKitProvider,
// } from '@rainbow-me/rainbowkit';
// import { WagmiProvider } from 'wagmi';
// import { QueryClientProvider, QueryClient, } from "@tanstack/react-query";

// import { http } from 'wagmi';
// import { mainnet, sepolia, holesky, baseSepolia } from 'wagmi/chains';

// const config = getDefaultConfig({
//   appName: 'Event Ticket',
//   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT,
//   chains: [mainnet, sepolia, holesky, baseSepolia],
//   transports: {
//     [mainnet.id]: http('https://eth-mainnet.g.alchemy.com/v2/wTjT37gcpTu17oPtpPJh71OMKrzt_Zps'),
//     [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/wTjT37gcpTu17oPtpPJh71OMKrzt_Zps'),
//     [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/wTjT37gcpTu17oPtpPJh71OMKrzt_Zps'),
//     [holesky.id]: http('https://eth-holesky.g.alchemy.com/v2/wTjT37gcpTu17oPtpPJh71OMKrzt_Zps')
//   },
// });


export default function App({ Component, pageProps }) {
  const queryClient = new QueryClient();
  const [showChild, setShowChild] = useState(false)

  useEffect(() => {
    setShowChild(true)
  }, [])

  if (!showChild || typeof window === 'undefined') {
    return null
  } else {
    return (

      <div className="min-h-screen bg-gray-100">
        <>
          {/* <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider> */}
                <Provider store={store}>

                  <Header />
                  <div className="mt-10 h-20 "></div>
                  <Component {...pageProps} />

                  {/* <div className="mt-10 h-20 "></div> */}
                  <ToastContainer position="bottom-center" theme="dark" />

                </Provider>
              {/* </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider> */}
        </>
      </div>

    )
  }
}