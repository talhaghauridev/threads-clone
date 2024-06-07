import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="sign-in">
      <SignIn />
    </section>
  );
}
