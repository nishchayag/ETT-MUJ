import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">DocTalk</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Chat with your documents
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Upload PDF documents and have intelligent conversations with their
            contents. Get accurate answers backed by your document context.
          </p>
          <Link href="/login">
            <Button size="lg" className="px-8">
              Start for free
            </Button>
          </Link>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6">
              <FileText className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Upload Documents</h3>
              <p className="text-muted-foreground">
                Simply upload your PDF documents and we&apos;ll process them for
                intelligent conversations.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <MessageSquare className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Ask Questions</h3>
              <p className="text-muted-foreground">
                Ask anything about your documents and receive accurate,
                context-aware responses.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <Shield className="mb-4 h-10 w-10 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">Secure & Private</h3>
              <p className="text-muted-foreground">
                Your documents are processed securely. Only you have access to
                your data.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DocTalk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
