import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Calendar, MapPin, Clock, Bike } from "lucide-react";

export default function BookBike() {
  const locations = [
    { id: 1, name: "Marina Bay", bikes: 15 },
    { id: 2, name: "Sentosa Island", bikes: 12 },
    { id: 3, name: "East Coast Park", bikes: 20 },
    { id: 4, name: "Gardens by the Bay", bikes: 8 },
  ];

  const bikeTypes = [
    { id: 1, name: "Electric Bike", price: "$25/day", available: 45 },
    { id: 2, name: "Mountain Bike", price: "$22/day", available: 32 },
    { id: 3, name: "City Bike", price: "$18/day", available: 58 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <Badge className="mb-4 border-teal-200 bg-teal-50 text-teal-600">
            Book Your Adventure
          </Badge>
          <h1 className="mb-4 text-4xl font-bold text-slate-900 md:text-5xl">
            Reserve Your Perfect Bike
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">
            Choose your pickup location, bike type, and rental duration to start
            exploring Singapore
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="mb-6 text-2xl font-bold text-slate-900">
                  Booking Details
                </h2>

                <div className="space-y-6">
                  {/* Date Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      <Calendar className="mr-2 inline h-4 w-4" />
                      Rental Dates
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
                        placeholder="End Date"
                      />
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      <MapPin className="mr-2 inline h-4 w-4" />
                      Pickup Location
                    </label>
                    <select className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500">
                      <option value="">Select a location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name} ({location.bikes} bikes available)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      <Clock className="mr-2 inline h-4 w-4" />
                      Pickup Time
                    </label>
                    <select className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-teal-500 focus:ring-2 focus:ring-teal-500">
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>

                  <Button
                    className="w-full bg-teal-600 text-white hover:bg-teal-700"
                    size="lg"
                  >
                    Continue to Bike Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bike Types Sidebar */}
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center text-xl font-bold text-slate-900">
                  <Bike className="mr-2 h-5 w-5" />
                  Available Bikes
                </h3>
                <div className="space-y-4">
                  {bikeTypes.map((bike) => (
                    <div
                      key={bike.id}
                      className="cursor-pointer rounded-lg border border-slate-200 p-4 transition-colors hover:border-teal-300"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900">
                          {bike.name}
                        </h4>
                        <Badge variant="success">{bike.price}</Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {bike.available} available
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="mt-6 shadow-lg">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Quick Info
                </h3>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                    Free cancellation up to 24h
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                    Helmet and lock included
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-purple-500"></div>
                    24/7 roadside assistance
                  </div>
                  <div className="flex items-center">
                    <div className="mr-3 h-2 w-2 rounded-full bg-orange-500"></div>
                    GPS tracking available
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
