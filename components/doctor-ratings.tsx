"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, User, ThumbsUp, Heart, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DoctorRating {
  id: string;
  doctorName: string;
  patientName: string;
  rating: number;
  date: string;
  title: string;
  review: string;
  aspects: {
    professionalism: number;
    communication: number;
    punctuality: number;
    cleanliness: number;
  };
  verified: boolean;
  helpful: number;
}

const mockRatings: DoctorRating[] = [
  {
    id: "1",
    doctorName: "Dr. Sarah Johnson",
    patientName: "Abebe T.",
    rating: 5,
    date: "2024-12-10",
    title: "Excellent care and attention",
    review:
      "Dr. Johnson provided exceptional care during my consultation. Very professional, attentive to my concerns, and provided clear explanations about my condition.",
    aspects: {
      professionalism: 5,
      communication: 5,
      punctuality: 5,
      cleanliness: 5,
    },
    verified: true,
    helpful: 12,
  },
  {
    id: "2",
    doctorName: "Dr. Sarah Johnson",
    patientName: "Almaz H.",
    rating: 4,
    date: "2024-12-05",
    title: "Very good doctor, highly recommended",
    review:
      "Dr. Johnson is knowledgeable and caring. She listens carefully and provided helpful recommendations for my health.",
    aspects: {
      professionalism: 5,
      communication: 4,
      punctuality: 4,
      cleanliness: 5,
    },
    verified: true,
    helpful: 8,
  },
  {
    id: "3",
    doctorName: "Dr. Michael Chen",
    patientName: "Getnet A.",
    rating: 5,
    date: "2024-12-08",
    title: "Outstanding cardiology expertise",
    review:
      "Dr. Chen demonstrated deep expertise in cardiology. The consultation was thorough, and he explained my condition in detail. Definitely worth recommending.",
    aspects: {
      professionalism: 5,
      communication: 5,
      punctuality: 5,
      cleanliness: 5,
    },
    verified: true,
    helpful: 15,
  },
  {
    id: "4",
    doctorName: "Dr. Michael Chen",
    patientName: "Emebet D.",
    rating: 4,
    date: "2024-12-01",
    title: "Good follow-up consultation",
    review:
      "Doctor Chen was thorough and took time to answer all my questions. Slight wait time, but overall very satisfied with the consultation.",
    aspects: {
      professionalism: 4,
      communication: 4,
      punctuality: 3,
      cleanliness: 4,
    },
    verified: true,
    helpful: 6,
  },
];

