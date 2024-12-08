import React, { useState } from "react";
import {FiChevronLeft, FiChevronRight } from "react-icons/fi";
function ImageSlider(postImages) {
  const images = postImages.images;
  const [currentImage, setCurrentImage] = useState(0);

  const handlePrevious = () => {
    setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const handleNext = () => {
    setCurrentImage(currentImage === images.length - 1 ? 0 : currentImage + 1);
  };

  return (
    <>
      {
        images.length > 0 && (
          <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
          <>
            {images.map((image,index) =>(
            <img key={index} src={image} alt="image" 
              className={`${currentImage === index? "block":"hidden"}`}
                />
            ))}
            {/* slider buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition duration-300"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition duration-300"
                >
                  <FiChevronRight size={24} />
                </button>
              </>
            )}
          </>
      </div>
        )
      }
    </>
  );
}

export default ImageSlider;
