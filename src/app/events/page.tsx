"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Search, MessageCircle, Heart, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface EventPost {
   id: string;
   author: {
      name: string;
      username: string;
      avatar?: string;
   };
   content: string;
   image?: string;
   // Event specific fields
   eventDate: string;
   eventTime?: string;
   eventLocation?: string;
   isOnline?: boolean;
   // Engagement
   likes: number;
   comments: number;
   shares: number;
   interested: number;
   going: number;
   // User status
   isGoing?: boolean;
   isInterested?: boolean;
   createdAt: string;
}

const EventsPage = () => {
   const [searchQuery, setSearchQuery] = useState("");

   // Dummy data - event posts
   const eventPosts: EventPost[] = [
      {
         id: "1",
         author: { name: "Tech Community ID", username: "techcommunityid" },
         content: "Join us for an exciting evening discussing the latest trends in AI and machine learning! We'll have guest speakers from top tech companies sharing their insights. Don't miss out! 🚀",
         image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
         eventDate: "Jan 25, 2026",
         eventTime: "6:00 PM - 9:00 PM",
         eventLocation: "Tech Hub Jakarta",
         likes: 124,
         comments: 28,
         shares: 15,
         interested: 45,
         going: 85,
         isGoing: true,
         createdAt: "2 days ago",
      },
      {
         id: "2",
         author: { name: "Photography Club", username: "photoclub" },
         content: "Calling all photography enthusiasts! 📸 Join our weekend workshop to learn the basics of photography from professional photographers. Bring your camera!",
         image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600",
         eventDate: "Jan 28, 2026",
         eventTime: "10:00 AM - 2:00 PM",
         eventLocation: "Creative Studio Bandung",
         likes: 89,
         comments: 12,
         shares: 8,
         interested: 32,
         going: 24,
         isInterested: true,
         createdAt: "3 days ago",
      },
      {
         id: "3",
         author: { name: "Esports Arena", username: "esportsarena" },
         content: "🎮 Virtual Gaming Tournament is here! Compete with gamers from around the world. Prize pool: $5000! Register now before slots run out.",
         image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
         eventDate: "Feb 1, 2026",
         eventTime: "8:00 PM - 11:00 PM",
         isOnline: true,
         likes: 256,
         comments: 89,
         shares: 45,
         interested: 120,
         going: 256,
         createdAt: "1 week ago",
      },
      {
         id: "4",
         author: { name: "Startup Indonesia", username: "startupindonesia" },
         content: "Networking night for entrepreneurs! 🤝 Meet fellow founders, investors, and mentors. Great opportunity to expand your network and find potential collaborators.",
         eventDate: "Feb 5, 2026",
         eventTime: "7:00 PM - 10:00 PM",
         eventLocation: "Coworking Space BSD",
         likes: 67,
         comments: 15,
         shares: 12,
         interested: 38,
         going: 45,
         createdAt: "5 days ago",
      },
   ];

   const pastEventPosts: EventPost[] = [
      {
         id: "5",
         author: { name: "Code Academy", username: "codeacademy" },
         content: "Thanks everyone who joined our Web Development Bootcamp! It was an amazing experience. See you in the next one! 💻",
         eventDate: "Jan 10, 2026",
         eventTime: "9:00 AM - 5:00 PM",
         eventLocation: "Code Academy Jakarta",
         likes: 145,
         comments: 32,
         shares: 8,
         interested: 0,
         going: 40,
         isGoing: true,
         createdAt: "2 weeks ago",
      },
   ];

   const filteredEvents = eventPosts.filter(
      (event) =>
         event.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
         event.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         event.eventLocation?.toLowerCase().includes(searchQuery.toLowerCase())
   );

   const EventPostCard = ({ event }: { event: EventPost }) => (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
         {/* Author Header */}
         <div className="p-4 pb-2">
            <div className="flex items-center gap-3">
               <Avatar>
                  <AvatarImage src={event.author.avatar} />
                  <AvatarFallback>{event.author.name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div className="flex-1">
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-gray-900 dark:text-white">{event.author.name}</span>
                     <Badge variant="secondary" className="rounded-full text-xs">Event</Badge>
                  </div>
                  <span className="text-sm text-gray-500">@{event.author.username} · {event.createdAt}</span>
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="px-4 pb-3">
            <p className="text-gray-900 dark:text-white whitespace-pre-line">{event.content}</p>
         </div>

         {/* Event Details Card */}
         <div className="mx-4 mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="space-y-2 text-sm">
               <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{event.eventDate}</span>
                  {event.eventTime && <span className="text-gray-500">· {event.eventTime}</span>}
               </div>
               {event.eventLocation && (
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                     <MapPin className="w-4 h-4 text-red-500" />
                     <span>{event.eventLocation}</span>
                  </div>
               )}
               {event.isOnline && (
                  <div className="flex items-center gap-2 text-green-600">
                     <div className="w-4 h-4 flex items-center justify-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                     </div>
                     <span>Online Event</span>
                  </div>
               )}
               <div className="flex items-center gap-2 text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{event.going} going · {event.interested} interested</span>
               </div>
            </div>
         </div>

         {/* Image */}
         {event.image && (
            <div className="px-4 pb-3">
               <img src={event.image} alt="" className="w-full rounded-xl object-cover max-h-80" />
            </div>
         )}

         {/* Action Buttons */}
         <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
               {/* Engagement Stats */}
               <div className="flex items-center gap-4 text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                     <Heart className="w-5 h-5" />
                     <span className="text-sm">{event.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                     <MessageCircle className="w-5 h-5" />
                     <span className="text-sm">{event.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors">
                     <Share2 className="w-5 h-5" />
                     <span className="text-sm">{event.shares}</span>
                  </button>
               </div>

               {/* RSVP Buttons */}
               <div className="flex gap-2">
                  {event.isGoing ? (
                     <Button size="sm" className="rounded-xl bg-green-600 hover:bg-green-700 text-white">
                        ✓ Going
                     </Button>
                  ) : event.isInterested ? (
                     <Button size="sm" variant="outline" className="rounded-xl border-blue-500 text-blue-500">
                        ★ Interested
                     </Button>
                  ) : (
                     <>
                        <Button size="sm" variant="outline" className="rounded-xl">
                           Interested
                        </Button>
                        <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                           Going
                        </Button>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );

   return (
      <div className="max-w-2xl flex-1 mx-auto px-4 py-6 pb-20 md:pb-6">
         <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events</h1>
            <p className="text-gray-500">Discover events from people you follow</p>
         </div>

         {/* Search */}
         <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
               placeholder="Search events..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-10 rounded-xl bg-gray-100 dark:bg-gray-800 border-0"
            />
         </div>

         <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-xl mb-6">
               <TabsTrigger value="upcoming" className="rounded-xl">
                  Upcoming
               </TabsTrigger>
               <TabsTrigger value="going" className="rounded-xl">
                  Your Events
               </TabsTrigger>
               <TabsTrigger value="past" className="rounded-xl">
                  Past
               </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
               {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                     <EventPostCard key={event.id} event={event} />
                  ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                     <p className="text-gray-500">No events found</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="going" className="space-y-4">
               {eventPosts.filter((e) => e.isGoing || e.isInterested).length > 0 ? (
                  eventPosts
                     .filter((e) => e.isGoing || e.isInterested)
                     .map((event) => (
                        <EventPostCard key={event.id} event={event} />
                     ))
               ) : (
                  <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                     <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                     <p className="text-gray-500">No events yet</p>
                     <p className="text-sm text-gray-400 mt-1">Mark events as "Going" or "Interested" to see them here</p>
                  </div>
               )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
               {pastEventPosts.map((event) => (
                  <EventPostCard key={event.id} event={event} />
               ))}
            </TabsContent>
         </Tabs>

         {/* Tip */}
         <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
               💡 <strong>Tip:</strong> To create an event, go to Home and click the calendar icon when creating a new post!
            </p>
         </div>
      </div>
   );
};

export default EventsPage;
