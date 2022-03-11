import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import {v4} from 'uuid'
import { Subject } from 'rxjs';
// import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker';

mapboxgl.accessToken = 'pk.eyJ1IjoidmlpY3Rvcmh1Z29teG0iLCJhIjoiY2wwaWZyaHh4MDI5ZTNkcjU3eHVsNDNsaSJ9.E-nh29vFts_zpYPWotnPbg';


export const useMapbox = (puntoInicial) => {

  //Referencia al DIV del mapa
  const mapaDiv = useRef();
  const setRef = useCallback((node) => {
    mapaDiv.current = node
  }, [])

  //Referencia a los marcadores
  const marcadores = useRef();

  //Observables de RXJS
  const movimientoMarcador = useRef(new Subject())
  const nuevoMarcador = useRef(new Subject())

  //Mapas y coords
  const mapa = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  //Funcionn para agregar marcadores
  const agregarMarcador = useCallback((ev, id) => {
    const {lng, lat} = ev.lngLat || ev;
    const marker = new mapboxgl.Marker()
    marker.id = id ?? v4()


    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true)


    //Asignando el objeto de marcadores
    marcadores.current[marker.id] = marker;

    if(!id) {
      nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
      })
    }

    //Si el marcador tiene ID no emitir
    nuevoMarcador.current.next({
      id: marker.id,
      lng,
      lat
    })

    //Escuchando movimientos del marcador
    marker.on('drag',({target}) => {
      const {id} = target
      const {lng, lat} = target.getLngLat();
      movimientoMarcador.current.next({id, lng, lat})
    })
  },[])

  const actualizarPosicion = useCallback(({id, lng,lat}) => {
    marcadores.current[id].setLngLat([lng])

  }, [])

  useEffect(() => {
    
    // mapboxgl.workerClass = MapboxWorker;
    const map = new mapboxgl.Map({
      container: mapaDiv.current, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [puntoInicial.lng, puntoInicial.lat], // starting position [lng, lat]
      zoom: puntoInicial.zoom // starting zoom
    });

    mapa.current = map;
  },[puntoInicial])

  //Cuando se mueve el mapa
  useEffect(() => {
    mapa.current?.on('move', () => {
      const {lng, lat} = mapa.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    })

  }, [])

  // Agregando marcadores cuandoo hago click
  useEffect(() => {
    mapa.current?.on('click', agregarMarcador)

  }, [agregarMarcador])
  

  return {
    agregarMarcador,
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
    setRef,
    actualizarPosicion
  }
}
