import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/use-language";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertContactSchema } from "@/shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ShopSettings {
  shopName: string;
  whatsappNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  workingHours: string;
}

export default function Contact() {
  const { t, dir } = useLanguage();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Get settings from localStorage
      const savedSettings = localStorage.getItem('flour_shop_settings');
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          shopName: parsedSettings.shopName || 'Basheer Flour Shop',
          whatsappNumber: parsedSettings.whatsappNumber || '+923008666593',
          phoneNumber: parsedSettings.phoneNumber || '+923008666593',
          email: parsedSettings.email || 'info@basheerflour.com',
          address: parsedSettings.shopAddress || 'Near Sitara Gold Colony Faisalabad, Pakistan',
          workingHours: parsedSettings.shopTimings || 'Mon - Sat, 9am - 8pm'
        });
      } else {
        // Professional default settings
        setSettings({
          shopName: 'Basheer Flour Shop',
          whatsappNumber: '+923008666593',
          phoneNumber: '+923008666593',
          email: 'info@basheerflour.com',
          address: 'Near Sitara Gold Colony Faisalabad, Pakistan',
          workingHours: 'Mon - Sat, 9am - 8pm'
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Professional fallback settings
      setSettings({
        shopName: 'Basheer Flour Shop',
        whatsappNumber: '+923008666593',
        phoneNumber: '+923008666593',
        email: 'info@basheerflour.com',
        address: 'Near Sitara Gold Colony Faisalabad, Pakistan',
        workingHours: 'Mon - Sat, 9am - 8pm'
      });
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<z.infer<typeof insertContactSchema>>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof insertContactSchema>) {
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', values);
      
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you soon.",
        variant: "default",
        className: "bg-green-600 text-white border-none",
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  }

  const handleWhatsAppClick = () => {
    const whatsappNumber = settings?.whatsappNumber || '923008666593';
    const message = encodeURIComponent("Hello! I have a query about your products.");
    window.open(`https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    const phoneNumber = settings?.phoneNumber || '+923008666593';
    window.location.href = `tel:${phoneNumber.replace(/\D/g, '')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Contact Info */}
            <div className="space-y-8" dir={dir}>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-foreground">Contact Us</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Have questions about our premium flour and wheat products? Want to place a bulk order? 
                  Our team is here to help you with all your queries.
                </p>
              </div>

              <div className="space-y-6">
                {/* Shop Address */}
                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Shop Address</h3>
                    <p className="text-muted-foreground">Near Sitara Gold Colony Faisalabad, Pakistan</p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Phone Number</h3>
                    <p className="text-muted-foreground text-lg font-semibold">+923008666593</p>
                    <p className="text-sm text-muted-foreground mt-1">Mon - Sat, 24/7</p>
                    <div className="flex gap-3 mt-3">
                      <Button 
                        size="sm" 
                        onClick={handleWhatsAppClick}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        WhatsApp
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleCallClick}
                        className="border-primary text-primary hover:bg-primary/10"
                      >
                        Call Now
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">Mon - Sat, 9am - 8pm</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email</h3>
                    <p className="text-muted-foreground">info@basheerflour.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-lg" dir={dir}>
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Basheer Ahmed" className="h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="your@email.com" className="h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+92 300 8666593" className="h-12 rounded-xl" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your flour/wheat requirements, bulk order queries, or any other questions..." 
                            className="min-h-[150px] rounded-xl resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold rounded-xl bg-primary hover:bg-primary/90" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}