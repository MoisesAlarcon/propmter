import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';

const Footer = () => {
  return (
    <footer className="bg-[#080909] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex space-x-4 mb-4">
            <a href="https://discord.gg/awsBF6cVgk" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
              <FontAwesomeIcon icon={faDiscord} />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
              <TwitterIcon />
            </a>
            <a href="https://www.instagram.com/heliconprompter?igsh=MW5maHZuN21yMDg4dw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-400">
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