"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Filter, Search, MapPin, Users, Eye, User, LogIn, ChevronLeft, ChevronRight } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo - eventos públicos de todos los usuarios
const publicEvents = [
  {
    id: "1",
    name: "Conferencia de Desarrollo Web 2025",
    date: "2025-07-15",
    description: "La conferencia más importante sobre las últimas tendencias en desarrollo web.",
    location: "Centro de Convenciones Internacional",
    category: "Tecnología",
    attendees: 250,
    price: "Gratuito",
    organizer: "TechEvents Corp",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "2",
    name: "Exposición de Arte Moderno",
    date: "2025-07-20",
    description: "Una fascinante exposición que presenta obras de artistas contemporáneos.",
    location: "Galería Nacional de Arte",
    category: "Artes",
    attendees: 150,
    price: "$25",
    organizer: "Galería Nacional",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    name: "Workshop de Marketing Digital",
    date: "2025-08-05",
    description: "Taller intensivo sobre estrategias avanzadas de marketing digital.",
    location: "Hotel Business Center Plaza",
    category: "Negocios",
    attendees: 80,
    price: "$150",
    organizer: "Marketing Pro",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "4",
    name: "Festival de Música Indie 2025",
    date: "2025-08-15",
    description: "El festival más esperado del año con bandas independientes.",
    location: "Parque Central de la Ciudad",
    category: "Música",
    attendees: 500,
    price: "$45",
    organizer: "Indie Music Fest",
    image: "/placeholder.svg?height=200&width=400",
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
    organizer: "AI Institute",
    image: "/placeholder.svg?height=200&width=400",
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
    organizer: "Arte Studio",
    image: "/placeholder.svg?height=200&width=400",
  },
]

export default function PublicEventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [dateFilter, setDateFilter] = useState("Todos")
  const [currentPage, setCurrentPage] = useState(1)
  const [EVENTS_PER_PAGE, setEVENTS_PER_PAGE] = useState(6)
  const [goToPage, setGoToPage] = useState<number | undefined>(undefined)

  const filteredEvents = publicEvents.filter((event) => {
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

    return matchesSearch && matchesCategory && matchesDate
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EventManager
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Iniciar Sesión
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Link href="/register">
                  <User className="mr-2 h-4 w-4" />
                  Registrarse
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Descubre eventos{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              increíbles
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora una amplia variedad de eventos organizados por nuestra comunidad. Desde conferencias tecnológicas
            hasta festivales de arte, encuentra el evento perfecto para ti.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-900 mb-2">{publicEvents.length}</div>
              <div className="text-sm font-medium text-blue-600">Eventos Disponibles</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-900">
                {publicEvents.reduce((sum, event) => sum + event.attendees, 0)}
              </div>
              <div className="text-sm font-medium text-purple-600">Personas Participando</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-900">
                {new Set(publicEvents.map((event) => event.category)).size}
              </div>
              <div className="text-sm font-medium text-green-600">Categorías Diferentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-sm">
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
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge className={`${getCategoryColor(event.category)} text-xs font-medium px-2 py-1 shadow-lg`}>
                    {getCategoryIcon(event.category)} {event.category}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {event.name}
                </CardTitle>
                <CardDescription className="flex items-center text-gray-600">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(event.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-sm text-gray-600 leading-relaxed">{event.description}</p>
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
                  <div className="text-xs text-gray-500">Organizado por {event.organizer}</div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <Button
                  variant="outline"
                  asChild
                  className="w-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors bg-transparent"
                >
                  <Link href={`/events/${event.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalles
                  </Link>
                </Button>
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
                No hay eventos que coincidan con tu búsqueda. Intenta ajustar los filtros o explora otras categorías.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)} de{" "}
                    {filteredEvents.length} eventos
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Events per page select */}
                    <div>
                      <Select
                        value={String(EVENTS_PER_PAGE)}
                        onValueChange={(value) => {
                          setEVENTS_PER_PAGE(Number(value))
                          setCurrentPage(1) // Reset to first page when changing events per page
                        }}
                      >
                        <SelectTrigger className="w-[120px] h-10 bg-gray-50 border-gray-200">
                          <SelectValue placeholder="Eventos/página" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Eventos por página</SelectLabel>
                            <SelectItem value="6">6 Eventos</SelectItem>
                            <SelectItem value="9">9 Eventos</SelectItem>
                            <SelectItem value="12">12 Eventos</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Go to page input */}
                    <div className="flex items-center">
                      <Input
                        type="number"
                        placeholder={`Página (1-${totalPages})`}
                        className="w-24 h-10 bg-gray-50 border-gray-200 text-center"
                        value={goToPage === undefined ? "" : goToPage}
                        onChange={(e) => {
                          const page = Number(e.target.value)
                          if (page >= 1 && page <= totalPages) {
                            setGoToPage(page)
                          } else if (e.target.value === "") {
                            setGoToPage(undefined)
                          }
                        }}
                        onBlur={() => {
                          if (goToPage !== undefined) {
                            setCurrentPage(goToPage)
                            setGoToPage(undefined)
                          }
                        }}
                      />
                    </div>

                    {/* Pagination buttons */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="bg-transparent hover:bg-gray-100 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="bg-transparent hover:bg-gray-100 transition-colors"
                      >
                        Siguiente
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">¿Quieres organizar tu propio evento?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y comparte tus eventos con miles de personas. Es fácil, rápido y completamente
            gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8"
            >
              <Link href="/register">
                <User className="mr-2 h-5 w-5" />
                Crear Cuenta Gratis
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="px-8 bg-transparent">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Ya tengo cuenta
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
