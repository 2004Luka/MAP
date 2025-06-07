import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './Map'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      <h1 className='text-4xl font-bold'>GeoRoutes</h1>
    </div>
    <div className='mt-8'>
      <Map />
    </div>
    </>
  )
}

export default App
