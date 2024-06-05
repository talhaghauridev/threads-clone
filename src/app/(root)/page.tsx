import React from 'react'
import { UserButton} from "@clerk/nextjs";
const Home = () => {
  return (
    <div className="">
      <UserButton afterSignOutUrl='/'  />
    </div>
  )
}

export default Home
