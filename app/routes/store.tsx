import { createFileRoute } from '@tanstack/react-router';
import { getProducts } from '../utils/products.server';
import { useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/store')({
  loader: async () => await getProducts(),
  component: StorePage,
});

function StorePage() {
  const products = Route.useLoaderData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-cleopatra-gold mb-4">تشكيلة المجوهرات الفاخرة</h1>
        <p className="text-cleopatra-paleGold">قطع ذهبية مصاغة بعناية فائقة تلبي أرقى الأذواق</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          لا توجد منتجات مضافة حالياً. يمكنك إضافتها عبر لوحة التحكم.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <div key={product.id} className="bg-cleopatra-cardDark border border-cleopatra-gold/20 rounded-xl overflow-hidden shadow-xl hover:border-cleopatra-gold transition-all duration-300">
              <div className="h-64 bg-gray-800 relative">
                {product.images && product.images[0] ? (
                  <img src={product.images[0]} alt={product.name_ar} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-cleopatra-gold/40 font-serif text-xl">كليوباترا</div>
                )}
                <span className="absolute top-4 right-4 bg-cleopatra-deepSea/80 text-cleopatra-gold px-3 py-1 rounded-full text-xs font-bold border border-cleopatra-gold/30">
                  عيار {product.karat}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="font-serif text-xl text-white mb-2">{product.name_ar}</h3>
                <div className="text-sm text-gray-400 mb-4 space-y-1">
                  <div>الوزن: {product.weight_grams} غرام</div>
                  <div>أجور الصياغة: ${product.making_charge}</div>
                </div>

                <button className="w-full bg-cleopatra-gold text-cleopatra-deepSea font-bold py-2.5 rounded-lg hover:bg-cleopatra-paleGold transition-colors">
                  عرض التفاصيل والشراء
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
