import { motion } from 'framer-motion'

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-8">Welcome to Mently</h1>
        
        {/* Add your components here based on the design requirements */}
        <section className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frontend Challenge</h2>
          <p className="text-gray-600 mb-4">
            This is a starter template for your coding challenge. Add your components
            and implement the design requirements here.
          </p>
        </section>
      </motion.div>
    </main>
  )
}