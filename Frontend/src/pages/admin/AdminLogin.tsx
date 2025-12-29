import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wheat, Loader2, Home } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const { login, checkAuth } = useAuth();
  const { t, dir } = useLanguage();
  const [, setLocation] = useLocation();
  const [redirectPath, setRedirectPath] = useState("/admin/dashboard");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Check for redirect parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectPath(redirect);
    }
  }, []);

  // Agar already logged in hai to dashboard redirect karo
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        JSON.parse(userStr);
        setIsRedirecting(true);
        
        const timer = setTimeout(() => {
          setLocation(redirectPath);
        }, 500);
        
        return () => clearTimeout(timer);
      } catch (error) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        console.error('Invalid user data in localStorage:', error);
      }
    }
  }, [setLocation, redirectPath]);

  useEffect(() => {
    if (checkAuth.data) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        setLocation(redirectPath);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [checkAuth.data, redirectPath, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login.mutate(values, {
      onSuccess: () => {
        setTimeout(() => {
          setLocation(redirectPath);
        }, 500);
      },
    });
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-background p-4" dir={dir}>
        <Card className="w-full max-w-md border-border shadow-xl">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
              <Wheat className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold font-display">
              {t("auth.welcomeBack")}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {dir === 'ltr' 
                ? 'Already logged in, redirecting to dashboard...' 
                : 'پہلے سے لاگ ان ہے، ڈیش بورڈ پر ری ڈائریکٹ ہو رہا ہے...'
              }
            </p>
            <Button 
              variant="link" 
              onClick={() => setLocation(redirectPath)}
              className="mt-4"
            >
              {dir === 'ltr' ? 'Click here if not redirected' : 'اگر ری ڈائریکٹ نہیں ہو رہا تو یہاں کلک کریں'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary/20 to-background p-4" dir={dir}>
      <Card className="w-full max-w-md border-border shadow-xl">
        <CardHeader className="space-y-4 text-center pb-8">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <Wheat className="h-10 w-10 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold font-display">
              Admin Login
            </CardTitle>
            <CardDescription className="text-base">
              Dashboard
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          {login.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {login.error?.message || t("auth.loginFailed")}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@example.com" 
                        {...field} 
                        className="h-12 text-base" 
                        autoComplete="username"
                        disabled={login.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-12 text-base" 
                        autoComplete="current-password"
                        disabled={login.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium touch-target"
                disabled={login.isPending}
                size="lg"
              >
                {login.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
              
              <div className="pt-4 border-t">
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-base gap-2 touch-target"
                    type="button"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}