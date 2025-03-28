import React from 'react';

const Home = () => {
  return (
    <div className="w-full h-full overflow-hidden bg-teal-500"> {/* Add overflow-hidden to prevent scrolling */}
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('../public/assets/sp1.jpg')", // Use the correct path for your image
          height: '100%', // Ensure it covers the entire height of the parent div
          width: '100%',  // Ensure it covers the entire width of the parent div
        }}
      >
        {/* Background overlay (optional) */}
        {/* <div className="absolute inset-0 bg-black opacity-50"></div> */}
      </div>

      {/* Text with left alignment and animation */}
      <div className="relative flex items-center justify-start pl-12 w-full h-full">
        <div className="mt-20">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-white font-cursive shadow-lg animate-slideInLeft">
            AURA TRACKER
            <br />
            <span className="text-lg md:text-xl lg:text-2xl">Campus Web Tracker Application</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
