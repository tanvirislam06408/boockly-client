function CategoryFilter() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex gap-2 flex-wrap">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm">All</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">Fiction</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">Non-Fiction</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">Science</button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300">Technology</button>
      </div>
    </div>
  )
}

export default CategoryFilter
