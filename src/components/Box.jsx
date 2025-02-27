import React from 'react'
import { useState } from 'react';


export default function Box({children}) {
const [isOpen1, setIsOpen1] = useState(true);
  return (
     <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen1((open) => !open)}
          >
            {isOpen1 ? "–" : "+"}
          </button>
          {isOpen1 && (
           children
          )}
        </div>
  )
}
