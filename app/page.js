import Header from "@/component/dashboard/header";
import ProductList from "@/component/dashboard/products/pageProducts";

export default function HomeContent() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <Header />
      <ProductList />
    </main>
  );
}
