"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign, 
  Heart, 
  MessageCircle, 
  Share2, 
  Copy, 
  Download,
  Eye,
  UserPlus,
  Send,
  Loader2
} from "lucide-react"
import { TripService } from "@/lib/services/trip-service"
import { generatePDFContent, downloadPDF, copyToClipboard, createShareableUrl } from "@/lib/utils"
import { Database } from "@/lib/supabase/types"

type Trip = Database['public']['Tables']['trips']['Row']
type TripItem = Database['public']['Tables']['trip_items']['Row']

interface SharedTripViewerProps {
  shortId: string
}

export function SharedTripViewer({ shortId }: SharedTripViewerProps) {
  const [trip, setTrip] = useState<Trip | null>(null)
  const [items, setItems] = useState<TripItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("itinerary")
  const [commentEmail, setCommentEmail] = useState("")
  const [commentName, setCommentName] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [collaboratorEmail, setCollaboratorEmail] = useState("")
  const [addingCollaborator, setAddingCollaborator] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])

  useEffect(() => {
    loadTrip()
  }, [shortId])

  const loadTrip = async () => {
    try {
      setLoading(true)
      const result = await TripService.loadTripByShortId(shortId)
      
      if (result) {
        setTrip(result.trip)
        setItems(result.items)
        await loadComments(result.trip.id)
        await loadCollaborators(result.trip.id)
      } else {
        setError("Trip not found or has been removed")
      }
    } catch (error) {
      console.error("Error loading trip:", error)
      setError("Failed to load trip")
    } finally {
      setLoading(false)
    }
  }

  const loadComments = async (tripId: string) => {
    try {
      const commentsData = await TripService.getTripComments(tripId)
      setComments(commentsData)
    } catch (error) {
      console.error("Error loading comments:", error)
    }
  }

  const loadCollaborators = async (tripId: string) => {
    try {
      const collaboratorsData = await TripService.getTripCollaborators(tripId)
      setCollaborators(collaboratorsData)
    } catch (error) {
      console.error("Error loading collaborators:", error)
    }
  }

  const submitComment = async () => {
    if (!trip || !commentContent.trim() || !commentEmail.trim()) {
      alert("Please fill in all required fields")
      return
    }

    setSubmittingComment(true)
    try {
      const success = await TripService.addComment(
        trip.id,
        commentEmail,
        commentName || "Anonymous",
        commentContent
      )

      if (success) {
        setCommentContent("")
        setCommentName("")
        await loadComments(trip.id)
        alert("Comment added successfully!")
      } else {
        alert("Failed to add comment. Please try again.")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Error adding comment. Please try again.")
    } finally {
      setSubmittingComment(false)
    }
  }

  const addCollaborator = async () => {
    if (!trip || !collaboratorEmail.trim()) {
      alert("Please enter an email address")
      return
    }

    setAddingCollaborator(true)
    try {
      const success = await TripService.addCollaborator(trip.id, collaboratorEmail)
      
      if (success) {
        setCollaboratorEmail("")
        await loadCollaborators(trip.id)
        alert("Collaborator added successfully!")
      } else {
        alert("Failed to add collaborator. Please try again.")
      }
    } catch (error) {
      console.error("Error adding collaborator:", error)
      alert("Error adding collaborator. Please try again.")
    } finally {
      setAddingCollaborator(false)
    }
  }

  const likeTrip = async () => {
    if (!trip) return

    try {
      const success = await TripService.likeTrip(trip.id)
      if (success) {
        setTrip(prev => prev ? { ...prev, likes_count: (prev.likes_count || 0) + 1 } : null)
      }
    } catch (error) {
      console.error("Error liking trip:", error)
    }
  }

  const exportTrip = () => {
    if (!trip || items.length === 0) return

    const tripData = {
      name: trip.name,
      startDate: trip.start_date || "",
      endDate: trip.end_date || "",
      travelers: trip.travelers,
      budget: trip.budget || 0
    }

    const pdfContent = generatePDFContent(tripData, items)
    downloadPDF(pdfContent, `${trip.name.replace(/\s+/g, '-')}-itinerary`)
  }

  const copyShareUrl = async () => {
    if (!trip) return

    const shareUrl = createShareableUrl(trip.short_id)
    try {
      await copyToClipboard(shareUrl)
      alert("Share URL copied to clipboard!")
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      alert("Failed to copy URL. Please copy it manually.")
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "island":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100"
      case "event":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
      case "hotel":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100"
      case "activity":
        return "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  // Get the maximum day number from itinerary items
  const getMaxDayFromItinerary = () => {
    if (items.length === 0) return 1
    return Math.max(...items.map(item => item.day))
  }

  // Calculate total days considering both dates and itinerary
  const calculateTotalDays = () => {
    if (trip?.start_date && trip?.end_date) {
      const startDate = new Date(trip.start_date)
      const endDate = new Date(trip.end_date)
      
      if (startDate >= endDate) {
        return getMaxDayFromItinerary()
      }

      const timeDiff = endDate.getTime() - startDate.getTime()
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1
      return Math.max(1, daysDiff)
    }
    
    // If no dates set, start with 1 day and expand based on itinerary
    return Math.max(1, getMaxDayFromItinerary())
  }

  const getItemsForDay = (day: number) => {
    return items.filter((item) => item.day === day).sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  }

  const totalCost = items.reduce((sum, item) => sum + (item.price || 0), 0)
  const totalDays = calculateTotalDays()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-lg text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Trip Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The trip you're looking for doesn't exist or has been removed."}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-950">
      <div className="max-w-7xl mx-auto">
        {/* Trip Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">{trip.name}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            {trip.description || "An amazing island adventure shared by a fellow traveler"}
          </p>
          
          {/* Trip Stats */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {trip.views_count || 0} views
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              {trip.likes_count || 0} likes
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              {trip.comments_count || 0} comments
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button onClick={likeTrip} variant="outline" size="lg">
              <Heart className="w-4 h-4 mr-2" />
              Like Trip
            </Button>
            <Button onClick={exportTrip} size="lg" className="ocean-button">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={copyShareUrl} variant="outline" size="lg">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Trip Overview */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-serif font-bold mb-6">Trip Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950 rounded-lg">
              <Calendar className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-600">{totalDays}</div>
              <div className="text-sm text-muted-foreground">Days</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{trip.travelers}</div>
              <div className="text-sm text-muted-foreground">Travelers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">${totalCost}</div>
              <div className="text-sm text-muted-foreground">Total Cost</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <MapPin className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">{items.length}</div>
              <div className="text-sm text-muted-foreground">Activities</div>
            </div>
          </div>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="collaborate">Collaborate</TabsTrigger>
            <TabsTrigger value="info">Trip Info</TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-2xl font-serif font-bold mb-6">Daily Itinerary</h3>
              
              <Tabs defaultValue="1" className="w-full">
                <TabsList className="grid w-full grid-cols-7 mb-6">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                    <TabsTrigger key={day} value={day.toString()} className="text-sm">
                      Day {day}
                      {getItemsForDay(day).length > 0 && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {getItemsForDay(day).length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <TabsContent key={day} value={day.toString()}>
                    <div className="space-y-4">
                      {getItemsForDay(day).length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                          <h4 className="text-lg font-medium text-muted-foreground mb-2">Day {day} is free</h4>
                          <p className="text-muted-foreground">
                            No activities planned for this day.
                          </p>
                        </div>
                      ) : (
                        getItemsForDay(day).map((item) => (
                          <Card key={item.id} className="p-4 border-l-4 border-l-emerald-500">
                            <div className="flex items-start gap-4">
                              <img
                                src={item.image_url || "/placeholder.svg"}
                                alt={item.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={getTypeColor(item.type)}>{item.type}</Badge>
                                  <span className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {item.time || 'Flexible'} • {item.duration || 'Flexible'}
                                  </span>
                                  {item.rating && <span className="text-sm text-yellow-600">★ {item.rating}</span>}
                                </div>
                                <h4 className="font-medium text-lg mb-2">{item.title}</h4>
                                <p className="text-muted-foreground mb-3">{item.description}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {item.location || 'Location not specified'}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {item.price > 0 && (
                                      <span className="font-medium text-emerald-600">${item.price}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-2xl font-serif font-bold mb-6">Comments & Discussion</h3>
              
              {/* Add Comment Form */}
              <div className="mb-8 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-4">Add a Comment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="comment-email">Email *</Label>
                    <Input
                      id="comment-email"
                      type="email"
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment-name">Name (Optional)</Label>
                    <Input
                      id="comment-name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="comment-content">Comment *</Label>
                  <Textarea
                    id="comment-content"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Share your thoughts about this trip..."
                    rows={3}
                  />
                </div>
                <Button 
                  onClick={submitComment} 
                  disabled={submittingComment || !commentContent.trim() || !commentEmail.trim()}
                >
                  {submittingComment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-emerald-600">
                            {(comment.author_name || comment.author_email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">
                              {comment.author_name || comment.author_email}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="collaborate" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-2xl font-serif font-bold mb-6">Collaborate on This Trip</h3>
              
              {/* Add Collaborator */}
              <div className="mb-8 p-4 border rounded-lg bg-muted/50">
                <h4 className="font-medium mb-4">Add a Collaborator</h4>
                <div className="flex gap-2">
                  <Input
                    placeholder="collaborator@example.com"
                    value={collaboratorEmail}
                    onChange={(e) => setCollaboratorEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addCollaborator}
                    disabled={addingCollaborator || !collaboratorEmail.trim()}
                  >
                    {addingCollaborator ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Collaborators List */}
              <div>
                <h4 className="font-medium mb-4">Current Collaborators</h4>
                {collaborators.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No collaborators yet. Add someone to start planning together!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm">{collaborator.email}</span>
                          <Badge variant="secondary" className="text-xs">
                            {collaborator.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-2xl font-serif font-bold mb-6">Trip Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Trip Details</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Name:</span>
                      <p className="text-muted-foreground">{trip.name}</p>
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-muted-foreground">{trip.description || "No description provided"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Start Date:</span>
                      <p className="text-muted-foreground">
                        {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">End Date:</span>
                      <p className="text-muted-foreground">
                        {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Travelers:</span>
                      <p className="text-muted-foreground">{trip.travelers}</p>
                    </div>
                    <div>
                      <span className="font-medium">Budget:</span>
                      <p className="text-muted-foreground">
                        {trip.budget ? `$${trip.budget}` : "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Trip Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Public:</span>
                      <p className="text-muted-foreground">
                        {trip.is_public ? "Yes - Anyone can view" : "No - Private trip"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Comments:</span>
                      <p className="text-muted-foreground">
                        {trip.allow_comments ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Collaboration:</span>
                      <p className="text-muted-foreground">
                        {trip.allow_collaboration ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Created:</span>
                      <p className="text-muted-foreground">
                        {new Date(trip.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Last Updated:</span>
                      <p className="text-muted-foreground">
                        {new Date(trip.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {trip.tags && trip.tags.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-4">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {trip.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
