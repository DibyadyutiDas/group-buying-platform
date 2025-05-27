import React from 'react';
import { Calendar, Trash2, Edit } from 'lucide-react';

interface WishlistItem {
  id: string;
  productName: string;
  image: string;
  estimatedPurchaseDate: string;
  price: number;
  notes: string;
}

const mockWishlistItems: WishlistItem[] = [
  {
    id: '1',
    productName: 'iPad Pro 12.9"',
    image: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    estimatedPurchaseDate: '2025-07-15',
    price: 1099.99,
    notes: 'Wait for back to school sales'
  },
  {
    id: '2',
    productName: 'Dyson V12 Vacuum',
    image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    estimatedPurchaseDate: '2025-08-10',
    price: 649.99,
    notes: 'Check for Prime Day deals'
  },
  {
    id: '3',
    productName: 'Herman Miller Aeron Chair',
    image: 'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    estimatedPurchaseDate: '2025-09-01',
    price: 1495,
    notes: 'Look for open box or refurbished options'
  }
];

const WishlistItems: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Wishlist</h2>
      
      <div className="space-y-6">
        {mockWishlistItems.map((item) => (
          <div key={item.id} className="flex border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <img 
              src={item.image} 
              alt={item.productName} 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">{item.productName}</h3>
                <span className="text-gray-700 font-medium">${item.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar size={14} className="mr-1" />
                <span>Planning to buy: {new Date(item.estimatedPurchaseDate).toLocaleDateString()}</span>
              </div>
              {item.notes && (
                <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
              )}
            </div>
            <div className="ml-4 flex flex-col space-y-2">
              <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors">
                <Edit size={16} />
              </button>
              <button className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors">
        Add New Wishlist Item
      </button>
    </div>
  );
};

export default WishlistItems;