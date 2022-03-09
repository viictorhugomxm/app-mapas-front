
import { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -101.1844300,
  lat: 19.7007800,
  zoom: 10
}

export const MapaPage = () => {

  const {setRef, coords, nuevoMarcador$, movimientoMarcador$} = useMapbox(puntoInicial);

  //Nuevo Marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      console.log(marcador);
    })
  },[nuevoMarcador$])

  //Movimiento marcador
  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      console.log(marcador);
    })
  }, [movimientoMarcador$])

  return (
    <>

      <div className="info">
        lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>

      <div 
        ref={setRef}
        className="mapContainer"
      />
    </>
  )
}
