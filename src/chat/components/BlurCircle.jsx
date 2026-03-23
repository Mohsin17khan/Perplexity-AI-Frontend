import React from 'react'

const BlurCircle = ({ top = 'auto', left = 'auto', right = 'auto', bottom = 'auto', color = '20, 184, 166' }) => {
  return (
    <div
      style={{
        top, left, right, bottom,
        position: 'absolute',
        height: '400px',
        width: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(${color}, 0.18), transparent 70%)`,
        filter: 'blur(30px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default BlurCircle