export default function DoctorRatings() {
  const { t } = useLanguage();
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    review: "",
    professionalism: 5,
    communication: 5,
    punctuality: 5,
    cleanliness: 5,
  });

  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "General Medicine",
      avgRating: 4.5,
      totalReviews: 234,
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Cardiology",
      avgRating: 4.8,
      totalReviews: 189,
    },
    {
      name: "Dr. Emily Watson",
      specialty: "Dermatology",
      avgRating: 4.7,
      totalReviews: 156,
    },
  ];

  const doctorRatings = selectedDoctor
    ? mockRatings.filter((r) => r.doctorName === selectedDoctor)
    : [];

  const handleSubmitRating = () => {
    console.log("Submitting rating:", formData);
    setFormData({
      rating: 5,
      title: "",
      review: "",
      professionalism: 5,
      communication: 5,
      punctuality: 5,
      cleanliness: 5,
    });
    setShowRatingForm(false);
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onChange?: (val: number) => void,
  ) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onChange && onChange(star)}
            disabled={!interactive}
            className={`transition-colors ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-500"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <Star className="w-6 h-6 text-primary" />
          Rate Your Doctors
        </h2>
        <p className="text-slate-400">
          Share your experience and help other patients find the best doctors
        </p>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <Card
            key={doctor.name}
            className={`border cursor-pointer transition-all ${
              selectedDoctor === doctor.name
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/50"
            }`}
            onClick={() => setSelectedDoctor(doctor.name)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{doctor.name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {doctor.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {renderStars(Math.round(doctor.avgRating))}
                <span className="text-lg font-bold text-yellow-400">
                  {doctor.avgRating}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {doctor.totalReviews} patient reviews
              </p>
              <Button
                variant="outline"
                className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
              >
                {selectedDoctor === doctor.name ? "Selected" : "Select"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedDoctor && (
        <div className="space-y-6">
          {/* Rating Stats */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Rating Breakdown - {selectedDoctor}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "professionalism",
                "communication",
                "punctuality",
                "cleanliness",
              ].map((aspect) => {
                const ratings = doctorRatings.map(
                  (r) => r.aspects[aspect as keyof typeof r.aspects],
                );
                const avgAspect =
                  ratings.length > 0
                    ? (
                        ratings.reduce((a, b) => a + b) / ratings.length
                      ).toFixed(1)
                    : 0;

                return (
                  <div key={aspect} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium capitalize">
                        {aspect}
                      </label>
                      <span className="text-sm font-semibold text-yellow-400">
                        {avgAspect} / 5
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full"
                        style={{ width: `${(Number(avgAspect) / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Add Rating Button */}
          <Button
            onClick={() => setShowRatingForm(!showRatingForm)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Heart className="w-4 h-4 mr-2" />
            {showRatingForm ? "Cancel" : "Share Your Experience"}
          </Button>

          {/* Rating Form */}
          {showRatingForm && (
            <Card className="border-primary bg-primary/5 border-2">
              <CardHeader>
                <CardTitle>Rate {selectedDoctor}</CardTitle>
                <CardDescription>
                  Help other patients by sharing your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Overall Rating
                  </Label>
                  {renderStars(formData.rating, true, (val) =>
                    setFormData({ ...formData, rating: val }),
                  )}
                </div>

                {/* Aspect Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "professionalism",
                    "communication",
                    "punctuality",
                    "cleanliness",
                  ].map((aspect) => (
                    <div key={aspect} className="space-y-2">
                      <Label className="text-sm capitalize">{aspect}</Label>
                      <RadioGroup
                        value={String(
                          formData[aspect as keyof typeof formData],
                        )}
                        onValueChange={(val) =>
                          setFormData({
                            ...formData,
                            [aspect]: Number.parseInt(val),
                          })
                        }
                      >
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <div
                              key={rating}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={String(rating)}
                                id={`${aspect}-${rating}`}
                              />
                              <Label
                                htmlFor={`${aspect}-${rating}`}
                                className="cursor-pointer"
                              >
                                {rating}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  ))}
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label>Title (what would you call your experience?)</Label>
                  <input
                    type="text"
                    placeholder="e.g., Excellent care and attention"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Review */}
                <div className="space-y-2">
                  <Label>Your Review</Label>
                  <Textarea
                    placeholder="Share details about your experience with this doctor..."
                    value={formData.review}
                    onChange={(e) =>
                      setFormData({ ...formData, review: e.target.value })
                    }
                    className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    rows={4}
                  />
                </div>

                <Button
                  onClick={handleSubmitRating}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Submit Rating
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Recent Reviews ({doctorRatings.length})
            </h3>
            {doctorRatings.length > 0 ? (
              doctorRatings.map((rating) => (
                <Card key={rating.id} className="border-border bg-card">
                  <CardHeader>
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-300">
                              {rating.patientName}
                            </span>
                          </div>
                          {rating.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">
                          {rating.title}
                        </CardTitle>
                      </div>
                      <div className="text-right">
                        {renderStars(rating.rating)}
                        <p className="text-xs text-slate-400 mt-1">
                          {rating.date}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-300">{rating.review}</p>

                    {/* Aspect Ratings */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-800/50 rounded-lg p-3">
                      {Object.entries(rating.aspects).map(([aspect, score]) => (
                        <div key={aspect} className="text-center">
                          <p className="text-xs text-slate-400 capitalize mb-1">
                            {aspect}
                          </p>
                          <div className="flex justify-center">
                            {renderStars(score)}
                          </div>
                          <p className="text-xs font-semibold text-yellow-400 mt-1">
                            {score}/5
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Helpful Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-foreground hover:bg-secondary bg-transparent text-xs"
                      >
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful ({rating.helpful})
                      </Button>
                      <span className="text-xs text-slate-500">
                        All verified patients
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-8 text-center">
                  <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400">
                    No reviews yet for this doctor
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
