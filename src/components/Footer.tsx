
import { Link } from 'react-router-dom';
import { Cpu, Facebook, Instagram, Twitter, Youtube, FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gaming-dark border-t border-gaming-light-gray/20 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="h-6 w-6 text-gaming-blue" />
              <span className="text-xl font-bold font-orbitron text-white">BattleforgePC</span>
            </div>
            <p className="text-gray-400 mb-4">
              Custom high-performance gaming computers, workstations, and components built for enthusiasts by enthusiasts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gaming-blue" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-blue" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-blue" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gaming-blue" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/gaming-pcs" className="text-gray-400 hover:text-gaming-blue">Gaming PCs</Link></li>
              <li><Link to="/workstations" className="text-gray-400 hover:text-gaming-blue">Workstations</Link></li>
              <li><Link to="/customize" className="text-gray-400 hover:text-gaming-blue">PC Configurator</Link></li>
              <li><Link to="/components" className="text-gray-400 hover:text-gaming-blue">Components</Link></li>
              <li><Link to="/prebuilt" className="text-gray-400 hover:text-gaming-blue">Pre-built PCs</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/support#contact" className="text-gray-400 hover:text-gaming-blue">Contact Us</Link></li>
              <li><Link to="/support#faq" className="text-gray-400 hover:text-gaming-blue">FAQs</Link></li>
              <li><Link to="/support#warranty" className="text-gray-400 hover:text-gaming-blue">Warranty</Link></li>
              <li><Link to="/support#returns" className="text-gray-400 hover:text-gaming-blue">Returns</Link></li>
              <li><Link to="/support#status" className="text-gray-400 hover:text-gaming-blue">System Status</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-white font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-gaming-blue">About Us</Link></li>
              <li><Link to="/about#blog" className="text-gray-400 hover:text-gaming-blue">Blog</Link></li>
              <li><Link to="/about#careers" className="text-gray-400 hover:text-gaming-blue">Careers</Link></li>
              <li><Link to="/about#press" className="text-gray-400 hover:text-gaming-blue">Press</Link></li>
              <li><Link to="/about#partners" className="text-gray-400 hover:text-gaming-blue">Partners</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gaming-light-gray/20 text-center md:text-left md:flex md:justify-between md:items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} BattleforgePC Gaming. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm text-gray-500">
              <li><Link to="/terms" className="hover:text-gaming-blue">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-gaming-blue">Privacy</Link></li>
              <li><Link to="/sitemap" className="hover:text-gaming-blue flex items-center">
                <FileText className="h-3 w-3 mr-1" />
                Sitemap
              </Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
