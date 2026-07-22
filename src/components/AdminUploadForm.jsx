import { useState, useRef } from 'react'
import { Upload, Image as ImageIcon, FileText, X, Loader2 } from 'lucide-react'

const CATEGORIES = ['Fiction', 'Science', 'Technology', 'Non-Fiction']

const INITIAL_FORM = {
  title: '',
  author: '',
  category: '',
  customCategory: '',
  description: '',
}

function AdminUploadForm({ onSubmit, editingBook, onCancelEdit }) {
  const [form, setForm] = useState(() => {
    if (!editingBook) return INITIAL_FORM
    const isCustom = !CATEGORIES.includes(editingBook.category)
    return {
      title: editingBook.title,
      author: editingBook.author,
      category: isCustom ? '__custom' : editingBook.category,
      customCategory: isCustom ? editingBook.category : '',
      description: editingBook.description || '',
    }
  })
  const [errors, setErrors] = useState({})
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const coverRef = useRef(null)
  const pdfRef = useRef(null)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, cover: 'Please select an image file' }))
      setCoverFile(null)
      setCoverPreview(null)
      e.target.value = ''
      return
    }

    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    setErrors((prev) => {
      const next = { ...prev }
      delete next.cover
      return next
    })
  }

  function removeCover() {
    setCoverFile(null)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverPreview(null)
    if (coverRef.current) coverRef.current.value = ''
  }

  function handlePdfChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setErrors((prev) => ({ ...prev, pdf: 'Please select a PDF file' }))
      setPdfFile(null)
      e.target.value = ''
      return
    }

    setPdfFile(file)
    setErrors((prev) => {
      const next = { ...prev }
      delete next.pdf
      return next
    })
  }

  function removePdf() {
    setPdfFile(null)
    if (pdfRef.current) pdfRef.current.value = ''
  }

  function validate() {
    const errs = {}

    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.author.trim()) errs.author = 'Author is required'

    const useCustom = form.category === '__custom'
    const finalCategory = useCustom ? form.customCategory.trim() : form.category
    if (!finalCategory) errs.category = 'Category is required'
    if (useCustom && !form.customCategory.trim()) errs.customCategory = 'Enter a category name'

    if (!form.description.trim()) errs.description = 'Description is required'
    if (!coverFile) errs.cover = 'Cover image is required'
    if (!pdfFile) errs.pdf = 'PDF file is required'

    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setIsSubmitting(true)

    const finalCategory = form.category === '__custom'
      ? form.customCategory.trim()
      : form.category

    const formData = new FormData()
    formData.append('title', form.title.trim())
    formData.append('author', form.author.trim())
    formData.append('category', finalCategory)
    formData.append('description', form.description.trim())
    formData.append('coverImage', coverFile)
    formData.append('pdf', pdfFile)

    // Stub: log and simulate network delay
    console.log('Upload FormData:')
    for (const [key, val] of formData.entries()) {
      console.log(`  ${key}:`, val instanceof File ? `${val.name} (${val.type})` : val)
    }

    await new Promise((r) => setTimeout(r, 1500))

    setIsSubmitting(false)
    onSubmit?.(formData, editingBook?.id)

    // Reset form
    setForm(INITIAL_FORM)
    removeCover()
    removePdf()
    setErrors({})
  }

  function handleCancel() {
    setForm(INITIAL_FORM)
    removeCover()
    removePdf()
    setErrors({})
    onCancelEdit?.()
  }

  const fieldClass = (field) =>
    `w-full px-3 py-2.5 bg-white border rounded-lg text-sm text-parchment-900
     placeholder:text-parchment-400 transition-colors duration-150
     focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
     ${errors[field] ? 'border-red-400' : 'border-parchment-300'}`

  const labelClass = 'block text-sm font-medium text-parchment-700 mb-1.5'

  return (
    <div className="bg-parchment-200/50 border border-parchment-300/60 rounded-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-brand-500/10">
          <Upload size={18} className="text-brand-500" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-semibold text-parchment-900">
            {editingBook ? 'Edit Book' : 'Upload New Book'}
          </h2>
          <p className="text-xs text-parchment-500">
            {editingBook ? `Editing "${editingBook.title}"` : 'Add a book to the library collection'}
          </p>
        </div>
        {editingBook && (
          <button
            type="button"
            onClick={handleCancel}
            className="btn-ghost text-xs px-3 py-1.5"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title + Author row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="book-title" className={labelClass}>Title</label>
            <input
              id="book-title"
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. The Great Gatsby"
              className={fieldClass('title')}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="book-author" className={labelClass}>Author</label>
            <input
              id="book-author"
              type="text"
              value={form.author}
              onChange={(e) => updateField('author', e.target.value)}
              placeholder="e.g. F. Scott Fitzgerald"
              className={fieldClass('author')}
            />
            {errors.author && <p className="mt-1 text-xs text-red-500">{errors.author}</p>}
          </div>
        </div>

        {/* Category + Custom category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="book-category" className={labelClass}>Category</label>
            <select
              id="book-category"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className={`${fieldClass('category')} ${!form.category ? 'text-parchment-400' : ''}`}
            >
              <option value="" disabled>Select category...</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__custom">Custom category...</option>
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
          </div>

          {form.category === '__custom' && (
            <div>
              <label htmlFor="book-custom-category" className={labelClass}>Custom Category</label>
              <input
                id="book-custom-category"
                type="text"
                value={form.customCategory}
                onChange={(e) => updateField('customCategory', e.target.value)}
                placeholder="e.g. Philosophy"
                className={fieldClass('customCategory')}
              />
              {errors.customCategory && <p className="mt-1 text-xs text-red-500">{errors.customCategory}</p>}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="book-description" className={labelClass}>Description</label>
          <textarea
            id="book-description"
            rows="3"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="A brief description of the book..."
            className={`${fieldClass('description')} resize-none`}
          />
          {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/* File uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Cover image */}
          <div>
            <label className={labelClass}>Cover Image</label>
            {coverPreview ? (
              <div className="relative inline-block">
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-24 h-36 object-cover rounded-lg shadow-card border border-parchment-300/50"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <X size={12} />
                </button>
                <p className="mt-1.5 text-xs text-parchment-500 truncate max-w-[120px]">{coverFile?.name}</p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverRef.current?.click()}
                className={`w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed rounded-lg
                  transition-colors duration-150
                  ${errors.cover
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-parchment-300 bg-white hover:border-brand-400 hover:bg-brand-500/5'}`}
              >
                <ImageIcon size={20} className="text-parchment-400" />
                <span className="text-xs text-parchment-500">Click to upload image</span>
              </button>
            )}
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
            {errors.cover && <p className="mt-1 text-xs text-red-500">{errors.cover}</p>}
          </div>

          {/* PDF file */}
          <div>
            <label className={labelClass}>PDF File</label>
            {pdfFile ? (
              <div className="flex items-center gap-3 py-4 px-3 bg-white border border-parchment-300 rounded-lg">
                <FileText size={20} className="text-brand-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-parchment-900 truncate">{pdfFile.name}</p>
                  <p className="text-xs text-parchment-500">{(pdfFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  className="p-1 rounded-lg text-parchment-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => pdfRef.current?.click()}
                className={`w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed rounded-lg
                  transition-colors duration-150
                  ${errors.pdf
                    ? 'border-red-400 bg-red-50/50'
                    : 'border-parchment-300 bg-white hover:border-brand-400 hover:bg-brand-500/5'}`}
              >
                <FileText size={20} className="text-parchment-400" />
                <span className="text-xs text-parchment-500">Click to upload PDF</span>
              </button>
            )}
            <input
              ref={pdfRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfChange}
              className="hidden"
            />
            {errors.pdf && <p className="mt-1 text-xs text-red-500">{errors.pdf}</p>}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {editingBook ? 'Updating...' : 'Uploading...'}
            </>
          ) : (
            <>
              <Upload size={16} />
              {editingBook ? 'Update Book' : 'Upload Book'}
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default AdminUploadForm
