import React from 'react';
import { DollarSign, Users, ShoppingBag, Clock } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-semibold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Savings"
        value="$1,245.00"
        icon={<DollarSign className="h-6 w-6 text-white" />}
        color="bg-green-500"
      />
      <StatsCard
        title="Active Groups"
        value="8"
        icon={<Users className="h-6 w-6 text-white" />}
        color="bg-blue-500"
      />
      <StatsCard
        title="Completed Orders"
        value="12"
        icon={<ShoppingBag className="h-6 w-6 text-white" />}
        color="bg-purple-500"
      />
      <StatsCard
        title="Pending Purchases"
        value="5"
        icon={<Clock className="h-6 w-6 text-white" />}
        color="bg-amber-500"
      />
    </div>
  );
};

export default DashboardStats;