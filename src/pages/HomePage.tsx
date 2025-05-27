import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, TrendingUp, Users, ShieldCheck, BadgePercent } from 'lucide-react';
import ProductCard, { Product } from '../components/products/ProductCard';

const mockFeaturedProducts: Product[] = [
  {
    id: '1',
    name: 'Apple MacBook Pro 14"',
    description: 'M3 Pro, 16GB RAM, 512GB SSD, Space Gray',
    image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 1999,
    bulkPrice: 1699,
    minGroupSize: 20,
    currentGroupSize: 15,
    deadline: '2025-06-15',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Samsung 55" 4K Smart TV',
    description: 'Crystal UHD 4K, Smart Hub, Multiple Voice Assistants',
    image: 'https://images.pexels.com/photos/5721867/pexels-photo-5721867.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 699,
    bulkPrice: 549,
    minGroupSize: 10,
    currentGroupSize: 6,
    deadline: '2025-06-10',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Wireless Noise Cancelling Headphones with Auto Noise Cancelling Optimizer',
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 399,
    bulkPrice: 299,
    minGroupSize: 10,
    currentGroupSize: 9,
    deadline: '2025-06-05',
    category: 'Electronics'
  },
  {
    id: '4',
    name: 'Dyson V12 Detect Slim',
    description: 'Cordless Vacuum Cleaner with Laser Detection',
    image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    regularPrice: 649.99,
    bulkPrice: 499.99,
    minGroupSize: 15,
    currentGroupSize: 8,
    deadline: '2025-06-20',
    category: 'Home'
  }
];

const testimonials = [
  {
    id: '1',
    text: "BulkBuy helped me save over $300 on a new laptop by connecting me with others looking to buy the same model. The process was seamless!",
    name: "Sarah Johnson",
    title: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: '2',
    text: "As a small business owner, every dollar counts. Through BulkBuy, I was able to purchase office equipment at wholesale prices without being a wholesaler myself.",
    name: "Michael Chen",
    title: "Startup Founder",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: '3',
    text: "The community aspect of BulkBuy is what sets it apart. Not only did I save money, but I connected with like-minded people who share similar interests.",
    name: "Priya Patel",
    title: "Product Designer",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg"
  }
];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY < 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-600 to-purple-700 text-white pt-32 pb-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Save Big by Shopping Together
            </h1>
            <p className="text-xl mb-8 text-teal-100">
              Connect with others who want the same products and unlock bulk discounts. The smart way to plan your purchases.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Link 
                to="/products" 
                className="bg-white text-teal-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg w-full md:w-auto"
              >
                Browse Products
              </Link>
              <Link 
                to="/auth" 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-teal-600 transition-colors w-full md:w-auto"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
          
          <div className="mt-12 max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products to buy in bulk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pr-12 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-800"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon size={20} />
              </div>
            </div>
            <div className="flex justify-center mt-4 text-sm text-teal-100">
              <span className="mr-2">Popular:</span>
              <div className="flex space-x-3">
                <span className="cursor-pointer hover:text-white transition-colors">Electronics</span>
                <span className="cursor-pointer hover:text-white transition-colors">Home Appliances</span>
                <span className="cursor-pointer hover:text-white transition-colors">Furniture</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="white" fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Trending Group Buys</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Join these active group purchases and save with others. The more people join, the bigger the discount!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockFeaturedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-md"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How BulkBuy Works</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Our platform makes it easy to save money through the power of collective purchasing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Join a Group</h3>
              <p className="text-gray-600">
                Find products you're interested in buying and join an existing group purchase or start your own.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Reach the Goal</h3>
              <p className="text-gray-600">
                Once enough people join the group buy, the discount is unlocked and everyone in the group saves.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgePercent className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Save Money</h3>
              <p className="text-gray-600">
                Make your purchase at the discounted bulk rate and save money on products you were planning to buy anyway.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">What Our Users Say</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Join thousands of satisfied users who are saving money through collaborative purchasing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose BulkBuy</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Our platform offers unique advantages that help you save money and shop smarter.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BadgePercent className="h-8 w-8 text-teal-200" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Save 15-40%</h3>
              <p className="text-gray-300">
                Access bulk pricing discounts that are normally only available to businesses.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-teal-200" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Community-Driven</h3>
              <p className="text-gray-300">
                Connect with like-minded shoppers and leverage collective purchasing power.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-teal-200" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
              <p className="text-gray-300">
                Shop with confidence knowing all transactions are protected and secure.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-teal-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-teal-200" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smarter Shopping</h3>
              <p className="text-gray-300">
                Plan purchases in advance and avoid impulse buying with our wishlist feature.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Saving?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join BulkBuy today and connect with others to unlock bulk discounts on your future purchases.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              to="/auth" 
              className="bg-white text-teal-600 px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg w-full md:w-auto"
            >
              Create Free Account
            </Link>
            <Link 
              to="/products" 
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-teal-600 transition-colors w-full md:w-auto"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;