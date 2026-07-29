import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { requestOtp, verifyOtpAndLogin } from '../utils/auth.server';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
});

function AuthPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await requestOtp({ data: { phone } });
      setStep('otp');
      setMessage('تم إرسال رمز التحقق. يرجى فتح بوت تليغرام الخاص بالمتجر للحصول على الرمز.');
    } catch (err: any) {
      setMessage(err.message || 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await verifyOtpAndLogin({ data: { phone, code } });
      setMessage('تم تسجيل الدخول بنجاح!');
      // توجيه المستخدم للرئيسية أو الحساب
    } catch (err: any) {
      setMessage(err.message || 'رمز التحقق خاطئ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-4 py-12">
      <div className="max-w-md w-full bg-cleopatra-cardDark border border-cleopatra-gold/20 p-8 rounded-2xl shadow-2xl">
        <h2 className="font-serif text-3xl text-cleopatra-gold text-center mb-2">تسجيل الدخول</h2>
        <p className="text-cleopatra-paleGold text-center text-sm mb-8">عبر رقم الهاتف العراقي وبوت تليغرام الآمن</p>

        {message && (
          <div className="mb-6 p-3 bg-cleopatra-deepSea border border-cleopatra-gold/40 text-cleopatra-paleGold text-sm rounded-lg text-center">
            {message}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">رقم الهاتف العراقي</label>
              <input
                type="text"
                placeholder="07701234567 أو +9647701234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-cleopatra-deepSea border border-cleopatra-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cleopatra-gold"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cleopatra-gold text-cleopatra-deepSea font-bold py-3 rounded-lg hover:bg-cleopatra-paleGold transition-colors"
            >
              {loading ? 'جاري الإرسال...' : 'إرسال رمز التحقق عبر تليغرام'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-300 mb-2">أدخل رمز التحقق (6 أرقام)</label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-center tracking-widest text-2xl bg-cleopatra-deepSea border border-cleopatra-gold/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cleopatra-gold"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cleopatra-gold text-cleopatra-deepSea font-bold py-3 rounded-lg hover:bg-cleopatra-paleGold transition-colors"
            >
              {loading ? 'جاري التحقق...' : 'تأكيد ودخول'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
