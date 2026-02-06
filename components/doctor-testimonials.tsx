"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface Testimonial {
  id: string
  patientName: string
  patientImage: string
  doctorName: string
  condition: string
  date: string
  rating: number
  beforeDescription: string
  afterDescription: string
  beforeImage: string
  afterImage: string
  progressPercentage: number
  testimonial: string
  region: string
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    patientName: "Abebe Tekle",
    patientImage: "/placeholder-user.jpg",
    doctorName: "Dr. Sarah Johnson",
    condition: "Diabetes Management",
    date: "2024-12-15",
    rating: 5,
    beforeDescription: "Uncontrolled blood sugar levels, fatigue, weight gain",
    afterDescription: "Normal blood sugar levels, improved energy, weight loss of 8kg",
    beforeImage: "/placeholder.jpg?query=patient-before-diabetes",
    afterImage: "/placeholder.jpg?query=patient-after-diabetes",
    progressPercentage: 85,
    testimonial:
      "Dr. Sarah's guidance has completely changed my life. My diabetes is now well-managed and I feel energized again.",
    region: "Addis Ababa",
  },
  {
    id: "2",
    patientName: "Almaz Hailu",
    patientImage: "/placeholder-user.jpg",
    doctorName: "Dr. Michael Chen",
    condition: "Hypertension Control",
    date: "2024-12-10",
    rating: 5,
    beforeDescription: "High blood pressure (160/100), headaches, anxiety",
    afterDescription: "Normal blood pressure (120/80), no headaches, reduced anxiety",
    beforeImage: "/placeholder.jpg?query=patient-before-hypertension",
    afterImage: "/placeholder.jpg?query=patient-after-hypertension",
    progressPercentage: 90,
    testimonial: "The personalized treatment plan and regular check-ins have been game-changing. I feel healthy again!",
    region: "Dire Dawa",
  },
  {
    id: "3",
    patientName: "Getnet Alemayehu",
    patientImage: "/placeholder-user.jpg",
    doctorName: "Dr. Sarah Johnson",
    condition: "Weight Loss Program",
    date: "2024-11-28",
    rating: 4,
    beforeDescription: "Obesity, low mobility, metabolic syndrome",
    afterDescription: "25kg weight loss, improved mobility, normalized metabolism",
    beforeImage: "/placeholder.jpg?query=patient-before-weight",
    afterImage: "/placeholder.jpg?query=patient-after-weight",
    progressPercentage: 75,
    testimonial:
      "Dr. Johnson's holistic approach combining diet, exercise, and monitoring made all the difference. Highly recommended!",
    region: "Awassa",
  },
  {
    id: "4",
    patientName: "Emebet Dessie",
    patientImage: "/placeholder-user.jpg",
    doctorName: "Dr. Michael Chen",
    condition: "Thyroid Disorder",
    date: "2024-11-15",
    rating: 5,
    beforeDescription: "Fatigue, weight gain, mood swings, hair loss",
    afterDescription: "Stable thyroid levels, energy restored, healthy weight, improved mood",
    beforeImage: "/placeholder.jpg?query=patient-before-thyroid",
    afterImage: "/placeholder.jpg?query=patient-after-thyroid",
    progressPercentage: 88,
    testimonial:
      "After months of struggling, Dr. Chen finally diagnosed my thyroid issue correctly. Life has improved dramatically!",
    region: "Harar",
  },
]

export default function DoctorTestimonials() {
  const { t } = useLanguage()

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Patient Success Stories</h2>
        <p className="text-slate-400">Real patient journeys and their remarkable health transformations</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {mockTestimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    {testimonial.patientName}
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.region}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm">{testimonial.condition}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Before & After Images */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-semibold">BEFORE</p>
                  <img
                    src={testimonial.beforeImage || "/placeholder.svg"}
                    alt={`${testimonial.patientName} before treatment`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <p className="text-xs text-slate-400">{testimonial.beforeDescription}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-slate-400 font-semibold">AFTER</p>
                  <img
                    src={testimonial.afterImage || "/placeholder.svg"}
                    alt={`${testimonial.patientName} after treatment`}
                    className="w-full h-32 object-cover rounded-lg border border-border"
                  />
                  <p className="text-xs text-slate-400">{testimonial.afterDescription}</p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Progress
                  </span>
                  <span className="text-emerald-400 font-semibold">{testimonial.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all"
                    style={{ width: `${testimonial.progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Testimonial Quote */}
              <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                <p className="text-sm text-slate-300 italic">"{testimonial.testimonial}"</p>
              </div>

              {/* Doctor & Date Info */}
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700">
                <span>Dr. {testimonial.doctorName}</span>
                <span>{new Date(testimonial.date).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
