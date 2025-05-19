
import { cn } from "@/lib/utils";
import { StatusType } from "@/lib/types";

interface StatusBadgeProps {
  status: string;
  type: StatusType;
  className?: string;
}

const StatusBadge = ({ status, type, className }: StatusBadgeProps) => {
  const getStatusClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formattedStatus = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        getStatusClasses(),
        className
      )}
    >
      {formattedStatus}
    </span>
  );
};

export default StatusBadge;
