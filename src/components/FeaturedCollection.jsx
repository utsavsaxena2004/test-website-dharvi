import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    name: 'Silk Saree',
    price: '₹12,999',
    image: 'https://images.unsplash.com/photo-1610189031358-65df716379eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    category: 'Sarees',
  },
  {
    id: 2,
    name: 'Lehenga Set',
    price: '₹24,999',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    category: 'Lehengas',
  },
  {
    id: 3,
    name: 'Kurti Set',
    price: '₹3,999',
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    category: 'Kurtis',
  },
  {
    id: 4,
    name: 'Anarkali Suit',
    price: '₹8,999',
    image: 'https://images.unsplash.com/photo-1596939502949-85cc5086e798?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    category: 'Suits',
  },
];

const FeaturedCollection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-light text-gray-900 mb-4">Our Curated Collection</h2>
          <div className="w-24 h-[1px] bg-pink mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of traditional wear, where timeless heritage meets contemporary elegance</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <motion.div 
                className="relative overflow-hidden"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-white text-black hover:bg-pink hover:text-white transition-colors duration-300"
                  >
                    Quick View
                  </motion.button>
                </div>
              </motion.div>
              <div className="mt-6 text-center px-2">
                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-pink font-medium">{product.price}</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-4 w-full py-2 border border-pink text-pink hover:bg-pink hover:text-white transition-all duration-300"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <a 
            href="/collections" 
            className="inline-block px-8 py-3 border border-pink text-pink hover:bg-pink hover:text-white transition-all duration-300"
          >
            VIEW ALL COLLECTIONS
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollection; 