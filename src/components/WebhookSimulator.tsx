
import { useState } from "react";
import { CardStatus, StatusType, WebhookPayload } from "@/lib/types";
import { simulateWebhook } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface WebhookSimulatorProps {
  onUpdate?: () => void;
}

const WebhookSimulator = ({ onUpdate }: WebhookSimulatorProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<WebhookPayload>>({
    cardId: "",
    status: "in_transit",
    location: "",
    notes: "",
    statusType: "info"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as CardStatus }));
  };

  const handleStatusTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, statusType: value as StatusType }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardId) {
      toast({
        title: "Validation Error",
        description: "Card ID is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: WebhookPayload = {
        ...formData as WebhookPayload,
        timestamp: new Date().toISOString(),
      };

      const result = await simulateWebhook(payload);

      if (result.success) {
        toast({
          title: "Status Updated",
          description: "Card status has been updated successfully"
        });
        if (onUpdate) onUpdate();
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update card status",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      console.error("Error in webhook simulation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simulate Status Update</CardTitle>
        <CardDescription>
          Test the webhook functionality by simulating a card status update
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardId" className="block text-sm font-medium text-gray-700 mb-1">
              Card ID *
            </label>
            <Input
              id="cardId"
              name="cardId"
              value={formData.cardId}
              onChange={handleChange}
              placeholder="e.g. card-001"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="created">Created</SelectItem>
                <SelectItem value="embossing_queued">Embossing Queued</SelectItem>
                <SelectItem value="embossing_complete">Embossing Complete</SelectItem>
                <SelectItem value="quality_check_passed">Quality Check Passed</SelectItem>
                <SelectItem value="quality_check_failed">Quality Check Failed</SelectItem>
                <SelectItem value="dispatch_queued">Dispatch Queued</SelectItem>
                <SelectItem value="dispatched">Dispatched</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delivery_failed">Delivery Failed</SelectItem>
                <SelectItem value="destroyed">Destroyed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="statusType" className="block text-sm font-medium text-gray-700 mb-1">
              Status Type
            </label>
            <Select value={formData.statusType as string} onValueChange={handleStatusTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai Distribution Center"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes / Failure Reason
            </label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information about this status update"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Updating..." : "Simulate Webhook"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WebhookSimulator;
