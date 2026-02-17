import React, { useState, useEffect } from "react";

export const RightSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselItems = [
    {
      url: "https://images.pexels.com/photos/8439694/pexels-photo-8439694.jpeg",
      title: "Precision Healthcare Ecosystem",
      description:
        "Managing clinical analytics and patient care with intuitive, secure, and intelligent tools.",
    },
    {
      url: "https://images.pexels.com/photos/7876154/pexels-photo-7876154.jpeg",
      title: "Advanced Clinical Analytics",
      description:
        "Gain deeper insights into patient data and clinical performance with our real-time analytics suite.",
    },
    {
      url: "https://images.pexels.com/photos/7734586/pexels-photo-7734586.jpeg",
      title: "Seamless Patient Coordination",
      description:
        "Enhance communication between healthcare providers and patients for better care outcomes.",
    },
    {
      url: "https://images.pexels.com/photos/8441863/pexels-photo-8441863.jpeg",
      title: "Integrated Administrative Tools",
      description:
        "Reduce administrative burden with automated scheduling, billing, and document management.",
    },
    {
      url: "https://images.pexels.com/photos/8441820/pexels-photo-8441820.jpeg",
      title: "Secure Data Management",
      description:
        "Industry-leading security protocols to ensure patient confidentiality and data integrity.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center p-8 bg-[#34495E]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {carouselItems.map((item, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${
            index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <img 
            src={item.url} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
      ))}
      
      {/* Glassmorphism Content Card */}
      <div className="absolute bottom-10 left-8 right-8 z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 lg:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-transparent opacity-60"></div>
        
        <div className="relative z-20">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
            {carouselItems[currentImageIndex].title}
          </h2>
          <p className="text-blue-50/90 text-sm lg:text-base leading-relaxed mb-6 opacity-90">
            {carouselItems[currentImageIndex].description}
          </p>

          {/* Pagination Indicators */}
          <div className="flex items-center space-x-2">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 transition-all duration-500 rounded-full ${
                  index === currentImageIndex 
                    ? "w-8 bg-blue-400" 
                    : "w-1.5 bg-blue-100/30 hover:bg-blue-100/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
