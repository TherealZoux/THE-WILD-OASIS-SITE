import Spinner from "../_components/Spinner";

export default function Loading() {
  return <div className="flex justify-center items-center flex-col">
    <Spinner />
    <h1 className="text-xl text-primary-200">Loading Cabins ...</h1>
  </div>
}
