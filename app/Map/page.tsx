'use client'
import React, { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import getData from "../../lib/supabase/client"

const INITIAL_CENTER: [number, number] = [151, -33.814] //ensures that it is a list with exactly two numbers

const INITIAL_ZOOM = 10.12


const Map = () => {

    const mapRef = useRef<mapboxgl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    const [venues, setVenues] = useState<any[] | null>(null)
    const [center, setCenter] = useState(INITIAL_CENTER)
    const [zoom, setZoom] = useState(INITIAL_ZOOM)

    useEffect(() => {
        getData().then((data) => {
            console.log('Supabase data:', data)
            setVenues(data)
        })
    }, [])

  
    useEffect(() => {
        if (!mapRef.current || !venues) return

                
        venues.forEach((venue) => {
            new mapboxgl.Marker()
                .setLngLat([venue.longitude, venue.latitude])
                .setPopup(
                    new mapboxgl.Popup({offset: 25})
                        .setHTML (
                            `<div style="font-family: sans-serif; padding: 12px 16px; max-width: 240px;">
                                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #1a1a1a;">${venue.name}</h3>
                                <p style="margin: 0 0 6px 0; font-size: 13px; color: #555; line-height: 1.4;">${venue.address}</p>
                                <span style="display: inline-block; margin: 8px 0; padding: 3px 10px; font-size: 12px; font-weight: 500; color: #166534; background: #dcfce7; border-radius: 12px;">Billiards</span>
                                <br/>
                                <a href="#" style="display: inline-block; margin-top: 8px; font-size: 13px; color: #2563eb; text-decoration: none; font-weight: 500;">More information &rarr;</a>
                            </div>`
                        )

                )
                .addTo(mapRef.current!)
        })
    }, [venues])

    const handleButtonClick = () => {
        mapRef.current!.flyTo({
            center: INITIAL_CENTER,
            zoom: INITIAL_ZOOM
        })
    }

    useEffect(() => {
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOXTOKEN!
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: center,
            zoom: zoom

        })

        

        mapRef.current.on('move', () => {

            const mapCenter = mapRef.current!.getCenter() // "!" signifies that it could be null so be careful
            const mapZoom = mapRef.current!.getZoom()

            setCenter([mapCenter.lng, mapCenter.lat])
            setZoom(mapZoom)

    })


        return () => {
            mapRef.current?.remove()
        }
    }, [])


   
  return (
    <>
        <div className="relative h-screen w-full">
            <div ref={mapContainerRef} className="h-full w-full" />
            <button
                onClick={handleButtonClick}
                className="absolute top-4 right-4 z-10 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-100 active:bg-gray-200"
            >
                Reset Location
            </button>
        </div>

    </>
  )
}

export default Map