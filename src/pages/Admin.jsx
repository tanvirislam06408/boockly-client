import Navbar from '../components/Navbar'
import AdminUploadForm from '../components/AdminUploadForm'
import AdminBooksTable from '../components/AdminBooksTable'
import Footer from '../components/Footer'
import { mockBooks } from '../data/mockBooks'

function Admin() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <AdminUploadForm />
        <AdminBooksTable books={mockBooks} />
      </main>
      <Footer />
    </div>
  )
}

export default Admin
