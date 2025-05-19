
import { useState } from "react";
import { CardStatus, StatusEvent } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

export const WebhookPage = () => {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  const handleGenerateApiKey = () => {
    // In a real app, this would be generated and stored securely on the server
    const newApiKey = `wh_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(newApiKey);
    toast({
      title: "API Key Generated",
      description: "Your new webhook API key has been generated. Keep it secure!",
    });
  };

  const handleCopyWebhook = () => {
    const webhookBaseUrl = window.location.origin + "/api/webhook";
    navigator.clipboard.writeText(`${webhookBaseUrl}?key=${apiKey}`);
    toast({
      title: "Webhook URL Copied",
      description: "Webhook URL has been copied to clipboard",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Card Status Webhook Management</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate API Key</h2>
        <p className="mb-4 text-gray-600">
          Generate an API key to authenticate webhook requests. In a production environment, 
          this would be handled securely on the server.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
          <button 
            onClick={handleGenerateApiKey}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Generate New API Key
          </button>
          
          {apiKey && (
            <div className="flex-1 p-2 bg-gray-100 rounded border border-gray-300 break-all">
              <code>{apiKey}</code>
            </div>
          )}
        </div>
        
        {apiKey && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">Your Webhook URL:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 p-2 bg-gray-100 rounded border border-gray-300 break-all">
                {window.location.origin}/api/webhook?key={apiKey}
              </div>
              <button 
                onClick={handleCopyWebhook}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Webhook Documentation</h2>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Endpoint:</h3>
          <code className="p-2 bg-gray-100 rounded block">{window.location.origin}/api/webhook</code>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Method:</h3>
          <code className="p-2 bg-gray-100 rounded block">POST</code>
        </div>
        
        <div className="mb-4">
          <h3 className="font-medium mb-2">Headers:</h3>
          <pre className="p-2 bg-gray-100 rounded block overflow-x-auto">
{`{
  "Content-Type": "application/json",
  "X-API-Key": "your-api-key-here"
}`}
          </pre>
        </div>
        
        <div>
          <h3 className="font-medium mb-2">Request Body Example:</h3>
          <pre className="p-2 bg-gray-100 rounded block overflow-x-auto">
{`{
  "cardId": "card-001",
  "status": "in_transit",
  "timestamp": "2025-05-15T11:30:00Z",
  "location": "Regional Hub Mumbai",
  "notes": "Card en route to delivery center",
  "agentId": "AG123",
  "statusType": "info"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default WebhookPage;
