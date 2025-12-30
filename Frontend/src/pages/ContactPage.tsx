import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/hooks/use-language";
import { useCreateContact } from "@/hooks/use-contacts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { insertContactSchema } from "@/shared/schema"; // FIXED: Changed to frontend path
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
  const mutation = useCreateContact();
  const [settings, setSettings] = useState<ShopSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback to default settings
      setSettings({
        shopName: 'Basheer Atta Chakkee',
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
    mutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: t("contact.success"),
          variant: "default",
          className: "bg-green-600 text-white border-none",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    });
  }

  const handleWhatsAppClick = () => {
    if (!settings?.whatsappNumber) return;
    window.open(`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}`, '_blank');
  };

  const handleCallClick = () => {
    if (!settings?.phoneNumber) return;
    window.location.href = `tel:${settings.phoneNumber.replace(/\D/g, '')}`;
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
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-6 text-foreground">{t("contact.title")}</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t("contact.subtitle") || "Have questions about our products? Want to place a bulk order? We'd love to hear from you."}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                    <p className="text-muted-foreground">{settings?.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Call Us</h3>
                    <p className="text-muted-foreground">{settings?.phoneNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">{settings?.workingHours}</p>
                    <div className="flex gap-3 mt-3">
                      <Button 
                        size="sm" 
                        onClick={handleCallClick}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Call Now
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={handleWhatsAppClick}
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Business Hours</h3>
                    <p className="text-muted-foreground">{settings?.workingHours}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="bg-primary/10 p-3 rounded-full text-primary">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Email Us</h3>
                    <p className="text-muted-foreground">{settings?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-lg" dir={dir}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contact.name")}</FormLabel>
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
                        <FormLabel>{t("contact.email")}</FormLabel>
                        <FormControl>
                          <Input placeholder={settings?.email} className="h-12 rounded-xl" {...field} />
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
                        <FormLabel>{t("contact.phone")}</FormLabel>
                        <FormControl>
                          <Input placeholder={settings?.phoneNumber} className="h-12 rounded-xl" {...field} value={field.value || ''} />
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
                        <FormLabel>{t("contact.message")}</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you?" className="min-h-[150px] rounded-xl resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg font-semibold rounded-xl" 
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      t("contact.submit")
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