import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlpY3Rvcmh1Z29teG0iLCJhIjoiY2wwaWZyaHh4MDI5ZTNkcjU3eHVsNDNsaSJ9.E-nh29vFts_zpYPWotnPbg';

const puntoInicial = {
  lng: 5,
  lat: 34,
  zoom: 2
}

export const MapaPage = () => {

  const mapaDiv = useRef();
  const [, setMapa] = useState()

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
      zoom: puntoInicial.zoom // starting zoom
    });

    setMapa(map);
  },[])

  return (
    <>
      <div 
        ref={mapaDiv}
        className="mapContainer"
      />
    </>
  )
}
