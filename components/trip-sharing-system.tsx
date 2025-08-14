"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Share2,
  Download,
  Link,
  Users,
  Calendar,
  MapPin,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  MessageCircle,
  Eye,
  Lock,
  Globe,
  FileText,
  ImageIcon,
  Send,
  UserPlus,
  Heart,
} from "lucide-react"

interface TripData {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  destinations: string[]
  activities: number
  totalCost: number
  travelers: number
  coverImage: string
  isPublic: boolean
  collaborators: string[]
  tags: string[]
}

interface SharedTrip {
  id: string
  tripData: TripData
  sharedBy: string
  sharedDate: string
  views: number
  likes: number
  comments: number
}

const sampleTrip: TripData = {
  id: "trip-1",
  name: "Mediterranean Island Hopping",
  description:
    "A 10-day adventure across the most beautiful Greek islands, featuring ancient history, stunning beaches, and unforgettable sunsets.",
  startDate: "2024-06-15",
  endDate: "2024-06-25",
  destinations: ["Santorini", "Mykonos", "Crete"],
  activities: 12,
  totalCost: 3500,
  travelers: 2,
  coverImage: "/santorini-peak-ocean.png",
  isPublic: false,
  collaborators: [],
  tags: ["Adventure", "Culture", "Romance", "Beach"],
}

const sampleSharedTrips: SharedTrip[] = [
  {
    id: "shared-1",
    tripData: {
      id: "trip-2",
      name: "Tropical Paradise Adventure",
      description: "7 days in Bali exploring temples, beaches, and local culture",
      startDate: "2024-07-01",
      endDate: "2024-07-08",
      destinations: ["Bali", "Lombok"],
      activities: 8,
      totalCost: 2200,
      travelers: 4,
      coverImage: "/bora-bora-lagoon-aerial.png",
      isPublic: true,
      collaborators: ["john@example.com", "sarah@example.com"],
      tags: ["Family", "Culture", "Adventure"],
    },
    sharedBy: "Alex Johnson",
    sharedDate: "2024-01-15",
    views: 234,
    likes: 18,
    comments: 5,
  },
  {
    id: "shared-2",
    tripData: {
      id: "trip-3",
      name: "Caribbean Island Escape",
      description: "Luxury resort hopping across the Caribbean islands",
      startDate: "2024-08-10",
      endDate: "2024-08-17",
      destinations: ["Barbados", "St. Lucia", "Martinique"],
      activities: 6,
      totalCost: 5800,
      travelers: 2,
      coverImage: "/maldives-sunset-beach-aerial.png",
      isPublic: true,
      collaborators: [],
      tags: ["Luxury", "Romance", "Beach"],
    },
    sharedBy: "Maria Rodriguez",
    sharedDate: "2024-01-10",
    views: 156,
    likes: 12,
    comments: 3,
  },
]

