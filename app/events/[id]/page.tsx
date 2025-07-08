"use client"

import Link from "next/link"
import { Calendar, MapPin, Users, DollarSign, Clock, ArrowLeft, User, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Datos de ejemplo para vista pública de evento
const eventDetails = {
  id: "1",
  name: "Conferencia de Desarrollo Web 2025",
  date: "2025-07-15",
  time: "09:00",
  endTime: "18:00",
  description:
    "La conferencia más importante sobre las últimas tendencias en desarrollo web, con speakers internacionales y workshops prácticos. Este evento reunirá a los mejores profesionales del sector para compartir conocimientos sobre React, Next.js, TypeScript, y las últimas tecnologías web.",
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
}

export default function PublicEventDetailsPage({ params }: { params: { id: string } }) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tecnología":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "Artes":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "Negocios":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "Música":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Tecnología":
        return "💻"
      case "Artes":
        return "🎨"
      case "Negocios":
        return "💼"
      case "Música":
        return "🎵"
      default:
        return "📅"
    }
  }

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
                      <h1 className="text-3xl font-bold text-white mb-2">{eventDetails.name}</h1>
                      <div className="flex items-center space-x-4 text-white/90">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(eventDetails.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {eventDetails.time} - {eventDetails.endTime}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getCategoryColor(eventDetails.category)} shadow-lg`}>
                      {getCategoryIcon(eventDetails.category)} {eventDetails.category}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Description */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Sobre este evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{eventDetails.description}</p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Temas principales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {eventDetails.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA for registration */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Te interesa este evento?</h3>
                <p className="text-gray-600 mb-6">
                  Regístrate en nuestra plataforma para contactar al organizador y obtener más información.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    <Link href="/register">Crear Cuenta Gratis</Link>
                  </Button>
                  <Button variant="outline" asChild size="lg" className="bg-transparent">
                    <Link href="/login">Ya tengo cuenta</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Información del evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fecha</p>
                    <p className="text-sm text-gray-600">{new Date(eventDetails.date).toLocaleDateString("es-ES")}</p>
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
                    <p className="text-sm font-medium text-gray-900">Ubicación</p>
                    <p className="text-sm text-gray-600">{eventDetails.location}</p>
                    <p className="text-xs text-gray-500">{eventDetails.address}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Asistentes</p>
                    <p className="text-sm text-gray-600">{eventDetails.attendees} personas registradas</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Precio</p>
                    <p className="text-sm text-gray-600">{eventDetails.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Organizador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{eventDetails.organizer}</p>
                    <p className="text-sm text-gray-500">Organizador del evento</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <a
                      href={eventDetails.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Sitio web
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 text-center">
                    Para contactar al organizador, necesitas{" "}
                    <Link href="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
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
  )
}
