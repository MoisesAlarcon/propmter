import React, { useState } from 'react';
import { download } from '../assets';
import { downloadImage } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const Card = ({ _id, name, prompt, photo }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl group relative shadow-card hover:shadow-cardhover card">
      <div className="w-full h-full max-h-[40vh]">
        <img
          className="w-full h-full object-cover rounded-xl"
          src={photo}
          alt={prompt}
        />
      </div>
      <div className="group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 bg-[#10131f] m-2 p-4 rounded-md">
        <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">{name[0]}</div>
            <p className="text-white text-sm">{name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => downloadImage(_id, photo)} className="outline-none bg-transparent border-none">
              <img src={download} alt="download" className="w-6 h-6 object-contain invert" />
            </button>
            <button type="button" onClick={handleOpenModal} className="outline-none bg-transparent border-none">
              <FontAwesomeIcon icon={faEye} className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative bg-gray-800 p-4 rounded-lg max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              &times;
            </button>
            <div className="flex items-center justify-center max-w-full max-h-full">
              <img src={photo} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;