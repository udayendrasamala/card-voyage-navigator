
import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/lib/types";
import { searchCards } from "@/lib/mockData";

interface SearchBarProps {
  onCardSelect: (card: Card) => void;
}

const SearchBar = ({ onCardSelect }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Card[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 2) {
      const searchResults = searchCards(value);
      setResults(searchResults);
      setIsDropdownOpen(true);
    } else {
      setResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleSelectCard = (card: Card) => {
    setQuery(`${card.customerName} (${card.panLastFour})`);
    setIsDropdownOpen(false);
    onCardSelect(card);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search by mobile, PAN, customer name..."
          value={query}
          onChange={handleSearch}
          onFocus={() => query.trim().length > 2 && setIsDropdownOpen(true)}
          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
        />
      </div>

      {isDropdownOpen && results.length > 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <ul className="max-h-60 overflow-auto py-1">
            {results.map((card) => (
              <li
                key={card.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCard(card)}
              >
                <div className="font-medium">{card.customerName}</div>
                <div className="text-sm text-gray-600">
                  Card: {card.panLastFour} • Mobile: {card.mobileNumber}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isDropdownOpen && query.trim().length > 2 && results.length === 0 && (
        <div className="absolute mt-1 w-full bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <div className="px-4 py-2 text-gray-500">No results found</div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
