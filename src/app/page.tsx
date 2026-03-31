import CategoryList from '@/components/CategoryList';
import ProductList from '@/components/ProductList';
import Slider from '@/components/Slider';

const HomePage = () => {
  return (
    <div className="overflow-x-hidden">
      <Slider />

      {/* Featured Products */}
      <section className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-32">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="heading-gradient text-3xl font-extrabold tracking-tight animate-fade-up opacity-0-init">
            Featured Products
          </h1>
          <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent mb-2 animate-fade-up opacity-0-init" style={{ animationDelay: '0.1s' }} />
        </div>
        <p className="text-gray-400 text-sm mb-8 animate-fade-up opacity-0-init" style={{ animationDelay: '0.15s' }}>
          Hand-picked just for you
        </p>
        <ProductList categoryId="" limit={8} />
      </section>

      {/* Categories */}
      <section className="mt-28">
        <div className="px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-8 flex items-end gap-4">
          <h1 className="heading-gradient text-3xl font-extrabold tracking-tight animate-fade-up opacity-0-init">
            Shop by Category
          </h1>
          <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent mb-2 animate-fade-up opacity-0-init" style={{ animationDelay: '0.1s' }} />
        </div>
        <CategoryList />
      </section>

      {/* New Products */}
      <section className="mt-28 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-32">
        <div className="flex items-end gap-4 mb-2">
          <h1 className="heading-gradient text-3xl font-extrabold tracking-tight animate-fade-up opacity-0-init">
            New Arrivals
          </h1>
          <span className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent mb-2 animate-fade-up opacity-0-init" style={{ animationDelay: '0.1s' }} />
        </div>
        <p className="text-gray-400 text-sm mb-8 animate-fade-up opacity-0-init" style={{ animationDelay: '0.15s' }}>
          Fresh drops, straight to you
        </p>
        <ProductList categoryId="" limit={8} searchParams={{ sort: 'newest' }} />
      </section>

      {/* Bottom padding for footer gap */}
      <div className="mt-24" />
    </div>
  );
};

export default HomePage;
