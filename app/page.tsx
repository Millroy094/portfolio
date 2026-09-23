import Home from "@/app/home/Home";

export default async function HomePage() {
  return (
    <div>
      <main id="main-content">
        <Home />
      </main>
    </div>
  );
}

export const revalidate = 1800;
