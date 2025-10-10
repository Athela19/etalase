import Header from "@/component/dashboard/header";
import ProductList from "@/component/dashboard/products/pageProducts";
import TestimoniPage from "@/component/dashboard/testimoni";

export default function HomeContent() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <Header />
      <ProductList />
      <TestimoniPage />
    </main>
  );
}
