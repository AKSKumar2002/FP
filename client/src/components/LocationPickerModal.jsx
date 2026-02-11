import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Target, X, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icon in Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPickerModal = ({ isOpen, onClose, onLocationSelect }) => {
    const [position, setPosition] = useState(null);
    const [address, setAddress] = useState("Locating...");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapType, setMapType] = useState('street'); // 'street' or 'satellite'

    const getCurrentLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setPosition([latitude, longitude]);
                reverseGeocode(latitude, longitude);
                setIsLoading(false);
            },
            (err) => {
                console.error("Error getting location", err);
                setIsLoading(false);

                // Primary fallback for Coimbatore
                const coimbatore = [11.0168, 76.9558];
                setPosition(coimbatore);
                reverseGeocode(coimbatore[0], coimbatore[1]);

                if (err.code === 1) {
                    setError("Location access denied. Centered on Coimbatore for manual selection.");
                } else {
                    setError("Could not pinpoint your location. Centered on Coimbatore.");
                }
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await response.json();
            setAddress(data.display_name);
            return data;
        } catch (error) {
            console.error("Reverse geocoding failed", error);
            setAddress("Address not found");
        }
    };

    useEffect(() => {
        if (isOpen) {
            getCurrentLocation();
        } else {
            // Reset state when closed
            setPosition(null);
            setError(null);
            setAddress("Locating...");
        }
    }, [isOpen]);

    const LocationMarker = () => {
        const map = useMap();
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                reverseGeocode(lat, lng);
                map.flyTo(e.latlng, map.getZoom());
            },
        });

        return position === null ? null : (
            <Marker position={position} draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const marker = e.target;
                        const { lat, lng } = marker.getLatLng();
                        setPosition([lat, lng]);
                        reverseGeocode(lat, lng);
                    }
                }}
            />
        );
    };

    const MapRecenter = ({ position }) => {
        const map = useMap();
        useEffect(() => {
            if (position) map.setView(position);
        }, [position]);
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
                            <div>
                                <h3 className="text-xl font-extrabold text-gray-800 tracking-tight">Select Location</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-orange-500 animate-pulse' : 'bg-green-500'}`}></div>
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        {isLoading ? 'Searching...' : 'Live Map View'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 rounded-full transition-all active:scale-90"
                            >
                                <X size={24} className="text-gray-400" />
                            </button>
                        </div>

                        {/* Map Area */}
                        <div className="flex-1 relative bg-gray-100 overflow-hidden">
                            {position ? (
                                <MapContainer
                                    center={position}
                                    zoom={15}
                                    className="w-full h-full z-0"
                                    zoomControl={false}
                                >
                                    <TileLayer
                                        url={mapType === 'street'
                                            ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                        }
                                        attribution={mapType === 'street'
                                            ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            : 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
                                        }
                                    />
                                    <LocationMarker />
                                    <MapRecenter position={position} />
                                </MapContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full gap-5 bg-white p-8">
                                    {error ? (
                                        <div className="flex flex-col items-center text-center max-w-xs scale-in-center">
                                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                                                <AlertCircle size={32} />
                                            </div>
                                            <p className="text-gray-800 font-bold text-lg">Location Access Error</p>
                                            <p className="text-sm text-gray-500 mt-2 leading-relaxed italic">{error}</p>

                                            <button
                                                onClick={getCurrentLocation}
                                                className="mt-6 flex items-center gap-2 text-primary font-bold bg-green-50 px-6 py-2 rounded-full border border-primary/10 active:scale-95 transition-all"
                                            >
                                                <RefreshCw size={18} />
                                                Retry Access
                                            </button>

                                            <button
                                                onClick={() => setPosition([11.0168, 76.9558])}
                                                className="mt-4 text-xs text-gray-400 underline uppercase tracking-widest font-bold"
                                            >
                                                Start with Coimbatore instead
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="relative">
                                                <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
                                                <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-800 font-bold">Pinpointing your location</p>
                                                <p className="text-xs text-gray-400 mt-1 uppercase tracking-tighter">Please grant location access</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Controls Overlay */}
                            {position && (
                                <div className="absolute right-4 bottom-4 z-[100] flex flex-col gap-3">
                                    {/* Satellite Toggle */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setMapType(mapType === 'street' ? 'satellite' : 'street')}
                                        className="bg-white p-3 rounded-2xl shadow-2xl text-gray-700 hover:bg-gray-50 transition-all border border-gray-100 flex flex-col items-center justify-center gap-1"
                                    >
                                        <div className={`w-10 h-10 rounded-xl overflow-hidden border-2 ${mapType === 'satellite' ? 'border-primary' : 'border-gray-200'}`}>
                                            <img
                                                src={mapType === 'street'
                                                    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0tT_Y2E_5qY3qGv6hYfL-LpA6mN1f0z9W7g&s"
                                                    : "https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i23571!3i14466!2m3!1e0!2sm!3i633036814!3m17!2sen!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m3!1e12!2b1!4b1!4m2!1e48!1203!5m3!1sRndGZ5_nMc_p4-EPidm9sAg!4m1!1i2!6m1!1e1"
                                                }
                                                alt="Map Type"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-tighter">
                                            {mapType === 'street' ? 'Satellite' : 'Street'}
                                        </span>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={getCurrentLocation}
                                        className="bg-white p-4 rounded-2xl shadow-2xl text-primary hover:bg-green-50 transition-all border border-green-100 flex items-center justify-center"
                                    >
                                        <Target size={24} strokeWidth={2.5} />
                                    </motion.button>
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-white border-t rounded-t-[2.5rem] mt-[-2.5rem] relative z-10 shadow-[0_-20px_40px_rgba(0,0,0,0.08)]">
                            <div className="flex gap-4 items-start mb-6 group">
                                <div className="mt-1 p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-lg shadow-green-200">
                                    <MapPin size={24} strokeWidth={2.5} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1.5">Delivery Destination</p>
                                    <p className="text-[15px] text-gray-800 font-bold leading-tight group-hover:text-primary transition-colors">
                                        {position ? address : (error ? "Please pick manually" : "Locating your current address...")}
                                    </p>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={async () => {
                                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`);
                                    const data = await res.json();
                                    onLocationSelect(data);
                                    onClose();
                                }}
                                disabled={!position}
                                className="w-full bg-gradient-to-r from-primary to-emerald-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-green-200 uppercase tracking-widest disabled:opacity-50"
                            >
                                <Check size={24} strokeWidth={3} />
                                Confirm Location
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LocationPickerModal;
