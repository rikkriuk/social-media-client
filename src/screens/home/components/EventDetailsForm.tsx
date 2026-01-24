import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EventDetailsFormProps } from "@/types/home";

export const EventDetailsForm = ({
   eventDate,
   onEventDateChange,
   eventTime,
   onEventTimeChange,
   eventLocation,
   onEventLocationChange,
   isOnlineEvent,
   onToggleOnlineEvent,
   tFunc,
}: EventDetailsFormProps) => {
   return (
      <div className="space-y-3">
         <div className="grid grid-cols-2 gap-3">
            <div>
               <label className="text-xs text-gray-500 mb-1 block">{tFunc("date")}</label>
               <Input
                  type="date"
                  value={eventDate}
                  onChange={(e) => onEventDateChange(e.target.value)}
                  className="rounded-lg text-sm"
               />
            </div>
            <div>
               <label className="text-xs text-gray-500 mb-1 block">{tFunc("time")}</label>
               <Input
                  type="time"
                  value={eventTime}
                  onChange={(e) => onEventTimeChange(e.target.value)}
                  className="rounded-lg text-sm"
               />
            </div>
         </div>
         <div>
            <label className="text-xs text-gray-500 mb-1 block">{tFunc("location")}</label>
            <div className="flex gap-2">
               <Input
                  placeholder={tFunc("enterLocation")}
                  value={eventLocation}
                  onChange={(e) => onEventLocationChange(e.target.value)}
                  disabled={isOnlineEvent}
                  className="rounded-lg text-sm flex-1"
               />
               <Button
                  type="button"
                  variant={isOnlineEvent ? "default" : "outline"}
                  size="sm"
                  onClick={onToggleOnlineEvent}
                  className="rounded-lg whitespace-nowrap"
               >
                  {tFunc("online")}
               </Button>
            </div>
         </div>
      </div>
   );
};
