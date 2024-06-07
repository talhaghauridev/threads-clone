import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata:Metadata = {
  title:"Sign-in -- Threads"
} 

export default function Page() {
  return (
    <section className="sign-in">
      <SignUp />
    </section>
  );
}
