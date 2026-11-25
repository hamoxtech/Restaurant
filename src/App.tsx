import { MotionConfig } from 'framer-motion'
import { OrderProvider } from './components/Order/OrderContext'
import { OrderDrawer } from './components/Order/OrderDrawer'
import { OrderBar } from './components/Order/OrderBar'
import { Navbar } from './components/Navbar/Navbar'
import { Hero } from './components/Hero/Hero'
import { FoodDecomposition } from './components/FoodDecomposition/FoodDecomposition'
import { FriedRiceShowcase } from './components/FriedRiceShowcase/FriedRiceShowcase'
import { FoodStory } from './components/FoodStory/FoodStory'
import { Biriyani } from './components/Biriyani/Biriyani'
import { Shawarma } from './components/Shawarma/Shawarma'
import { BestSellers } from './components/BestSellers/BestSellers'
import { Menu } from './components/Menu/Menu'
import { Craving } from './components/Craving/Craving'
import { RestaurantStory } from './components/RestaurantStory/RestaurantStory'
import { Location } from './components/Location/Location'
import { CTA } from './components/CTA/CTA'
import { Footer } from './components/Footer/Footer'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <OrderProvider>
        <Navbar />
        <main id="main">
          <Hero />
          <FoodDecomposition />
          <FriedRiceShowcase />
          <FoodStory />
          <Biriyani />
          <Shawarma />
          <BestSellers />
          <Menu />
          <Craving />
          <RestaurantStory />
          <Location />
          <CTA />
        </main>
        <Footer />
        <OrderDrawer />
        <OrderBar />
      </OrderProvider>
    </MotionConfig>
  )
}
