import React from 'react';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GroupBuy {
  id: string;
  productName: string;
  image: string;
  deadline: string;
  progress: number;
  currentMembers: number;
  requiredMembers: number;
}

const mockGroupBuys: GroupBuy[] = [
  {
    id: '1',
    productName: 'Apple MacBook Pro 14"',
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    deadline: '2025-06-15',
    progress: 75,
    currentMembers: 15,
    requiredMembers: 20
  },
  {
    id: '2',
    productName: 'Samsung 55" 4K Smart TV',
    image: 'https://images.pexels.com/photos/5721867/pexels-photo-5721867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    deadline: '2025-06-10',
    progress: 60,
    currentMembers: 6,
    requiredMembers: 10
  },
  {
    id: '3',
    productName: 'Sony WH-1000XM5 Headphones',
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    deadline: '2025-06-05',
    progress: 90,
    currentMembers: 9,
    requiredMembers: 10
  }
];

const ActiveGroupBuys: React.FC = () => {
  // Calculate days left until deadline
  const daysLeft = (dateString: string) => {
    const deadline = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(deadline.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Active Group Buys</h2>
        <Link to="/products" className="text-teal-600 hover:text-teal-700 flex items-center">
          <span className="mr-1">View All</span>
          <ArrowRight size={16} />
        </Link>
      </div>
      
      <div className="space-y-6">
        {mockGroupBuys.map((groupBuy) => (
          <div key={groupBuy.id} className="flex items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <img 
              src={groupBuy.image} 
              alt={groupBuy.productName} 
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="ml-4 flex-1">
              <h3 className="font-medium text-gray-800">{groupBuy.productName}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Users size={14} className="mr-1" />
                <span>{groupBuy.currentMembers}/{groupBuy.requiredMembers} members</span>
                <span className="mx-2">•</span>
                <Clock size={14} className="mr-1" />
                <span>{daysLeft(groupBuy.deadline)} days left</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full" 
                  style={{ width: `${groupBuy.progress}%` }}
                ></div>
              </div>
            </div>
            <button className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveGroupBuys;