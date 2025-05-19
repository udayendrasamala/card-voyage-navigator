
import { Card } from "@/lib/types";
import { Clock, CreditCard, MapPin, Phone, User } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface CardDetailsProps {
  card: Card;
}

const CardDetails = ({ card }: CardDetailsProps) => {
  // Find the status type of the current status
  const currentStatusEvent = card.statusHistory.find(event => event.status === card.currentStatus);
  const statusType = currentStatusEvent?.statusType || "neutral";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-semibold">{card.cardType}</h2>
        <StatusBadge 
          status={card.currentStatus} 
          type={statusType}
          className="text-sm px-3 py-1.5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-medium">{card.customerName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Card Number</p>
              <p className="font-medium">{card.cardNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Mobile Number</p>
              <p className="font-medium">{card.mobileNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Expiry Date</p>
              <p className="font-medium">{card.expiryDate || "Pending"}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
              <p className="text-gray-700">
                {card.address.line1}
                {card.address.line2 && <>, {card.address.line2}</>}<br />
                {card.address.city}, {card.address.state} {card.address.postalCode}<br />
                {card.address.country}
              </p>
            </div>
          </div>
          
          {card.issueDate && (
            <div className="mt-4">
              <p className="text-sm text-gray-500">Issue Date</p>
              <p className="font-medium">{card.issueDate}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
