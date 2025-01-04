import React from 'react';
import { kirby, spidey, alien, h1, h2, h3, p1, p2, m1, m2, m3 } from '../assets/index.js';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Avatar = () => {
  const settings = {
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500 // 1.5 seconds
  };

  const imageSliderSettings = {
    infinite: true,
    speed: 500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500 // 4.5 seconds
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <h1 className="text-4xl font-bold text-white pb-7">Crea tu avatar</h1>
      <div className="flex flex-col sm:flex-row justify-center items-center space-y-8 sm:space-y-0 sm:space-x-8">
        <div className="w-80">
          <Slider {...imageSliderSettings}>
            <div>
              <img src={p1} alt="Kirby" className="w-80 h-80 rounded-full object-cover" />
            </div>
            <div>
              <img src={p2} alt="Kirby" className="w-80 h-80 rounded-full object-cover" />
            </div>
          </Slider>
        </div>
        <span className="text-5xl text-white pr-0 sm:pr-16 pl-0 sm:pl-16">→</span>
        <div className="w-80">
          <Slider {...settings}>
            <div>
              <img src={h1} alt="Alien" className="w-80 h-80" />
            </div>
            <div>
              <img src={h2} alt="Spidey" className="w-80 h-80" />
            </div>
            <div>
              <img src={h3} alt="Spidey" className="w-80 h-80" />
            </div>
            <div>
              <img src={m1} alt="Alien" className="w-80 h-80" />
            </div>
            <div>
              <img src={m2} alt="Spidey" className="w-80 h-80" />
            </div>
            <div>
              <img src={m3} alt="Spidey" className="w-80 h-80" />
            </div>
          </Slider>
        </div>
      </div>
      <h2 className="text-3xl font-bold text-white pt-7">Próximamente</h2>
    </div>
  );
};

export default Avatar;