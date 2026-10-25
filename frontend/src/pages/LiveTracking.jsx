import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Clock, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons
const busIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
});

const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

const destIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    className: 'hue-rotate-180'
});

// Haversine formula to calculate geographic distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

const LiveTracking = () => {
    const [pnr, setPnr] = useState('');
    const [trackingData, setTrackingData] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [busLocation, setBusLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [locationDenied, setLocationDenied] = useState(false);
    
    // Watch bus movement
    useEffect(() => {
        let interval;
        if (trackingData && busLocation && destinationLocation) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prev + 0.5; // move 0.5% every second
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [trackingData, busLocation, destinationLocation]);

    // Update bus location based on progress
    const initialBusLocation = useRef(null);
    useEffect(() => {
        if (trackingData && initialBusLocation.current && destinationLocation) {
            const start = initialBusLocation.current;
            const end = destinationLocation;
            const lat = start.lat + (end.lat - start.lat) * (progress / 100);
            const lng = start.lng + (end.lng - start.lng) * (progress / 100);
            setBusLocation({ lat, lng });
            
            // Calculate real remaining distance between current bus location and destination
            const remDist = calculateDistance(lat, lng, end.lat, end.lng).toFixed(1);
            setTrackingData(prev => ({ ...prev, progress: Math.floor(progress), distance: `${remDist} km` }));
        }
    }, [progress, destinationLocation, trackingData]);


    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLocationDenied(true);
            return;
        }

        setLoadingLocation(true);
        setError(null);
        setLocationDenied(false);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                setLoadingLocation(false);
            },
            (err) => {
                setLoadingLocation(false);
                setLocationDenied(true);
                setError('Location access is disabled.');
            }
        );
    };

    const handleTrack = (e) => {
        e.preventDefault();
        
        if (!userLocation) {
            setError('Please provide your location first by clicking "Use My Current Location".');
            return;
        }

        setError(null);
        
        // Simulate bus starting slightly offset and destination further away
        const { lat: latitude, lng: longitude } = userLocation;
        const startLat = latitude - 0.15;
        const startLng = longitude - 0.15;
        const endLat = latitude + 0.8;
        const endLng = longitude + 0.8;
        
        initialBusLocation.current = { lat: startLat, lng: startLng };
        setBusLocation({ lat: startLat, lng: startLng });
        setDestinationLocation({ lat: endLat, lng: endLng });
        setProgress(25); // Start at 25% progress

        const totalDist = calculateDistance(startLat, startLng, endLat, endLng);
        const remDist = (totalDist * 0.75).toFixed(1);

        setTrackingData({
            pnr,
            bus_number: 'AP-29-TA-1234',
            operator: 'BusBooker Express',
            source: 'Your Location Area',
            destination: 'Hyderabad',
            progress: 25,
            eta: '45 minutes',
            distance: `${remDist} km`,
            status: 'On Route'
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 reveal">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-[#0B2046] uppercase">Demo <span className="text-[#F97316]">Live Tracking</span></h1>
                <p className="text-gray-500 mt-2 font-medium">Demo tracking — bus location is simulated using real geolocation</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                
                {locationDenied && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                        <div>
                            <p className="font-bold">{error}</p>
                            <button 
                                onClick={handleUseCurrentLocation}
                                className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition"
                            >
                                Try Again / Enable Location
                            </button>
                        </div>
                    </div>
                )}
                
                {!locationDenied && error && (
                    <div className="text-red-500 mb-4 font-bold">{error}</div>
                )}

                <div className="flex flex-col md:flex-row gap-6 mb-6 pb-6 border-b border-gray-100 items-center justify-between">
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg mb-2">Step 1: Set Your Location</h3>
                        {userLocation ? (
                            <div className="flex items-center text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg border border-green-200 inline-flex">
                                <MapPin className="mr-2 h-5 w-5" /> Location detected
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                onClick={handleUseCurrentLocation}
                                disabled={loadingLocation}
                                className="bg-[#F97316] hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-6 rounded-xl transition flex items-center"
                            >
                                <MapPin className="mr-2 h-5 w-5" />
                                {loadingLocation ? 'Detecting...' : 'Use My Current Location'}
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-gray-800 text-lg mb-4">Step 2: Track Bus</h3>
                    <form onSubmit={handleTrack} className="flex gap-4 flex-col md:flex-row">
                        <input 
                            type="text" 
                            value={pnr}
                            onChange={(e) => setPnr(e.target.value)}
                            placeholder="Enter PNR (e.g., BUS-1234)" 
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F97316] outline-none"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={!userLocation}
                            className="bg-[#0B2046] hover:bg-blue-900 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-xl transition whitespace-nowrap"
                        >
                            Track Now
                        </button>
                    </form>
                </div>
            </div>

            {trackingData && userLocation && busLocation && destinationLocation && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 premium-card h-full">
                            <h2 className="text-2xl font-bold text-gray-800 mb-1">BUS</h2>
                            <p className="text-gray-500 font-medium mb-4">{trackingData.operator}</p>
                            
                            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm flex items-center mb-6">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                                STATUS: {trackingData.status}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <p className="text-gray-500 text-sm font-bold tracking-wide uppercase">Your Location</p>
                                    <p className="font-semibold text-gray-800 mt-1 flex items-center"><MapPin className="h-4 w-4 mr-1 text-[#F97316]"/> Current Location</p>
                                </div>
                                
                                <div>
                                    <p className="text-gray-500 text-sm font-bold tracking-wide uppercase">Destination</p>
                                    <p className="font-semibold text-gray-800 mt-1 flex items-center"><MapPin className="h-4 w-4 mr-1 text-red-500"/> {trackingData.destination}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold tracking-wide uppercase flex items-center"><Navigation className="h-4 w-4 mr-1" /> Distance</p>
                                        <p className="text-xl font-black text-[#0B2046] mt-1">{trackingData.distance}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold tracking-wide uppercase flex items-center"><Clock className="h-4 w-4 mr-1" /> ETA</p>
                                        <p className="text-xl font-bold text-[#F97316] mt-1">{trackingData.eta}</p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                                        <span>Journey Progress</span>
                                        <span className="font-bold text-gray-800">{trackingData.progress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#0B2046] rounded-full transition-all duration-1000" style={{ width: `${trackingData.progress}%` }}></div>
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-gray-400 text-xs font-medium">Last Updated: Just now</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 h-[550px] bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                        <MapContainer 
                            center={userLocation} 
                            zoom={9} 
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            
                            {/* User Location Marker */}
                            <Marker position={userLocation} icon={userIcon}>
                                <Popup>
                                    <strong>Your Current Location</strong><br/>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                                </Popup>
                            </Marker>

                            {/* Bus Location Marker */}
                            <Marker position={busLocation} icon={busIcon}>
                                <Popup>
                                    <strong>{trackingData.operator}</strong><br/>Status: {trackingData.status}
                                </Popup>
                            </Marker>

                            {/* Destination Marker */}
                            <Marker position={destinationLocation} icon={destIcon}>
                                <Popup>
                                    <strong>{trackingData.destination}</strong><br/>Drop point
                                </Popup>
                            </Marker>

                            {/* Route Polyline */}
                            <Polyline 
                                positions={[initialBusLocation.current, destinationLocation]} 
                                color="#0B2046" 
                                weight={4} 
                                dashArray="10, 10" 
                            />
                            <Polyline 
                                positions={[initialBusLocation.current, busLocation]} 
                                color="#F97316" 
                                weight={5} 
                            />
                        </MapContainer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveTracking;
