import React from 'react';

const About = () => {
  return (
    <section className="bg-gradient-to-r from-black 
    via-orange-500 to-orange-900 p-10 text-white py-16 px-8">
        
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-semibold text-white mb-6">
          About Our Event Ticketing App
        </h1>
        <p className="text-xl text-white mb-6">
          Welcome to our Web3-powered Event Ticketing app. We’ve revolutionized the way events are
          organized and attended. Our goal is to provide a seamless and transparent ticketing
          experience, utilizing blockchain technology to ensure every transaction is secure,
          verifiable, and decentralized.
        </p>
        <div className=' flex justify-center'>
                  <div className="w-[600px]  bg-white p-8 rounded-lg shadow-lg  ">
          <h2 className="text-4xl font-semibold text-gray-800  mb-4">
            A Brief History of Our Journey
          </h2>
          <p className="text-gray-700 mb-4  " >
            The idea for our platform came about when we realized that traditional ticketing
            systems had many limitations, including fraud, scalping, and lack of transparency. 
            In 2021, we started exploring blockchain technology as a way to eliminate these 
            problems. The decentralized nature of Web3 allowed us to create an immutable, 
            tamper-proof record of every ticket, ensuring authenticity and preventing fraud.
          </p>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default About;
