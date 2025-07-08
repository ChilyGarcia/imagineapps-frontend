"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  ArrowLeft,
  User,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BACKEND_URL } from "@/config/env";

// Tipo de datos que llega del backend
type BackendEvent = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  start_time: string | null;
  prize: string | null;
  category: {
    name: string;
    description: string;
    id: number;
  };
  user: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    is_active: boolean;
    id: number;
  };
};

// Tipo de datos para mostrar en la UI
type EventDetails = {
  id: string;
  name: string;
  date: string;
  time: string;
  endTime: string;
  description: string;
  location: string;
  address: string;
  category: string;
  attendees: number;
  maxCapacity: number;
  price: string;
  organizer: string;
  contact: {
    email: string;
    website: string;
  };
  image: string;
  tags: string[];
};

// Datos de ejemplo como fallback en caso de error
const fallbackEventDetails: EventDetails = {
  id: "1",
  name: "Conferencia de Desarrollo Web 2025",
  date: "2025-07-15",
  time: "09:00",
  endTime: "18:00",
  description:
    "La conferencia más importante sobre las últimas tendencias en desarrollo web, con speakers internacionales y workshops prácticos.",
  location: "Centro de Convenciones Internacional",
  address: "Av. Principal 123, Ciudad, País",
  category: "Tecnología",
  attendees: 250,
  maxCapacity: 300,
  price: "Gratuito",
  organizer: "TechEvents Corp",
  contact: {
    email: "info@techevents.com",
    website: "https://techevents.com",
  },
  image: "/placeholder.svg?height=400&width=800",
  tags: ["React", "Next.js", "TypeScript", "Web Development", "Frontend"],
};

export default function PublicEventDetailsPage() {
  // Usamos useParams() que es la forma recomendada para componentes cliente en Next.js
  const params = useParams();
  // El id viene como string o como array, así que lo convertimos a string
  const eventId = Array.isArray(params.id) ? params.id[0] : params.id as string;
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log("Iniciando fetch para evento público con ID:", eventId);
      setIsLoading(true);

      try {
        console.log(`Realizando fetch a: ${BACKEND_URL}/events/${eventId}`);

        const response = await fetch(`${BACKEND_URL}/events/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          cache: "no-store",
        });

        console.log("Respuesta del servidor:", response);

        if (!response.ok) {
          throw new Error(`Error al cargar el evento: ${response.status}`);
        }

        const data: BackendEvent = await response.json();
        console.log("Datos recibidos del backend:", data);

        // Convertir los datos del backend al formato que espera nuestra UI
        const formattedEvent: EventDetails = {
          id: data.id.toString(),
          name: data.name,
          date: data.start_date
            ? new Date(data.start_date).toISOString().split("T")[0]
            : "",
          time: data.start_time || "00:00",
          endTime: data.end_date
            ? new Date(data.end_date).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "00:00",
          description: data.description || "",
          location: data.location || "",
          address: data.location || "", // Usamos location como address también
          category: data.category ? data.category.name : "",
          attendees: 0, // Valor por defecto
          maxCapacity: 100, // Valor por defecto
          price: data.prize || "Gratuito",
          organizer: data.user
            ? `${data.user.first_name} ${data.user.last_name}`
            : "",
          contact: {
            email: data.user ? data.user.email : "",
            website: "", // No hay campo website en el backend
          },
          image: "/placeholder.svg?height=400&width=800", // Imagen por defecto
          tags: [], // No hay campo tags en el backend
        };

        setEventDetails(formattedEvent);
      } catch (err) {
        console.error("Error al obtener detalles del evento:", err);
        setError("No se pudo cargar la información del evento");
        // Usar datos de respaldo en caso de error
        setEventDetails(fallbackEventDetails);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tecnología":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "Artes":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "Negocios":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "Música":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tecnología":
        return "💻";
      case "Artes":
        return "🎨";
      case "Negocios":
        return "💼";
      case "Música":
        return "🎵";
      default:
        return "📅";
    }
  };

  // Mostrar estado de carga
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="ml-3 text-lg font-medium">Cargando evento...</p>
      </div>
    );
  }

  // Mostrar mensaje de error
  if (error && !eventDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-red-800 text-xl font-bold">Error</h2>
          <p className="text-red-600">{error}</p>
          <Button variant="outline" asChild className="mt-4 bg-transparent">
            <Link href="/">Volver a eventos</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Si no hay datos, no renderizar el resto
  if (!eventDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a eventos
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <Card className="shadow-lg border-0 bg-white overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={eventDetails.image || "/placeholder.svg"}
                  alt={eventDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {eventDetails.name}
                      </h1>
                      <div className="flex items-center space-x-4 text-white/90">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(eventDetails.date).toLocaleDateString(
                            "es-ES",
                            {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {eventDetails.time} - {eventDetails.endTime}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`${getCategoryColor(
                        eventDetails.category
                      )} shadow-lg`}
                    >
                      {getCategoryIcon(eventDetails.category)}{" "}
                      {eventDetails.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">
                  Sobre este evento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {eventDetails.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Información del evento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha</p>
                    <p className="text-sm text-gray-600">
                      {new Date(eventDetails.date).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Horario</p>
                    <p className="text-sm text-gray-600">
                      {eventDetails.time} - {eventDetails.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Ubicación
                    </p>
                    <p className="text-sm text-gray-600">
                      {eventDetails.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {eventDetails.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Precio</p>
                    <p className="text-sm text-gray-600">
                      {eventDetails.price}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">
                  Organizador
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {eventDetails.organizer}
                    </p>
                    <p className="text-sm text-gray-500">
                      Organizador del evento
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    Para contactar al organizador, necesitas{" "}
                    <Link
                      href="/register"
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      crear una cuenta
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
