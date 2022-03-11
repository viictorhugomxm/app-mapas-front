
import { useEffect, useContext } from 'react';
import {SocketContext} from '../context/SocketContext'
import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
  lng: -101.1844300,
  lat: 19.7007800,
  zoom: 10
}

export const MapaPage = () => {

  const {setRef, coords, nuevoMarcador$, movimientoMarcador$, agregarMarcador, actualizarPosicion} = useMapbox(puntoInicial);
  const {socket} = useContext(SocketContext);

  //Escuchar los marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', (marcadores)=> {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key)
      }
    } )
  },[socket, agregarMarcador])

  //Nuevo Marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador);
    })
  },[nuevoMarcador$, socket])

  //Movimiento marcador
  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      socket.emit('marcador-actualizado', marcador);
    })
  }, [movimientoMarcador$])

  //Movimiento del marcador mediante sockets
  useEffect(() => {
    socket.on('marcador-actualizado', (marcador) => {
      actualizarPosicion(marcador)
    })
  },[socket, actualizarPosicion])

  //Escuchar nuevos marcadores
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      agregarMarcador(marcador, marcador.id)
    })
  }, [socket, agregarMarcador])

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
