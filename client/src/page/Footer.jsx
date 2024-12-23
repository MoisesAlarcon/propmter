import React from 'react';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const Footer = () => {
  return (
    <footer className="bg-[#080909] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex space-x-4 mb-4">
            <a href="https://www.tiktok.com/@heliconstudio.es?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
              <FacebookIcon />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
              <TwitterIcon />
            </a>
            <a href="https://www.instagram.com/helicon.ai?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
              <InstagramIcon />
            </a>
            <a href="mailto:heliconbussines@gmail.com" className="text-white hover:text-gray-400">
              <EmailIcon />
            </a>
            <a href="https://www.tiktok.com/@heliconstudio.es?is_from_webapp=1&sender_device=pc" className="text-white hover:text-gray-400">
              <AudiotrackIcon />
            </a>
          </div>
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} AI Prompter. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;