"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCategories } from "@/hooks/useCategories"
import { CalendarIcon, MapPin, Users, DollarSign, Tag, FileText, Clock, Loader2, AlertCircle } from "lucide-react"
import { AuthService } from "@/services/auth"
import { useAuth } from "@/context/AuthContext"
import { BACKEND_URL } from "@/config/env"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format, parse } from "date-fns"
import { es } from "date-fns/locale"

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  // Estados del formulario
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  
  // Obtener categorías desde la API
  const { categories, loading: loadingCategories, error: categoriesError } = useCategories()
  const [isOnline, setIsOnline] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  // Estados para UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!date) {
      setError('Por favor selecciona una fecha para el evento');
      setLoading(false);
      return;
    }
    
    try {
      // Preparar los datos según el formato de la API
      const eventDate = new Date(date);
      let startTime = new Date(eventDate);
      
      if (time) {
        const [hours, minutes] = time.split(':').map(Number);
        startTime.setHours(hours, minutes);
      }
      
      const endDate = new Date(startTime);
      endDate.setHours(endDate.getHours() + 2); // Por defecto 2 horas después
      
      const categoryId = category ? parseInt(category) : 1; // Valor por defecto
      const userId = user?.id || 0;
      
      // Formato exacto esperado por la API
      const eventData = {
        name: name,
        description: description,
        start_date: startTime.toISOString(),
        end_date: endDate.toISOString(),
        location: location,
        category_id: categoryId,
        user_id: userId,
        start_time: startTime.toISOString(),
        prize: price ? String(price) : '0'
      };
      
      // Obtener el token y enviarlo en la cabecera de autorización
      const token = AuthService.getToken();
      
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }
      
      // Usar la variable de entorno para la URL del backend
      console.log('Enviando evento:', eventData);
      
      const response = await fetch(`${BACKEND_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error al crear el evento: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Evento creado exitosamente:', responseData);
      
      setSuccess(true);
      // Redireccionar después de un tiempo breve
      setTimeout(() => {
        router.push('/dashboard/events');
      }, 1500);
      
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear el evento');
      console.error('Error al crear evento:', err);
      
      if (err.message.includes('fetch')) {
        setError('Error de conexión. Por favor verifica la URL de la API y tu conexión a internet.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Crear Nuevo Evento
        </h1>
        <p className="text-lg text-gray-600">Completa la información para crear tu evento</p>
      </div>

      {/* Mensajes de error o éxito */}
      {error && (
        <Alert variant="destructive" className="border-red-600">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-600 text-green-800">
          <AlertDescription>
            ¡Evento creado correctamente! Redireccionando...
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-white">
            <form onSubmit={handleSubmit}>
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Información del Evento</CardTitle>
                <CardDescription className="text-gray-600">
                  Proporciona los detalles principales de tu evento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Event Name */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Nombre del Evento
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Conferencia de Tecnología 2025"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 text-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      Fecha del Evento
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-12 justify-start text-left font-normal bg-white border-gray-200 hover:bg-gray-50"
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 text-gray-400" />
                          {date ? (
                            format(date, "PPP", { locale: es })
                          ) : (
                            <span className="text-gray-500">Selecciona una fecha</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="time" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Hora de Inicio
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                    Descripción Detallada
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe tu evento: objetivos, agenda, público objetivo, beneficios para los asistentes..."
                    className="min-h-[140px] border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="location" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="online-mode" checked={isOnline} onCheckedChange={setIsOnline} />
                      <Label htmlFor="online-mode" className="text-sm text-gray-600">
                        Evento virtual
                      </Label>
                    </div>
                  </div>
                  <Input
                    id="location"
                    placeholder={isOnline ? "Enlace de la reunión virtual" : "Dirección del lugar o nombre del venue"}
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categoría
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category" className="h-12 border-gray-200 focus:border-indigo-500">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingCategories ? (
                        <SelectItem value="loading" disabled>
                          Cargando categorías...
                        </SelectItem>
                      ) : categoriesError ? (
                        <SelectItem value="error" disabled>
                          Error al cargar categorías
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Precio de Entrada
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Deja en 0 si el evento es gratuito</p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between p-8 bg-gray-50 rounded-b-lg">
                <Button variant="outline" type="button" onClick={() => router.back()} className="px-8">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    "Crear Evento"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
              <CardTitle className="text-lg text-gray-900">Vista Previa</CardTitle>
              <CardDescription className="text-gray-600">Así se verá tu evento</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="aspect-video bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <CalendarIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Imagen del evento</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Nombre del Evento</h3>
                  <p className="text-sm text-gray-600 mt-1">Fecha y ubicación aparecerán aquí</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
              <CardTitle className="text-lg text-gray-900">💡 Consejos</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Usa un título descriptivo y atractivo para tu evento</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Incluye todos los detalles importantes en la descripción</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Selecciona la categoría más apropiada para mejor visibilidad</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Especifica claramente la ubicación o enlace virtual</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
