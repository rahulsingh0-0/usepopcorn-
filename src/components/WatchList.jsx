import React from 'react'
import { useState } from 'react';
import WatchSummary from './WatchSummary';



export default function WatchList({children}) {
     const [isOpen2, setIsOpen2] = useState(true);

  return (
     <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (
            <>
             
              <WatchSummary/>
              children
            </>
          )}
        </div>
  )
}
