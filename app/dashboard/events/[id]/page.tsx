"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  Download,
  Tag,
  Globe,
  Phone,
  Mail,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Datos de ejemplo expandidos - incluye ownerId para control de permisos
const eventDetails = {
  id: "1",
  name: "Conferencia de Desarrollo Web 2025",
  date: "2025-07-15",
  time: "09:00",
  endTime: "18:00",
  description:
    "La conferencia más importante sobre las últimas tendencias en desarrollo web, con speakers internacionales y workshops prácticos. Este evento reunirá a los mejores profesionales del sector para compartir conocimientos sobre React, Next.js, TypeScript, y las últimas tecnologías web. Incluye sesiones de networking, workshops hands-on y presentaciones de casos de éxito reales.",
  location: "Centro de Convenciones Internacional",
  address: "Av. Principal 123, Ciudad, País",
  category: "Tecnología",
  attendees: 250,
  maxCapacity: 300,
  price: "Gratuito",
  organizer: "TechEvents Corp",
  ownerId: "current-user", // ID del propietario del evento
  contact: {
    email: "info@techevents.com",
    phone: "+1 234 567 8900",
    website: "https://techevents.com",
  },
  status: "Confirmado",
  tags: ["React", "Next.js", "TypeScript", "Web Development", "Frontend"],
  agenda: [
    { time: "09:00 - 09:30", activity: "Registro y bienvenida" },
    { time: "09:30 - 10:30", activity: "Keynote: El futuro del desarrollo web" },
    { time: "10:30 - 11:00", activity: "Coffee break y networking" },
    { time: "11:00 - 12:00", activity: "Workshop: React Server Components" },
    { time: "12:00 - 13:00", activity: "Almuerzo" },
    { time: "13:00 - 14:00", activity: "Panel: Mejores prácticas en TypeScript" },
    { time: "14:00 - 15:00", activity: "Workshop: Next.js App Router" },
    { time: "15:00 - 15:30", activity: "Coffee break" },
    { time: "15:30 - 16:30", activity: "Casos de éxito en producción" },
    { time: "16:30 - 17:30", activity: "Sesión de Q&A y networking" },
    { time: "17:30 - 18:00", activity: "Cierre y sorteos" },
  ],
}

export default function EventDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  // En producción, esto vendría del contexto de autenticación
  const currentUserId = "current-user"
  const isOwner = eventDetails.ownerId === currentUserId

  const handleDelete = async () => {
    if (!isOwner) {
      alert("No tienes permisos para eliminar este evento")
      return
    }

    setIsDeleting(true)
    // Simular eliminación
    setTimeout(() => {
      router.push("/dashboard/events")
    }, 1000)
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmado":
        return "bg-green-100 text-green-800"
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "Cancelado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild className="bg-transparent">
            <Link href="/dashboard/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a mis eventos
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Enviar por email
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Solo mostrar botones de edición/eliminación si es el propietario */}
          {isOwner && (
            <>
              <Button variant="outline" asChild className="bg-transparent">
                <Link href={`/dashboard/events/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:bg-red-50 hover:border-red-200 bg-transparent"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente "{eventDetails.name}" y todos sus
                      datos asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}

          {/* Mensaje para eventos que no son del usuario */}
          {!isOwner && (
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
              Solo puedes editar tus propios eventos
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Event Header */}
          <Card className="shadow-lg border-0 bg-white overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
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
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={`${getCategoryColor(eventDetails.category)} shadow-lg`}>
                      {getCategoryIcon(eventDetails.category)} {eventDetails.category}
                    </Badge>
                    <Badge className={`${getStatusColor(eventDetails.status)} shadow-sm`}>{eventDetails.status}</Badge>
                    {isOwner && <Badge className="bg-blue-100 text-blue-800 shadow-sm">Tu evento</Badge>}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Descripción del Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{eventDetails.description}</p>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Agenda del Evento</CardTitle>
              <CardDescription>Cronograma detallado de actividades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {eventDetails.agenda.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="bg-white">
                        {item.time}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900 flex items-center">
                <Tag className="mr-2 h-5 w-5" />
                Etiquetas
              </CardTitle>
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Información Rápida</CardTitle>
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
                  <p className="text-sm text-gray-600">
                    {eventDetails.attendees} / {eventDetails.maxCapacity}
                  </p>
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
              <div>
                <p className="font-medium text-gray-900">{eventDetails.organizer}</p>
                {isOwner && <p className="text-sm text-blue-600">Eres el organizador de este evento</p>}
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a
                    href={`mailto:${eventDetails.contact.email}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {eventDetails.contact.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a
                    href={`tel:${eventDetails.contact.phone}`}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {eventDetails.contact.phone}
                  </a>
                </div>
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
            </CardContent>
          </Card>

          {/* Actions - Solo para el propietario */}
          {isOwner && (
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Gestionar Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  Registrar Asistente
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Ver Lista de Asistentes
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Generar Reporte
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
