"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Filter, Plus, Search, Trash2, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo - solo eventos del usuario actual
const initialEvents = [
  {
    id: "1",
    name: "Conferencia de Desarrollo Web 2025",
    date: "2025-07-15",
    description:
      "La conferencia más importante sobre las últimas tendencias en desarrollo web, con speakers internacionales y workshops prácticos.",
    location: "Centro de Convenciones Internacional",
    category: "Tecnología",
    attendees: 250,
    price: "Gratuito",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "2",
    name: "Exposición de Arte Moderno",
    date: "2025-07-20",
    description:
      "Una fascinante exposición que presenta obras de los artistas contemporáneos más influyentes de la región.",
    location: "Galería Nacional de Arte",
    category: "Artes",
    attendees: 150,
    price: "$25",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "3",
    name: "Workshop de Marketing Digital",
    date: "2025-08-05",
    description:
      "Taller intensivo sobre estrategias avanzadas de marketing digital, SEO, redes sociales y analítica web.",
    location: "Hotel Business Center Plaza",
    category: "Negocios",
    attendees: 80,
    price: "$150",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "4",
    name: "Festival de Música Indie 2025",
    date: "2025-08-15",
    description:
      "El festival más esperado del año con bandas independientes locales e internacionales en un ambiente único.",
    location: "Parque Central de la Ciudad",
    category: "Música",
    attendees: 500,
    price: "$45",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "5",
    name: "Seminario de Inteligencia Artificial",
    date: "2025-09-10",
    description: "Seminario sobre las aplicaciones prácticas de la IA en diferentes industrias.",
    location: "Universidad Tecnológica",
    category: "Tecnología",
    attendees: 200,
    price: "$75",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "6",
    name: "Taller de Pintura Abstracta",
    date: "2025-09-22",
    description: "Aprende técnicas avanzadas de pintura abstracta con artistas reconocidos.",
    location: "Estudio de Arte Central",
    category: "Artes",
    attendees: 30,
    price: "$120",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "7",
    name: "Conferencia de Emprendimiento",
    date: "2025-10-05",
    description: "Evento para emprendedores con casos de éxito y networking.",
    location: "Centro Empresarial",
    category: "Negocios",
    attendees: 300,
    price: "$50",
    ownerId: "current-user", // ID del usuario actual
  },
  {
    id: "8",
    name: "Concierto de Jazz",
    date: "2025-10-18",
    description: "Una noche mágica con los mejores músicos de jazz de la región.",
    location: "Teatro Municipal",
    category: "Música",
    attendees: 400,
    price: "$35",
    ownerId: "current-user", // ID del usuario actual
  },
]

const EVENTS_PER_PAGE = 6

export default function EventsPage() {
  const [events, setEvents] = useState(initialEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [dateFilter, setDateFilter] = useState("Todos")
  const [currentPage, setCurrentPage] = useState(1)

  const currentUserId = "current-user" // En producción, esto vendría del contexto de autenticación

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
    // Ajustar página si es necesario
    const newTotalEvents = events.length - 1
    const maxPage = Math.ceil(newTotalEvents / EVENTS_PER_PAGE)
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "Todos" || event.category === categoryFilter

    let matchesDate = true
    if (dateFilter !== "Todos") {
      const eventDate = new Date(event.date)
      const now = new Date()
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

      switch (dateFilter) {
        case "Esta semana":
          matchesDate = eventDate >= now && eventDate <= nextWeek
          break
        case "Este mes":
          matchesDate = eventDate >= now && eventDate <= nextMonth
          break
        case "Pasados":
          matchesDate = eventDate < now
          break
      }
    }

    return matchesSearch && matchesCategory && matchesDate && event.ownerId === currentUserId
  })

  // Paginación
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE)
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE)

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Mis Eventos
            </h1>
            <p className="text-lg text-gray-600">Gestiona y organiza todos tus eventos desde aquí</p>
          </div>
          <Button
            asChild
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Link href="/dashboard/events/create">
              <Plus className="mr-2 h-4 w-4" />
              Crear Evento
            </Link>
          </Button>
        </div>

        {/* Stats Cards - Solo 3 tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Eventos</p>
                  <p className="text-2xl font-bold text-blue-900">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Total Asistentes</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {events.reduce((sum, event) => sum + event.attendees, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Eventos Activos</p>
                  <p className="text-2xl font-bold text-green-900">
                    {events.filter((event) => new Date(event.date) >= new Date()).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar eventos por nombre..."
                className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50 border-gray-200">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filtrar por categoría</SelectLabel>
                  <SelectItem value="Todos">Todas las categorías</SelectItem>
                  <SelectItem value="Tecnología">💻 Tecnología</SelectItem>
                  <SelectItem value="Artes">🎨 Artes</SelectItem>
                  <SelectItem value="Negocios">💼 Negocios</SelectItem>
                  <SelectItem value="Música">🎵 Música</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50 border-gray-200">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filtrar por fecha</SelectLabel>
                  <SelectItem value="Todos">Todas las fechas</SelectItem>
                  <SelectItem value="Esta semana">Esta semana</SelectItem>
                  <SelectItem value="Este mes">Este mes</SelectItem>
                  <SelectItem value="Pasados">Eventos pasados</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedEvents.map((event) => (
          <Card
            key={event.id}
            className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border-0 shadow-md overflow-hidden"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-2 text-gray-600">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(event.date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </div>
                <Badge className={`${getCategoryColor(event.category)} text-xs font-medium px-2 py-1 shadow-sm`}>
                  {getCategoryIcon(event.category)} {event.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed">{event.description}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="mr-2 h-3 w-3 text-gray-400" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-1 h-3 w-3 text-gray-400" />
                    <span>{event.attendees} asistentes</span>
                  </div>
                  <div className="text-sm font-semibold text-green-600">{event.price}</div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
              <Button
                variant="outline"
                asChild
                className="flex-1 mr-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors bg-transparent"
              >
                <Link href={`/dashboard/events/${event.id}`}>Ver Detalles</Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors bg-transparent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente "{event.name}" y todos sus datos
                      asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}

        {paginatedEvents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center bg-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100">
              <Calendar className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">No se encontraron eventos</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              No hay eventos que coincidan con tus filtros. Intenta ajustar los criterios de búsqueda o crea un nuevo
              evento.
            </p>
            <Button
              className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              asChild
            >
              <Link href="/dashboard/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Crear tu primer evento
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)} de{" "}
                {filteredEvents.length} eventos
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={
                        currentPage === page
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-transparent"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="bg-transparent"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
