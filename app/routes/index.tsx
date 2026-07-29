import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow text-center p-4">
      <h1 className="font-serif text-6xl md:text-8xl text-cleopatra-gold mb-6 drop-shadow-lg">
        كليوباترا
      </h1>
      <p className="font-sans text-xl md:text-2xl text-cleopatra-paleGold max-w-2xl">
        وجهتك الأولى للذهب والمجوهرات الفاخرة
      </p>
      
      <button className="mt-10 px-8 py-3 bg-cleopatra-gold text-cleopatra-deepSea font-bold rounded-full hover:bg-cleopatra-paleGold transition-all duration-300">
        تصفح المتجر
      </button>
    </div>
  );
}
