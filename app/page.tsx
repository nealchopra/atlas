import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <main className="text-center px-4">
        <h1 className="text-4xl font-semibold tracking-tight mb-4 bg-gradient-to-r from-slate-800 to-gray-600 bg-clip-text text-transparent">Research, faster.</h1>
        <p className="text-lg mb-8 max-w-xl mx-auto tracking-tight text-muted-foreground font-medium">
          Save papers to Notion and let AI handle the summarizing, organizing,
          and connecting — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="default" asChild>
            <Link href="/login">Get started</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              href="https://github.com/nealchopra/atlas"
              className="flex items-center gap-2"
            >
              View code
              <Image
                src="/github.svg"
                alt="GitHub logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
