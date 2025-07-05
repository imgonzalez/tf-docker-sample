import React, { useEffect, useState } from 'react';

function ColorPage() {
  const [color, setColor] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/colorsrgb')
      .then((res) => res.json())
      .then((data) => {
        setColor(data.color);
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ color: color ? color : '#000' }}>
        {color ? 'MY RANDOM COLOR' : 'Loading...'}
      </h1>
    </div>
  );
}

export default ColorPage;
