import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function Landing() {
  const scrollContainerRef = useRef(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const navigate = useNavigate()

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" })
      setScrollPosition(scrollContainerRef.current.scrollLeft - 300)
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" })
      setScrollPosition(scrollContainerRef.current.scrollLeft + 300)
    }
  }

  const recipes = [
    {
      id: 1,
      title: "Spicy Grilled Paneer",
      description: "Spicy grilled paneer with herbs and olive oil fr...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Avocado Toast",
      description: "Creamy avocado on sourdough with poached eggs and...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Thai Green Curry",
      description: "Authentic Thai green curry with coconut milk and...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Mediterranean Salad",
      description: "Fresh Mediterranean salad with feta cheese and ol...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      title: "Chocolate Lava Cake",
      description: "Decadent chocolate lava cake with molten center and...",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      title: "Mushroom Risotto",
      description: "Creamy Italian risotto with wild mushrooms and pa...",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 gap-5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover & Share <span className="text-orange-500">Recipes</span> From Around The World
            </h1>
            <p className="text-lg text-gray-600 md:pr-12">
              CHOMP is a decentralized platform where food lovers can discover, share, and create recipes from diverse
              culinary traditions.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/store')}
                className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Explore Recipes
              </button>
              <button 
                onClick={() => navigate('/store')}
                className="px-6 py-3 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="relative h-full w-full rounded-2xl ">
            <img
              src="/R.jpeg"
              alt="Delicious food spread"
              className="rounded-2xl w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose CHOMP?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M7.5 12h9" />
                  <path d="M7.5 9h9" />
                  <path d="M7.5 15h9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Decentralized Sharing</h3>
              <p className="text-gray-600">
                Share your recipes directly with the community without intermediaries. You own your content.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Community-Curated Recipes</h3>
              <p className="text-gray-600">
                Discover recipes that have been tested and loved by our community of passionate food enthusiasts.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-orange-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Open Access to Global Cuisines</h3>
              <p className="text-gray-600">
                Explore diverse culinary traditions from around the world, all in one accessible platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Scroller */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Popular Recipes</h2>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                disabled={scrollPosition <= 0}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full border border-gray-300 hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="min-w-[280px] bg-white rounded-xl overflow-hidden shadow-sm flex-shrink-0 snap-start"
              >
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={recipe.image || "/placeholder.svg"}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm">{recipe.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Create Your Recipe Section */}
      <section className="py-16 px-6 bg-orange-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
              <img
                src="/Food-best-hd-photos.jpg"
                alt="Person cooking"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-6 order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Share Your Culinary Creations With The World
            </h2>
            <p className="text-lg text-gray-600">
              Have a recipe that everyone loves? Join our community and share your culinary masterpieces with food
              enthusiasts around the globe.
            </p>
            <button 
              onClick={() => navigate('/mint-recipe')}
              className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Create Your Own Recipe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}