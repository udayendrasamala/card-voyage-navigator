
import { useState, useEffect } from "react";
import { Card } from "@/lib/types";
import { getCardByIdentifier, mockAnalytics } from "@/lib/mockData";
import DashboardLayout from "@/components/DashboardLayout";
import SearchBar from "@/components/SearchBar";
import CardDetails from "@/components/CardDetails";
import CardJourney from "@/components/CardJourney";
import AnalyticsPanel from "@/components/AnalyticsPanel";
import WebhookSimulator from "@/components/WebhookSimulator";
import { CreditCard, Search, Webhook } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [identifierInput, setIdentifierInput] = useState("");
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = () => {
    if (!identifierInput.trim()) {
      setError("Please enter a mobile number, PAN, or card ID");
      return;
    }

    const card = getCardByIdentifier(identifierInput);
    
    if (card) {
      setSelectedCard(card);
      setError("");
    } else {
      setError("No card found with the provided details");
      setSelectedCard(null);
    }
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    setError("");
  };

  const handleStatusUpdate = () => {
    // Refresh data when status is updated via webhook
    setRefreshTrigger(prev => prev + 1);
    
    // If a card is selected, refresh it
    if (selectedCard) {
      const updatedCard = getCardByIdentifier(selectedCard.id);
      if (updatedCard) {
        setSelectedCard(updatedCard);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Card Journey Tracker</h1>
            <p className="text-gray-600">Track and manage card lifecycle from approval to delivery</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar onCardSelect={handleCardSelect} />
            
            <div className="flex">
              <input
                type="text"
                placeholder="Mobile No. or PAN Last 4"
                className="border border-gray-300 rounded-l-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
              />
              <button 
                className="bg-blue-600 text-white px-4 py-2.5 rounded-r-lg hover:bg-blue-700 transition-colors flex items-center"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 mr-1" />
                Search
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {!selectedCard && !error && (
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
                  <h3 className="font-medium text-lg mb-2">Using Webhooks</h3>
                  <p className="text-gray-600 mb-4">
                    In a real-world implementation, different services would send webhook requests 
                    to update card status. Visit the webhook configuration page to set up API keys and endpoints.
                  </p>
                  <a 
                    href="/api/webhook" 
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <Webhook className="h-4 w-4 mr-1" />
                    Configure Webhook
                  </a>
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
