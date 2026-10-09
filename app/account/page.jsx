import { auth } from "../_lib/auth"

export const metadata = {

  title: "Account"
}



export default async function page() {
  const session = await auth()
  return (
    <div>Welcome, {session?.user?.name}</div>
  )
}

