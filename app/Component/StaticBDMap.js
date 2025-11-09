'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function StaticBDMap({ valueToSend }) {
  const router = useRouter();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    fetch('/maps/Bangladesh_Political_Map.svg')
      .then(res => res.text())
      .then(setSvg)
      .catch(console.error);
  }, []);

  const handleClick = (e) => {
    let el = e.target;
    let division = null;

    while (el && el.tagName !== 'SVG') {
      if (el.tagName === 'g' || el.tagName === 'G') {
        division = el.getAttribute('id') || el.getAttribute('data-name');
        if (division) break;
      }
      el = el.parentNode;
    }

    if (division) {
      valueToSend(division)
    }

  };

  return (
    <div className="relative w-full h-[520px] bg-white rounded-xl border overflow-hidden shadow">
      {svg ? (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full cursor-pointer"
          dangerouslySetInnerHTML={{ __html: svg }}
          onClick={handleClick}
        />
      ) : (
        <p className="text-center text-gray-500 mt-48">Loading map…</p>
      )}

      <style jsx global>{`
        svg path:hover {
          fill: #60a5fa;
        }
      `}</style>
    </div>
  );
}
