"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

function Filter() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  function handleFilter(filter) {
    const params = new URLSearchParams(searchParams)
    params.set("capacity", filter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const activeFilter = searchParams.get('capacity') ?? "all"
  return (
    <div className="border border-primary-900 flex m-4">

      <Button filter="all" activeFilter={activeFilter} handleFilter={handleFilter} >All cabins</Button>
      <Button filter="small" activeFilter={activeFilter} handleFilter={handleFilter}>1-3 guests</Button>
      <Button filter="medium" activeFilter={activeFilter} handleFilter={handleFilter}>4-7 guests</Button>
      <Button filter="large" activeFilter={activeFilter} handleFilter={handleFilter}>8-12 guests</Button>

    </div>
  )
}

function Button({ filter, activeFilter, handleFilter, children }) {
  return <button className={`px-5 py-2 hover:bg-primary-700 ${activeFilter === filter ? 'bg-primary-700' : ""} `} onClick={() => handleFilter(filter)}   >{children}</button>

}

export default Filter
