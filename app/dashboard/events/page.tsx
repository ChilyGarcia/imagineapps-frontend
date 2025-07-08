"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar,
  Users,
  MapPin,
  Search,
  Plus,
  Filter,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Briefcase,
  Laptop,
  Music,
  Palette,
  Tag,
  Landmark,
  X,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useEvents } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";

// Category mapping from IDs to names
const categoryMap: Record<number, string> = {
  1: "Tecnología",
  2: "Artes",
  3: "Negocios",
  4: "Música",
  5: "Otros",
};

const EVENTS_PER_PAGE = 6;

// Interfaz para tipificar los eventos
interface EventUI {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  category: string;
  attendees: number;
  price: string;
  ownerId: string;
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [dateFilter, setDateFilter] = useState("Todos");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);

  // Use our custom hooks to fetch data
  const { events: apiEvents, loading: loadingEvents, error: eventError, updateFilters } = useEvents();
  const { categories, loading: loadingCategories, error: categoryError } = useCategories();

  // Combined loading & error states
  const loading = loadingEvents || loadingCategories;
  const error = eventError || categoryError;

  // Map API events to UI format
  const [events, setEvents] = useState<EventUI[]>([]);

  useEffect(() => {
    if (apiEvents) {
      const mappedEvents = apiEvents.map((event) => ({
        id: String(event.id),
        name: event.name,
        date: event.start_date.split("T")[0], // Extract date part
        description: event.description,
        location: event.location,
        category: event.category.name || "Otros",
        // Usar valores predeterminados para propiedades que podrían no existir
        attendees: 0, // Valor predeterminado
        price: event.prize || "Gratuito",
        ownerId: String(event.id), // Usamos el ID del evento como ID del propietario
      }));
      setEvents(mappedEvents);
    }
  }, [apiEvents]);

  // Update API filters when category or date filter changes
  useEffect(() => {
    const apiFilters: any = {};

    // Map category filter to category_id
    if (categoryFilter !== "Todos") {
      const selectedCategory = categories.find(
        (category) => category.name === categoryFilter
      );

      if (selectedCategory) {
        apiFilters.category_id = selectedCategory.id;
      }
    }

    if (selectedDate && dateFilter === "Día específico") {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      apiFilters.date = formattedDate;
    } else if (dateFilter !== "Todos" && dateFilter !== "Día específico") {
      switch (dateFilter) {
        case "Esta semana":
          apiFilters.time_filter = "week";
          break;
        case "Este mes":
          apiFilters.time_filter = "month";
          break;
        case "Pasados":
          // For past events, we don't have a direct API filter
          break;
      }
    }

    // Filtro adicional para mostrar solo los eventos del usuario actual
    apiFilters.user_events = true;

    // Update filters in the hook
    updateFilters(apiFilters);
  }, [categoryFilter, dateFilter, selectedDate, updateFilters, categories]);

  const currentUserId = "current-user"; // En producción, esto vendría del contexto de autenticación

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    // Ajustar página si es necesario
    const newTotalEvents = events.length - 1;
    const maxPage = Math.ceil(newTotalEvents / EVENTS_PER_PAGE);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  };

  // Client-side filtering for search term and specific date filtering
  const filteredEvents = events.filter((event) => {
    // Filter by search term
    const matchesSearch = event.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Client-side date filtering for the specific date option
    let matchesDate = true;

    if (dateFilter === "Día específico" && selectedDate) {
      // Extraer solo la parte de la fecha (YYYY-MM-DD) del evento
      const eventDate = event.date.split("T")[0];
      const selectedDateFormatted = format(selectedDate, "yyyy-MM-dd");

      // Comparar los strings de fecha formateados
      matchesDate = eventDate === selectedDateFormatted;
    }

    return matchesSearch && matchesDate;
  });

  // Paginación
  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = filteredEvents.slice(
    startIndex,
    startIndex + EVENTS_PER_PAGE
  );

  // Mapeo para colores de categorías (se puede expandir con más categorías según sea necesario)  
  const categoryColors: Record<string, string> = {
    "Tecnología": "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    "Artes": "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    "Política": "bg-gradient-to-r from-red-500 to-orange-500 text-white",
    "Música": "bg-gradient-to-r from-orange-500 to-red-500 text-white",
    "Negocios": "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
  };
  
  // Mapeo para iconos de categorías (se puede expandir con más categorías según sea necesario)
  const categoryIcons: Record<string, string> = {
    "Tecnología": "💻",
    "Artes": "🎨",
    "Política": "🏛️",
    "Música": "🎵",
    "Negocios": "💼"
  };
  
  // Función para obtener el color de la categoría
  const getCategoryColor = (category: string) => {
    return categoryColors[category] || "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
  };

  // Función para obtener el icono de la categoría
  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || "📅";
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Mis Eventos
            </h1>
            <p className="text-lg text-gray-600">
              Gestiona y organiza todos tus eventos desde aquí
            </p>
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
                  <p className="text-sm font-medium text-blue-600">
                    Total Eventos
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {events.length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Total Asistentes
                  </p>
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
                  <p className="text-sm font-medium text-green-600">
                    Eventos Activos
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {
                      events.filter(
                        (event) => new Date(event.date) >= new Date()
                      ).length
                    }
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
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="flex space-x-2 w-full md:w-auto">
              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value);
                  if (value !== "Día específico") {
                    setSelectedDate(undefined);
                  }
                }}
              >
                <SelectTrigger className="w-full md:w-[200px] h-11 bg-gray-50 border-gray-200">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Fecha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Filtrar por fecha</SelectLabel>
                    <SelectItem value="Todos">Todas las fechas</SelectItem>
                    <SelectItem value="Día específico">
                      Día específico
                    </SelectItem>
                    <SelectItem value="Esta semana">Esta semana</SelectItem>
                    <SelectItem value="Este mes">Este mes</SelectItem>
                    <SelectItem value="Pasados">Eventos pasados</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              {dateFilter === "Día específico" && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full md:w-[200px] h-11 justify-start text-left font-normal bg-gray-50 border-gray-200 ${
                        !selectedDate && "text-muted-foreground"
                      }`}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar día</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              )}

              {selectedDate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 bg-gray-50 border border-gray-200"
                  onClick={() => setSelectedDate(undefined)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Mostrar skeletons durante la carga
          [...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="group bg-white border-0 shadow-md overflow-hidden animate-pulse"
            >
              <CardHeader className="pb-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="h-4 bg-gray-100 rounded"></div>
                <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded"></div>
                  <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 bg-gray-50">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))
        ) : error ? (
          // Mostrar mensaje de error
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-red-200 p-12 text-center bg-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <Calendar className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Error al cargar eventos
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              Ha ocurrido un error al intentar obtener tus eventos. Por favor,
              inténtalo de nuevo más tarde.
            </p>
          </div>
        ) : paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
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
                  <Badge
                    className={`${getCategoryColor(
                      event.category
                    )} text-xs font-medium px-2 py-1 shadow-sm`}
                  >
                    {getCategoryIcon(event.category)} {event.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm text-gray-600 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-2 h-3 w-3 text-gray-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-green-600">
                      {event.price}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 mr-2 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors bg-transparent"
                >
                  <Link href={`/dashboard/events/${event.id}`}>
                    Ver Detalles
                  </Link>
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
                        Esta acción no se puede deshacer. Se eliminará
                        permanentemente "{event.name}" y todos sus datos
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
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center bg-white">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100">
              <Calendar className="h-10 w-10 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              No se encontraron eventos
            </h2>
            <p className="mt-2 text-sm text-gray-600 max-w-sm">
              No hay eventos que coincidan con tus filtros. Intenta ajustar los
              criterios de búsqueda o crea un nuevo evento.
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
                Mostrando {startIndex + 1} a{" "}
                {Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)}{" "}
                de {filteredEvents.length} eventos
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
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
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
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
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
  );
}
