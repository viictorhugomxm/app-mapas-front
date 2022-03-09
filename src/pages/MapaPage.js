
import { useEffect, useContext } from 'react';
import {SocketContext} from '../context/SocketContext'
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -101.1844300,
  lat: 19.7007800,
  zoom: 10
}

export const MapaPage = () => {

  const {setRef, coords, nuevoMarcador$, movimientoMarcador$} = useMapbox(puntoInicial);
  const {socket} = useContext(SocketContext);

  //Escuchar los marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores)=> {
      console.log(marcadores)
    } )
  })

  //Nuevo Marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador);
    })
  },[nuevoMarcador$, socket])

  //Movimiento marcador
  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      console.log(marcador);
    })
  }, [movimientoMarcador$])

  //Escuchar nuevos marcadores
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      console.log(marcador)
    })
  }, [socket])

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
