
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WorkstationsPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-gaming-blue mb-8">Professional Workstations</h1>
        <div className="bg-gaming-dark/30 rounded-lg p-8">
          <p className="text-gray-300 mb-4">
            High-performance workstations designed for professional content creation,
            3D rendering, and demanding computational tasks.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Placeholder for workstation products */}
            <div className="bg-gaming-dark rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gaming-blue mb-2">Coming Soon</h3>
              <p className="text-gray-400">Our workstation collection will be available shortly.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WorkstationsPage;
