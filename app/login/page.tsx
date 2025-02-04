"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setIsLoading(true);
        // Check for hash fragment
        if (window.location.hash) {
          const hashParams = new URLSearchParams(
            window.location.hash.substring(1)
          );
          const accessToken = hashParams.get("access_token");

          if (accessToken) {
            console.log("Found access token in URL, setting session...");
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get("refresh_token") || "",
            });

            if (error) {
              console.error("Error setting session:", error);
              return;
            }

            // Clear the hash fragment
            window.location.hash = "";

            console.log("Session set, redirecting to dashboard...");
            router.push("/dashboard");
            return;
          }
        }

        // If no hash, check for existing session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (session) {
          console.log("Existing session found, redirecting to dashboard...");
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error handling auth callback:", err);
      } finally {
        setIsLoading(false);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}

function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const handleGitHubLogin = async () => {
    console.log("Starting GitHub login...");
    console.log("Window location:", {
      origin: window.location.origin,
      href: window.location.href,
      host: window.location.host,
    });

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/login`,
          scopes: "read:user user:email",
        },
      });

      console.log("Supabase OAuth response:", { data, error });

      if (error) {
        console.error("Error logging in with GitHub:", error.message);
      }
    } catch (err) {
      console.error("Exception during login:", err);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 w-full max-w-sm", className)}
      {...props}
    >
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl">Get started</CardTitle>
          <CardDescription>Log in with GitHub to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGitHubLogin}
            >
              Continue with GitHub
              <Image
                src="/github.svg"
                alt="GitHub logo"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Button>
            <TooltipProvider delayDuration={150}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      disabled
                    >
                      Continue with Google
                      <Image
                        src="/google.svg"
                        alt="Google logo"
                        width={20}
                        height={20}
                        className="h-5 w-5"
                      />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-muted-foreground text-center">
              By continuing, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
