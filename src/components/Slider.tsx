import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    title: 'Summer Sale Collection',
    description: 'Up to 50% off — Limited time only!',
    badge: '🔥 Hot Deal',
    img: 'https://images.pexels.com/photos/1375736/pexels-photo-1375736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    url: '/',
    accent: 'from-amber-400 to-pink-500',
  },
  {
    id: 2,
    title: 'Winter Sale Collection',
    description: 'Cozy styles, incredible prices.',
    badge: '❄️ Winter Picks',
    img: 'https://images.pexels.com/photos/1148960/pexels-photo-1148960.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    url: '/',
    accent: 'from-sky-400 to-indigo-500',
  },
  {
    id: 3,
    title: 'Spring Sale Collection',
    description: 'Fresh looks for the new season.',
    badge: '🌸 New Season',
    img: 'https://images.pexels.com/photos/1144170/pexels-photo-1144170.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    url: '/',
    accent: 'from-green-400 to-teal-500',
  },
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [key, setKey] = useState(0);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setKey((k) => k + 1);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [current]);

  const slide = slides[current];

  return (
    <div className="relative h-[620px] xl:h-[700px] overflow-hidden bg-gray-950">
      {/* Background image with Ken Burns zoom */}
      <div className="absolute inset-0 transition-opacity duration-500" style={{ opacity: animating ? 0 : 1 }}>
        <img
          key={`bg-${current}`}
          src={slide.img}
          alt={slide.title}
          className="w-full h-full object-cover scale-105 animate-[scaleIn_8s_ease_forwards]"
          style={{ animation: 'subtle-zoom 8s ease forwards' }}
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/80 via-gray-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div
        key={`content-${key}`}
        className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16 xl:px-32 text-white max-w-2xl"
        style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.35s ease' }}
      >
        {/* Badge */}
        <div className="animate-fade-up stagger-1 opacity-0-init mb-4">
          <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r ${slide.accent} text-white shadow-lg`}>
            {slide.badge}
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-up stagger-2 opacity-0-init text-5xl xl:text-7xl font-extrabold leading-tight mb-4 drop-shadow-xl">
          {slide.title}
        </h1>

        {/* Description */}
        <p className="animate-fade-up stagger-3 opacity-0-init text-lg xl:text-xl text-gray-200 mb-8 font-light">
          {slide.description}
        </p>

        {/* CTA */}
        <div className="animate-fade-up stagger-4 opacity-0-init flex gap-4">
          <Link to={slide.url}>
            <button className={`relative overflow-hidden group bg-gradient-to-r ${slide.accent} text-white font-bold py-3.5 px-8 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95`}>
              <span className="relative z-10">Shop Now →</span>
              <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
          <Link to={slide.url}>
            <button className="border border-white/40 text-white font-medium py-3.5 px-8 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:border-white/70">
              Explore All
            </button>
          </Link>
        </div>
      </div>

      {/* Dot nav */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? `w-8 h-2.5 bg-gradient-to-r ${slides[i].accent}`
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => goTo((current - 1 + slides.length) % slides.length)}
        className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        ‹
      </button>
      <button
        onClick={() => goTo((current + 1) % slides.length)}
        className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full glass text-white flex items-center justify-center hover:bg-white/20 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        ›
      </button>

      <style>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.08); }
          to   { transform: scale(1.0); }
        }
      `}</style>
    </div>
  );
};

export default Slider;
