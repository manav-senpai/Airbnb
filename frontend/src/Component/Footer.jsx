import React from 'react';
import { FaGlobe, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

function Footer() {
  return (
    <div className="w-full bg-gray-100 border-t border-gray-300 mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-700">
        
        {/* Column 1 */}
        <div className="space-y-3">
          <h5 className="font-bold text-black">Support</h5>
          <p className="cursor-pointer hover:underline">Help Centre</p>
          <p className="cursor-pointer hover:underline">AirCover</p>
          <p className="cursor-pointer hover:underline">Anti-discrimination</p>
          <p className="cursor-pointer hover:underline">Disability support</p>
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          <h5 className="font-bold text-black">Hosting</h5>
          <p className="cursor-pointer hover:underline">Airbnb your home</p>
          <p className="cursor-pointer hover:underline">AirCover for Hosts</p>
          <p className="cursor-pointer hover:underline">Hosting resources</p>
          <p className="cursor-pointer hover:underline">Community forum</p>
        </div>

        {/* Column 3 */}
        <div className="space-y-3">
          <h5 className="font-bold text-black">Airbnb</h5>
          <p className="cursor-pointer hover:underline">Newsroom</p>
          <p className="cursor-pointer hover:underline">New features</p>
          <p className="cursor-pointer hover:underline">Careers</p>
          <p className="cursor-pointer hover:underline">Investors</p>
        </div>

        {/* Column 4 - Socials */}
        <div className="space-y-3">
             <h5 className="font-bold text-black">Social</h5>
             <div className="flex gap-4 text-lg">
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    <FaFacebook className="cursor-pointer hover:text-blue-600 transition"/>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    <FaTwitter className="cursor-pointer hover:text-blue-400 transition"/>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    <FaInstagram className="cursor-pointer hover:text-pink-600 transition"/>
                </a>
             </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 max-w-[1200px] mx-auto py-6 px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="flex gap-2">
            <span>© 2026 Airbnb Clone, Inc.</span>
            <span>·</span>
            <span className="cursor-pointer hover:underline">Privacy</span>
            <span>·</span>
            <span className="cursor-pointer hover:underline">Terms</span>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0 font-semibold text-black cursor-pointer">
            <span className="flex items-center gap-2"><FaGlobe /> English (IN)</span>
            <span>₹ INR</span>
        </div>
      </div>
    </div>
  );
}

export default Footer;