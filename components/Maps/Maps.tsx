'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navigation, DollarSign } from 'lucide-react'
import { FaRegTrashAlt } from 'react-icons/fa'

interface Position {
  lat: number
  lng: number
}

interface RouteInfo {
  distance: number
  duration: number
  coordinates: [number, number][]
}

interface InteractiveMapProps {
  setDeliveryCost: (cost: number) => void
}

export default function InteractiveMap({
  setDeliveryCost
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [userPosition, setUserPosition] = useState<Position | null>({
    lat: -12.0892609,
    lng: -77.0248411
  })
  const [destinationPosition, setDestinationPosition] =
    useState<Position | null>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Cargar Leaflet dinámicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Cargar CSS de Leaflet
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Cargar JavaScript de Leaflet
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          setMapLoaded(true)
        }
        document.head.appendChild(script)
      } catch (error) {
        console.log('Error loading Leaflet:', error)
        setError('Error cargando el mapa')
      }
    }

    loadLeaflet()
  }, [])

  // Obtener ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.log('Error obteniendo ubicación:', error)
          setError(
            'No se pudo obtener la ubicación. Usando ubicación por defecto.'
          )
          // Ubicación por defecto (Ciudad de México)
          setUserPosition({
            lat: -12.0892609,
            lng: -77.0248411
          })
        }
      )
    } else {
      setError('Geolocalización no soportada por el navegador')
      setUserPosition({
        lat: -12.0892609,
        lng: -77.0248411
      })
    }
  }, [])

  // Inicializar mapa cuando Leaflet esté cargado y tengamos la posición del usuario
  useEffect(() => {
    if (
      mapLoaded &&
      userPosition &&
      mapRef.current &&
      !mapInstanceRef.current
    ) {
      const L = (window as any).L

      // Crear el mapa
      const map = L.map(mapRef.current).setView(
        [userPosition.lat, userPosition.lng],
        13
      )

      // Agregar capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map)

      // Crear iconos personalizados
      const startIcon = L.icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      const endIcon = L.icon({
        iconUrl:
          'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })

      // Agregar marcador de posición del usuario
      //   const userMarker = L.marker([userPosition.lat, userPosition.lng], {
      //     icon: startIcon
      //   })
      //     .addTo(map)
      //     .bindPopup(
      //       '<div style="text-align: center;"><strong>Tu ubicación</strong><br><small>Punto de inicio</small></div>'
      //     )

      // Manejar clicks en el mapa
      map.on('click', (e: any) => {
        const { lat, lng } = e.latlng
        setDestinationPosition({ lat, lng })
      })

      mapInstanceRef.current = { map, startIcon, endIcon }
    }
  }, [mapLoaded, userPosition])

  // Manejar cambios en la posición de destino
  useEffect(() => {
    if (mapInstanceRef.current && destinationPosition) {
      const { map, endIcon } = mapInstanceRef.current
      const L = (window as any).L

      // Remover marcador de destino anterior si existe
      if (mapInstanceRef.current.destinationMarker) {
        map.removeLayer(mapInstanceRef.current.destinationMarker)
      }

      // Agregar nuevo marcador de destino
      const destinationMarker = L.marker(
        [destinationPosition.lat, destinationPosition.lng],
        { icon: endIcon }
      )
        .addTo(map)
        .bindPopup(
          '<div style="text-align: center;"><strong>Destino</strong><br><small>Punto de llegada</small></div>'
        )

      mapInstanceRef.current.destinationMarker = destinationMarker

      // Calcular ruta
      if (userPosition) {
        calculateRoute()
      }
    }
  }, [destinationPosition, userPosition])

  // Calcular ruta
  const calculateRoute = async () => {
    if (!userPosition || !destinationPosition) return

    setLoading(true)
    try {
      // Calcular distancia en línea recta como fallback
      const distance = calculateStraightLineDistance(
        userPosition,
        destinationPosition
      )

      const costDelivery = Math.ceil(Number(distance.toFixed(2)) * 10) / 10

      setDeliveryCost(Math.ceil(costDelivery * 1.2))

      // Crear línea recta entre los puntos
      const L = (window as any).L
      const { map } = mapInstanceRef.current

      // Remover ruta anterior si existe
      if (mapInstanceRef.current.routeLine) {
        map.removeLayer(mapInstanceRef.current.routeLine)
      }

      // Agregar nueva línea de ruta
      // necesario descomentar userPosition para ver las lineas conectadas
      const routeLine = L.polyline(
        [
          //   [userPosition.lat, userPosition.lng],
          [destinationPosition.lat, destinationPosition.lng]
        ],
        { color: 'blue', weight: 4, opacity: 0.7 }
      ).addTo(map)

      mapInstanceRef.current.routeLine = routeLine

      // Ajustar vista para mostrar ambos puntos
      // si descomento se mostraria en el mapa ambos puntos conectados
      const group = L.featureGroup([
        // mapInstanceRef.current.userMarker,
        mapInstanceRef.current.destinationMarker
      ])
      //   map.fitBounds(group.getBounds().pad(0.1))
      map.setView([destinationPosition.lat, destinationPosition.lng], 17)

      setRouteInfo({
        distance,
        duration: distance * 2, // Estimación simple: 2 minutos por km
        coordinates: [
          //   [userPosition.lat, userPosition.lng],
          [destinationPosition.lat, destinationPosition.lng]
        ]
      })
    } catch (error) {
      console.error('Error calculando ruta:', error)
      setError('Error calculando la ruta')
    }
    setLoading(false)
  }

  // Calcular distancia en línea recta
  const calculateStraightLineDistance = (
    pos1: Position,
    pos2: Position
  ): number => {
    const R = 6371 // Radio de la Tierra en km
    const dLat = ((pos2.lat - -11.9977078) * Math.PI) / 180
    const dLng = ((pos2.lng - -77.0501454) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  const resetRoute = () => {
    if (mapInstanceRef.current) {
      const { map } = mapInstanceRef.current

      // Remover marcador de destino
      if (mapInstanceRef.current.destinationMarker) {
        map.removeLayer(mapInstanceRef.current.destinationMarker)
        mapInstanceRef.current.destinationMarker = null
        setDeliveryCost(0)
      }

      // Remover línea de ruta
      if (mapInstanceRef.current.routeLine) {
        map.removeLayer(mapInstanceRef.current.routeLine)
        mapInstanceRef.current.routeLine = null
        setDeliveryCost(0)
      }
    }

    setDestinationPosition(null)
    setRouteInfo(null)
  }

  const price = routeInfo ? routeInfo.distance * 1 : 0 // $1 por km

  if (!mapLoaded || !userPosition) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <Card className='w-96'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {/* <Navigation className='h-5 w-5' /> */}
              {!mapLoaded ? 'Cargando mapa...' : 'Obteniendo ubicación...'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <p className='text-muted-foreground'>
              {!mapLoaded
                ? 'Cargando componentes del mapa...'
                : 'Por favor, permite el acceso a tu ubicación para continuar.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='relative w-full h-full'>
      <div ref={mapRef} className='w-full h-full' />

      {/* Panel de información */}
      <div className='absolute bottom-1 right-1 z-[1000] h-auto'>
        <Card className='w-auto'>
          {/* <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Navigation className='h-5 w-5' />
              Información del Viaje
            </CardTitle>
          </CardHeader> */}
          <CardContent className='p-0'>
            {!destinationPosition ? (
              <p className='text-muted-foreground text-sm w-auto'>
                Haz click en el mapa para marcar tu ubicación
              </p>
            ) : (
              <>
                {/* {loading ? (
                  <p className='text-muted-foreground text-sm'>
                    Calculando ruta...
                  </p>
                ) : routeInfo ? (
                  <div className='space-y-3'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium'>Distancia:</span>
                      <span className='text-sm'>
                        {routeInfo.distance.toFixed(2)} km
                      </span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm font-medium'>
                        Tiempo estimado:
                      </span>
                      <span className='text-sm'>
                        {Math.round(routeInfo.duration)} min
                      </span>
                    </div>
                    <div className='border-t pt-3'>
                      <div className='flex justify-between items-center'>
                        <span className='font-medium flex items-center gap-1'>
                          <DollarSign className='h-4 w-4' />
                          Precio total:
                        </span>
                        <span className='text-lg font-bold text-green-600'>
                          ${price.toFixed(2)}
                        </span>
                      </div>
                      <p className='text-xs text-muted-foreground mt-1'>
                        $1.00 por kilómetro
                      </p>
                    </div>
                  </div>
                ) : null} */}

                <Button
                  onClick={resetRoute}
                  variant='outline'
                  className='w-full bg-transparent'
                  size='sm'
                >
                  <FaRegTrashAlt />
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      {/* <div className='absolute bottom-4 left-4 z-[1000]'>
        <Card className='w-72'>
          <CardContent className='pt-4'>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                <span>Pin verde: Tu ubicación actual</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                <span>Pin rojo: Destino (click en el mapa)</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-8 h-0.5 bg-blue-500'></div>
                <span>Línea azul: Ruta calculada</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  )
}
