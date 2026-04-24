import React from 'react';

function Footer({ isSidebarVisible }) {
  return (
    <>
      <div className={`bottom-0 right-0 border-t border-slate-200/80 bg-white/80 shadow-inner text-slate-500 backdrop-blur-xl transition-all duration-300 flex justify-between items-center h-fit w-full max-md:py-4 md:py-5 max-sm:text-sm ${isSidebarVisible ? 'md:ml-60 md:w-[calc(100%-15rem)] px-10' : 'ml-0 px-4'}`}>
        <div className="flex flex-col md:flex-row text-left md:items-center">
          <span className="font-semibold">Developed & Maintained by</span>
          <span className="px-1">
            <a
              href=""
              target='_blanck'
              className='cursor-pointer font-bold text-blue-700 no-underline hover:text-blue-800'
            >
              kauloju deepthi
            </a>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center text-right mt-2 sm:mt-0">
          <span className="font-semibold">Version</span>
          <span className="px-1">1.0.1</span>
        </div>
      </div>
    </>
  )
}
export default Footer
