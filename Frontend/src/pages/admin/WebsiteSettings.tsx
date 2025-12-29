import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Save, Phone, Mail, MapPin, Clock, Globe, Settings as SettingsIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { settingsFormSchema, type SettingsFormValues } from "@/shared/schema";

export default function WebsiteSettings() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const updateMutation = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      shopName: "",
      shopNameUrdu: "",
      whatsappNumber: "",
      phoneNumber: "",
      email: "",
      addressEn: "",
      addressUrdu: "",
      workingHours: "",
      enableWhatsAppButton: true,
      enableOnlineOrders: false,
      maintenanceMode: false,
    },
  });

  // Load settings when data is available
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await updateMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      // Error handling is done in mutation
    }
  };

  const isLoading = updateMutation.isPending || isLoadingSettings;

  if (isLoadingSettings && !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <h1 className="font-bold text-lg sm:text-xl">Website Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Website Configuration
              </CardTitle>
              <CardDescription>
                Manage your shop's contact information, working hours, and other settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Shop Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold">Shop Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="shopName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shop Name (English) *</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Bashir Flour Shop" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="shopNameUrdu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shop Name (Urdu) *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="مثلاً، بشیر آٹے کی دکان" 
                                dir="rtl" 
                                className="font-urdu"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Phone className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="whatsappNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <div className="p-1 bg-green-100 rounded">
                                <Phone className="h-3 w-3 text-green-600" />
                              </div>
                              WhatsApp Number *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+923001234567" 
                                {...field} 
                                type="tel"
                              />
                            </FormControl>
                            <FormDescription>
                              Used for WhatsApp contact button on website
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Shop Phone Number *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="+92421234567" 
                                {...field} 
                                type="tel"
                              />
                            </FormControl>
                            <FormDescription>
                              Displayed on contact page
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Shop Email *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="info@yourflourshop.com" 
                              {...field} 
                              type="email"
                            />
                          </FormControl>
                          <FormDescription>
                            For customer inquiries
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Address Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <MapPin className="h-4 w-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Shop Address</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="addressEn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (English) *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="123 Main Street, Lahore, Pakistan" 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="addressUrdu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address (Urdu) *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="123 مرکزی سڑک، لاہور، پاکستان" 
                                dir="rtl" 
                                className="min-h-[80px] font-urdu"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Working Hours */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Working Hours</h3>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="workingHours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Timings *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., 9:00 AM - 10:00 PM (Monday - Sunday)" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Displayed on website footer and contact page
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Additional Settings */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <SettingsIcon className="h-4 w-4 text-gray-600" />
                      </div>
                      <h3 className="text-lg font-semibold">Additional Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="enableWhatsAppButton"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">WhatsApp Button</FormLabel>
                              <FormDescription>
                                Show WhatsApp contact button on website
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="enableOnlineOrders"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Online Orders</FormLabel>
                              <FormDescription>
                                Enable online ordering feature
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="maintenanceMode"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Maintenance Mode</FormLabel>
                              <FormDescription>
                                Temporarily disable website for maintenance
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                    <Button
                      type="submit"
                      className="sm:flex-1 py-3"
                      disabled={isLoading}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Saving..." : "Save All Settings"}
                    </Button>
                    <Link href="/admin/dashboard">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto py-3"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}