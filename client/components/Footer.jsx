import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 ">
        <div className="flex flex-col md:flex-row justify-evenly items-center">
          <div className="mb-4 md:mb-0">
            <h5 className="text-xl font-semibold">Company</h5>
            <ul>
              <li><a href="about" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Press</a></li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0">
            <h5 className="text-xl font-semibold">Support</h5>
            <ul>
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div className="mb-4 md:mb-0 ">
            <h5 className="text-xl font-semibold">Follow Us</h5>
          
            <ul>
             <li> <a href="#" className="text-gray-400 hover:text-white">Facebook</a></li>
             <li>  <a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
             <li>  <a href="#" className="text-gray-400 hover:text-white">Instagram</a></li>
             </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center border-t-[1px] border-white ">
          <p className="text-gray-400 text-sm mt-3">© 2025 GoTicket. All Rights Reserved.</p>
        </div>
    
    </footer>
  );
}

export default Footer;
