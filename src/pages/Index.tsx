
import { useState, useEffect } from "react";
import { Card } from "@/lib/types";
import { mockAnalytics } from "@/lib/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import CardDetails from "@/components/CardDetails";
import CardJourney from "@/components/CardJourney";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import WebhookSimulator from "@/components/WebhookSimulator";
import { CreditCard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subscribeToCardUpdates } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Subscribe to real-time card updates
  useEffect(() => {
    const unsubscribe = subscribeToCardUpdates((updatedCard) => {
      // If we have a selected card and it was updated, update our local state
      if (selectedCard && selectedCard.id === updatedCard.id) {
        setSelectedCard(updatedCard);
        
        // Show a toast notification
        toast({
          title: "Card Status Updated",
          description: `Status changed to: ${updatedCard.currentStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        });
      }
      
      // Always refresh data when any card is updated
      setRefreshTrigger(prev => prev + 1);
    });
    
    // Cleanup the subscription when component unmounts
    return () => unsubscribe();
  }, [selectedCard]);

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
  };

  const handleStatusUpdate = () => {
    // This function is still needed for the WebhookSimulator component
    // but most of its functionality is now handled by the subscription
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Card Journey Tracker</h1>
            <p className="text-gray-600">Track and manage card lifecycle from approval to delivery</p>
          </div>
          
          <SearchBar onCardSelect={handleCardSelect} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!selectedCard && (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4 rounded-full bg-blue-100 mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Search for a Card</h2>
                <p className="text-gray-600 max-w-md text-center mb-6">
                  Enter a mobile number, PAN last 4 digits, or search by customer name to track the card journey
                </p>
                <p className="text-sm text-gray-500">Example searches: 9876543210, 1234, John Smith</p>
              </div>
            )}

            {selectedCard && (
              <>
                <CardDetails card={selectedCard} />
                <CardJourney card={selectedCard} />
              </>
            )}

            <div className="mt-8">
              <AnalyticsPanel data={mockAnalytics} />
            </div>
          </div>
          
          <div>
            <Tabs defaultValue="simulator">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simulator">Simulator</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>
              <TabsContent value="simulator">
                <div className="mt-4">
                  <WebhookSimulator onUpdate={handleStatusUpdate} />
                </div>
              </TabsContent>
              <TabsContent value="help">
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-medium text-lg mb-2">Using the Simulator</h3>
                  <p className="text-gray-600 mb-4">
                    The webhook simulator allows you to test status updates in real-time. 
                    In a production environment, external systems would send webhook requests 
                    to update card statuses automatically.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try updating the status of card-001, card-002, or card-003 to see real-time updates.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
