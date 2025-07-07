"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, MapPin, Users, DollarSign, Tag, FileText, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function CreateEventPage() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [isFeatured, setIsFeatured] = useState(false)
  const [isOnline, setIsOnline] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar el evento
    router.push("/dashboard/events")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Crear Nuevo Evento
        </h1>
        <p className="text-lg text-gray-600">Completa la información para crear tu evento</p>
      </div>

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
                    className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {/* Category and Additional Info */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="category" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Categoría
                    </Label>
                    <Select required>
                      <SelectTrigger id="category" className="h-12 border-gray-200 focus:border-indigo-500">
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia">💻 Tecnología</SelectItem>
                        <SelectItem value="artes">🎨 Artes y Cultura</SelectItem>
                        <SelectItem value="negocios">💼 Negocios y Emprendimiento</SelectItem>
                        <SelectItem value="musica">🎵 Música y Entretenimiento</SelectItem>
                        <SelectItem value="educacion">📚 Educación y Formación</SelectItem>
                        <SelectItem value="deportes">⚽ Deportes y Fitness</SelectItem>
                        <SelectItem value="salud">🏥 Salud y Bienestar</SelectItem>
                        <SelectItem value="otro">📋 Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="capacity" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Capacidad Máxima
                    </Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="100"
                      min="1"
                      className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
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
                  className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  Crear Evento
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
