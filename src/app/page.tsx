import Image from "next/image";
import { validateRequest } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function Home() {
  const { session, user } = await validateRequest();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-background gap-8">
      <section className="flex flex-col gap-5 justify-between lg:justify-start items-center w-full lg:w-2/3">
        <img
          src="https://illustrations.popsy.co/white/communication.svg"
          alt="illustration"
          width={400}
          height={400}
        />
        <div className="flex flex-col gap-2 items-center justify-center">
          <h2 className="text-4xl font-black text-center text-foreground">
            Everyone can be a reporter
          </h2>
          <p className="text-lg text-center text-muted-foreground">
            Report, alert, and inform the public and government about issues in
            your community.
          </p>
          <Link
            href={user ? "/feed" : "/signup"}
            className="bg-foreground text-background rounded-lg p-2 px-4 hover:bg-opacity-80 transition-colors"
          >
            Get started
          </Link>
        </div>
      </section>
      <section className="grid lg:grid-cols-3 grid-cols-1 gap-4 lg:w-2/3 w-full">
        <div className="flex flex-col gap-2 items-center justify-center p-2 rounded-lg border border-border">
          <img
            src="https://illustrations.popsy.co/white/video-call.svg"
            alt="illustration"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-bold text-foreground">Secure</h3>
          <p className="text-sm text-muted-foreground text-center">
            Your data is encrypted and secure. We will never share your data
            with third parties.
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center p-2 rounded-lg border border-border">
          <img
            src="https://illustrations.popsy.co/white/businessman-with-a-suitcase.svg"
            alt="illustration"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-bold text-foreground">Community</h3>
          <p className="text-sm text-muted-foreground text-center">
            Connect with your community and stay informed about local issues.
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center p-2 rounded-lg border border-border">
          <img
            src="https://illustrations.popsy.co/white/question-mark.svg"
            alt="illustration"
            width={200}
            height={200}
          />
          <h3 className="text-xl font-bold text-foreground">Government</h3>
          <p className="text-sm text-muted-foreground text-center">
            Report issues to the government and hold them accountable.
          </p>
        </div>
      </section>
    </main>
  );
}
