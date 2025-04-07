import { Link } from 'react-router-dom';

const Footer = () => {
    return(
        <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-4">
              <img 
                src="/logo1.svg" 
                alt="CHOMP Logo" 
                className="h-10 w-auto"
              />
              <p className="text-gray-400 max-w-md">A decentralized recipe sharing platform for food lovers around the world.</p>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
              <Link to="/store" className="text-gray-400 hover:text-white">
                Menu
              </Link>
              <Link to="/store" className="text-gray-400 hover:text-white">
                Popular Recipes
              </Link>
              <Link to="/mint-recipe" className="text-gray-400 hover:text-white">
                Create Recipe
              </Link>
            </div>
          </div>
          <div className="pt-6 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} CHOMP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}
export default Footer; 