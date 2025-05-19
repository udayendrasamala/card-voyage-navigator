
import { Card } from "@/lib/types";
import { useState } from "react";
import StatusBadge from "./StatusBadge";

interface CardJourneyProps {
  card: Card;
}

const CardJourney = ({ card }: CardJourneyProps) => {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  const toggleEventDetails = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  // Sort events chronologically
  const sortedEvents = [...card.statusHistory].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Card Journey Timeline</h2>
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline Events */}
        <div className="space-y-6">
          {sortedEvents.map((event, index) => (
            <div key={event.id} className="relative pl-14">
              {/* Timeline Dot */}
              <div className={`absolute left-[18px] w-3 h-3 rounded-full top-2 border-2 border-white
                ${event.statusType === "success" ? "bg-green-500" : 
                  event.statusType === "warning" ? "bg-yellow-500" : 
                  event.statusType === "error" ? "bg-red-500" : 
                  event.statusType === "info" ? "bg-blue-500" : 
                  "bg-gray-500"}`}
              />

              {/* Event Content */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={event.status} type={event.statusType} />
                      <span className="text-sm text-gray-500">{formatDate(event.timestamp)}</span>
                    </div>
                    <div className="mt-1 text-gray-700">
                      {event.location && <span className="text-sm">Location: {event.location}</span>}
                    </div>
                  </div>
                  <button 
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => toggleEventDetails(event.id)}
                  >
                    {expandedEventId === event.id ? "Less details" : "More details"}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedEventId === event.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {event.notes && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Notes:</span>
                        <p className="text-sm text-gray-600">{event.notes}</p>
                      </div>
                    )}
                    
                    {event.failureReason && (
                      <div className="mb-2">
                        <span className="text-sm font-medium text-red-600">Failure Reason:</span>
                        <p className="text-sm text-red-600">{event.failureReason}</p>
                      </div>
                    )}
                    
                    {event.agentId && (
                      <div>
                        <span className="text-sm font-medium">Agent ID:</span>
                        <p className="text-sm text-gray-600">{event.agentId}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardJourney;
