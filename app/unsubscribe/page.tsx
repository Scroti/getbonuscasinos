"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Mail, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { unsubscribeFromNewsletter } from "@/lib/firebase/newsletter";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'not-found' | 'error'>('idle');
  const [message, setMessage] = useState("");

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage("");

    try {
      const result = await unsubscribeFromNewsletter(email);

      if (result === 'success') {
        setStatus('success');
        setMessage("You have been successfully unsubscribed from our newsletter.");
        setEmail("");
      } else if (result === 'not-found') {
        setStatus('not-found');
        setMessage("This email address is not subscribed to our newsletter.");
      } else {
        setStatus('error');
        setMessage("Something went wrong. Please try again later.");
      }
    } catch (error) {
      setStatus('error');
      setMessage("Failed to unsubscribe. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-foreground/10 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-block">
            <Logo titleSize="text-xl sm:text-2xl" subtitleSize="text-[0.65rem] sm:text-[0.7rem]" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Mail className="h-8 w-8 text-muted-foreground" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground mb-2">
                Unsubscribe
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email address to unsubscribe from our newsletter
              </p>
            </div>

            {status === 'success' ? (
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Unsubscribed Successfully</h2>
                <p className="text-sm text-muted-foreground">{message}</p>
                <Link href="/">
                  <Button className="w-full mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleUnsubscribe} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-foreground text-background hover:bg-foreground/90"
                >
                  {status === 'loading' ? 'Unsubscribing...' : 'Unsubscribe'}
                </Button>

                {message && (
                  <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
                    status === 'not-found'
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  }`}>
                    {status === 'not-found' && <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    {status === 'error' && <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                    <span>{message}</span>
                  </div>
                )}
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-foreground/10">
              <p className="text-xs text-muted-foreground text-center mb-4">
                We're sorry to see you go. If you change your mind, you can always subscribe again.
              </p>
              <div className="flex flex-col gap-2 text-xs">
                <Link href="/" className="text-primary hover:underline text-center">
                  ← Back to Home
                </Link>
                <Link href="/contact" className="text-primary hover:underline text-center">
                  Contact Us
                </Link>
              </div>
            </div>
          </Card>

          {/* Responsible Gaming Notice */}
          <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-foreground/10">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">Responsible Gaming</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are committed to promoting responsible gaming. If you need help, please visit{" "}
                  <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    BeGambleAware.org
                  </a>{" "}
                  or contact support organizations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

