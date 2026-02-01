"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, LogOut, Upload } from "lucide-react";
import Link from "next/link";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface DashboardContentProps {
  user: User;
}

export function DashboardContent({ user }: DashboardContentProps) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">DocTalk</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              {user.name || user.email}
            </span>
            {user.image && (
              <img
                src={user.image}
                alt={user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name || "there"}!
          </p>
        </div>

        {/* Documents Section */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Documents</h2>
            <Button disabled>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          {/* Empty State */}
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-lg font-medium">No documents yet</h3>
              <p className="mb-4 text-center text-sm text-muted-foreground">
                Your documents will appear here. Upload a PDF to get started.
              </p>
              <Button disabled variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload your first document
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
