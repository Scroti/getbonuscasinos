"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mail, MapPin, Send, MessageSquare } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formData);
        alert("Message sent! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-purple-500/30 flex flex-col">
            <Header />

            <main className="flex-grow pt-24 pb-16">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-12 md:py-20">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px]" />
                        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-indigo-600/10 blur-[80px]" />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 text-center">
                        <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl mb-6">
                            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Touch</span>
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                            Have questions about a bonus? Want to report an issue? Or just want to say hello? We'd love to hear from you.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="rounded-2xl border border-foreground/5 bg-foreground/5 p-8 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Email Us</h3>
                                            <p className="text-sm text-muted-foreground mb-1">For general inquiries and support</p>
                                            <a href="mailto:support@getbonuscasinos.com" className="text-sm font-medium hover:text-purple-600 transition-colors">
                                                support@getbonuscasinos.com
                                            </a>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                                            <MessageSquare className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Live Chat</h3>
                                            <p className="text-sm text-muted-foreground mb-1">Available Mon-Fri, 9am-5pm EST</p>
                                            <span className="text-sm font-medium">Click the chat bubble in the corner</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Office</h3>
                                            <p className="text-sm text-muted-foreground">
                                                123 Casino Blvd, Suite 777<br />
                                                Las Vegas, NV 89109
                                            </p>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="rounded-2xl border border-foreground/5 bg-foreground/5 p-8 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-2 text-foreground">Partner with Us</h3>
                                <p className="text-muted-foreground mb-6 text-sm">
                                    Are you a casino operator looking to get listed? We're always looking for new partners.
                                </p>
                                <Button className="w-full">
                                    Become a Partner
                                </Button>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="rounded-2xl border border-foreground/10 bg-background p-8 shadow-sm">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Name
                                        </label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        placeholder="How can we help?"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={5}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="Tell us more about your inquiry..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" size="lg">
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