export function TripSharingSystem() {
  const [currentTrip, setCurrentTrip] = useState<TripData>(sampleTrip)
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowComments: true,
    allowCollaboration: false,
    shareWithEmail: "",
    shareMessage: "",
  })
  const [sharedLink, setSharedLink] = useState("")
  const [activeTab, setActiveTab] = useState("share")
  const [collaboratorEmail, setCollaboratorEmail] = useState("")

  const generateShareLink = () => {
    const link = `https://island-paradise.com/shared-trip/${currentTrip.id}`
    setSharedLink(link)
    return link
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You would show a toast notification here
  }

  const shareToSocialMedia = (platform: string) => {
    const link = generateShareLink()
    const text = `Check out my amazing ${currentTrip.name} trip plan!`

    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      instagram: link, // Instagram doesn't support direct sharing, so we just copy the link
    }

    if (platform === "instagram") {
      copyToClipboard(link)
    } else {
      window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400")
    }
  }

  const exportTrip = (format: string) => {
    // This would generate and download the trip in the specified format
    console.log(`Exporting trip in ${format} format`)
  }

  const sendTripInvitation = () => {
    // This would send an email invitation
    console.log(`Sending invitation to ${shareSettings.shareWithEmail}`)
  }

  const addCollaborator = () => {
    if (collaboratorEmail && !currentTrip.collaborators.includes(collaboratorEmail)) {
      setCurrentTrip({
        ...currentTrip,
        collaborators: [...currentTrip.collaborators, collaboratorEmail],
      })
      setCollaboratorEmail("")
    }
  }

  const removeCollaborator = (email: string) => {
    setCurrentTrip({
      ...currentTrip,
      collaborators: currentTrip.collaborators.filter((c) => c !== email),
    })
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-foreground mb-6">Share Your Adventure</h2>
          <p className="text-xl text-muted-foreground">
            Share your trip plans with friends, collaborate on planning, or inspire others with your island adventures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Trip Preview</h3>
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={currentTrip.coverImage || "/placeholder.svg"}
                    alt={currentTrip.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={currentTrip.isPublic ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                    >
                      {currentTrip.isPublic ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {currentTrip.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">{currentTrip.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{currentTrip.description}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>
                      {currentTrip.startDate} - {currentTrip.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>{currentTrip.destinations.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>{currentTrip.travelers} travelers</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {currentTrip.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Sharing Options */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="share">Share Trip</TabsTrigger>
                <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
                <TabsTrigger value="export">Export</TabsTrigger>
                <TabsTrigger value="gallery">Trip Gallery</TabsTrigger>
              </TabsList>

              <TabsContent value="share" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Share Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Make trip public</Label>
                        <p className="text-xs text-muted-foreground">Allow anyone to view your trip</p>
                      </div>
                      <Switch
                        checked={shareSettings.isPublic}
                        onCheckedChange={(checked) => {
                          setShareSettings({ ...shareSettings, isPublic: checked })
                          setCurrentTrip({ ...currentTrip, isPublic: checked })
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Allow comments</Label>
                        <p className="text-xs text-muted-foreground">Let others comment on your trip</p>
                      </div>
                      <Switch
                        checked={shareSettings.allowComments}
                        onCheckedChange={(checked) => setShareSettings({ ...shareSettings, allowComments: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Allow collaboration</Label>
                        <p className="text-xs text-muted-foreground">Let others edit your trip</p>
                      </div>
                      <Switch
                        checked={shareSettings.allowCollaboration}
                        onCheckedChange={(checked) =>
                          setShareSettings({ ...shareSettings, allowCollaboration: checked })
                        }
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Share Link</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={sharedLink || "Click 'Generate Link' to create a shareable link"}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={generateShareLink} variant="outline">
                        <Link className="w-4 h-4 mr-2" />
                        Generate Link
                      </Button>
                      {sharedLink && (
                        <Button onClick={() => copyToClipboard(sharedLink)} variant="outline">
                          <Copy className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => shareToSocialMedia("facebook")} className="flex-1" variant="outline">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </Button>
                      <Button onClick={() => shareToSocialMedia("twitter")} className="flex-1" variant="outline">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                      <Button onClick={() => shareToSocialMedia("instagram")} className="flex-1" variant="outline">
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Send Invitation</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="friend@example.com"
                        value={shareSettings.shareWithEmail}
                        onChange={(e) => setShareSettings({ ...shareSettings, shareWithEmail: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Hey! Check out this amazing trip I'm planning..."
                        value={shareSettings.shareMessage}
                        onChange={(e) => setShareSettings({ ...shareSettings, shareMessage: e.target.value })}
                      />
                    </div>
                    <Button onClick={sendTripInvitation} className="w-full ocean-button">
                      <Send className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="collaborate" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Trip Collaborators</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="collaborator@example.com"
                        value={collaboratorEmail}
                        onChange={(e) => setCollaboratorEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={addCollaborator}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>

                    {currentTrip.collaborators.length > 0 ? (
                      <div className="space-y-2">
                        {currentTrip.collaborators.map((email) => (
                          <div key={email} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-indigo-600" />
                              </div>
                              <span className="text-sm">{email}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCollaborator(email)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No collaborators yet. Add someone to start planning together!</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Collaboration Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <MessageCircle className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-medium mb-1">Real-time Chat</h4>
                      <p className="text-sm text-muted-foreground">Discuss plans with your travel companions</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Calendar className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-medium mb-1">Shared Calendar</h4>
                      <p className="text-sm text-muted-foreground">Coordinate schedules and availability</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Share2 className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-medium mb-1">Voting System</h4>
                      <p className="text-sm text-muted-foreground">Vote on activities and destinations</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <FileText className="w-8 h-8 text-indigo-600 mb-2" />
                      <h4 className="font-medium mb-1">Shared Documents</h4>
                      <p className="text-sm text-muted-foreground">Keep all trip documents in one place</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Your Trip</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button onClick={() => exportTrip("pdf")} variant="outline" className="h-20 flex-col">
                      <FileText className="w-8 h-8 mb-2" />
                      <span>PDF Itinerary</span>
                    </Button>
                    <Button onClick={() => exportTrip("calendar")} variant="outline" className="h-20 flex-col">
                      <Calendar className="w-8 h-8 mb-2" />
                      <span>Calendar Events</span>
                    </Button>
                    <Button onClick={() => exportTrip("image")} variant="outline" className="h-20 flex-col">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span>Trip Poster</span>
                    </Button>
                    <Button onClick={() => exportTrip("json")} variant="outline" className="h-20 flex-col">
                      <Download className="w-8 h-8 mb-2" />
                      <span>Trip Data</span>
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Include in Export</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Itinerary details</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Booking confirmations</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Maps and directions</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Emergency contacts</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Discover Shared Trips</h3>
                  <p className="text-muted-foreground mb-6">Get inspired by amazing trips shared by other travelers</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sampleSharedTrips.map((sharedTrip) => (
                      <Card key={sharedTrip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={sharedTrip.tripData.coverImage || "/placeholder.svg"}
                            alt={sharedTrip.tripData.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-white/90 text-gray-800">
                              {sharedTrip.tripData.destinations.length} islands
                            </Badge>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="font-semibold mb-2">{sharedTrip.tripData.name}</h4>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {sharedTrip.tripData.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                            <span>by {sharedTrip.sharedBy}</span>
                            <span>{sharedTrip.sharedDate}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {sharedTrip.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {sharedTrip.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {sharedTrip.comments}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Trip
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}
