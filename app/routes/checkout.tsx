import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { createOrder } from '../utils/orders.server';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [successId, setSuccessId] = useState('');
  const [error, setError] = useState('');

  // كمثال تجريبي للسلة (في التطبيق الفعلي تُربط بحالة سلة الشراء المحلية)
  const cartItems = [
    { productId: 'sample-id', name: 'قلادة كليوباترا الذهبية', priceUsd: 450, priceIqd: 690000, quantity: 1 }
  ];
  const totalUsd = 450;
  const totalIqd = 690000;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await createOrder({
        data: {
          customerName: name,
          phone,
          address,
          items: cartItems,
          totalUsd,
          totalIqd,
        }
      });
      setSuccessId(res.orderId);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إتمام الطلب');
    } finally {
      setLoading(false);
    }
  };

  if (successId) {
    return (
      <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
        <div className="bg-cleopatra-cardDark border border-cleopatra-gold/40 p-8 rounded-2xl max-w-md w-full">
          <h2 className="font-serif text-3xl text-cleopatra-gold mb-4">تم طلبك بنجاح!</h2>
          <p className="text-cleopatra-paleGold mb-6">شكراً لتسوقك من متجر كليوباترا. تم إرسال تفاصيل طلبك للإدارة وسيتم الاتصال بك قريباً.</p>
          <div className="text-sm text-gray-400 bg-cleopatra-deepSea p-3 rounded-lg">
            رقم الطلب: #{successId.slice(0, 8)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 flex-grow">
      <h1 className="font-serif text-3xl text-cleopatra-gold text-center mb-8">إتمام الطلب والتثبيت</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-500 text-red-200 rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="bg-cleopatra-cardDark border border-cleopatra-gold/20 p-8 rounded-2xl space-y-6 shadow-xl">
        <div>
          <label className="block text-sm text-gray-300 mb-2">الاسم الكامل</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-cleopatra-deepSea border border-cleopatra-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cleopatra-gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">رقم الهاتف (للتواصل وتأكيد الطلب)</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07701234567"
            className="w-full bg-cleopatra-deepSea border border-cleopatra-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cleopatra-gold"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">عنوان التوصيل بالتفصيل (المحافظة، المنطقة، أقرب نقطة دالة)</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full bg-cleopatra-deepSea border border-cleopatra-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cleopatra-gold"
            required
          />
        </div>

        <div className="border-t border-cleopatra-gold/20 pt-6 flex justify-between items-center text-lg font-bold text-white">
          <span>الإجمالي النهائي:</span>
          <div className="text-left">
            <div className="text-cleopatra-gold">{totalIqd.toLocaleString()} د.ع</div>
            <div className="text-xs text-gray-400">(${totalUsd})</div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cleopatra-gold text-cleopatra-deepSea font-bold py-3.5 rounded-lg hover:bg-cleopatra-paleGold transition-colors"
        >
          {loading ? 'جاري تثبيت الطلب...' : 'تأكيد وإرسال الطلب'}
        </button>
      </form>
    </div>
  );
}
