import Navbar from '../components/Navbar'
import AdminUploadForm from '../components/AdminUploadForm'
import AdminBooksTable from '../components/AdminBooksTable'
import Footer from '../components/Footer'
import { mockBooks } from '../data/mockBooks'

function Admin() {
  function handleUpload(formData) {
    console.log('Upload complete:', Object.fromEntries(formData.entries()))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-parchment-900">Admin Dashboard</h1>
          <p className="text-sm text-parchment-600 mt-1">Manage the Bookly library collection</p>
        </div>
        <AdminUploadForm onSubmit={handleUpload} />
        <AdminBooksTable books={mockBooks} />
      </main>
      <Footer />
    </div>
  )
}

export default Admin
