import { Link } from '@tanstack/react-router';

export function Navbar() {
  return (
    <header className="bg-cleopatra-cardDark border-b border-cleopatra-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* الشعار */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-serif text-3xl text-cleopatra-gold font-bold tracking-wider">
              كليوباترا
            </span>
          </Link>

          {/* روابط التنقل (تظهر في الشاشات الكبيرة) */}
          <nav className="hidden md:flex gap-8 text-cleopatra-paleGold font-medium">
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <Link to="/" className="hover:text-white transition-colors">المتجر</Link>
            {/* سنقوم بإنشاء مسار /store لاحقاً، حالياً نربطها بالرئيسية */}
          </nav>

          {/* أيقونات المستخدم والسلة */}
          <div className="flex items-center gap-4">
            <button className="text-cleopatra-paleGold hover:text-white transition-colors">
              تسجيل الدخول
            </button>
            <button className="bg-cleopatra-gold text-cleopatra-deepSea px-4 py-2 rounded-md font-bold hover:bg-cleopatra-paleGold transition-colors">
              السلة (0)
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
