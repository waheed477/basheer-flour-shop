import { ReactNode, useEffect, useState } from "react";
import { Route, Redirect } from "wouter";
import LoadingSpinner from "./LoadingSpinner";

interface PrivateRouteProps {
  path: string;
  component: React.ComponentType<any>;
  adminOnly?: boolean;
  children?: ReactNode;
}

export function PrivateRoute({ 
  path, 
  component: Component, 
  adminOnly = false,
  children 
}: PrivateRouteProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check authentication from localStorage
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      setIsAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        // Invalid data
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
    
    setIsChecking(false);
  }, []);

  const render = () => {
    if (isChecking) {
      return <LoadingSpinner />;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      return <Redirect to="/admin/login" />;
    }
    
    // Check admin access if required
    if (adminOnly && !isAdmin) {
      return <Redirect to="/admin/login" />;
    }
    
    // User is authenticated (and has admin access if required)
    return children ? <>{children}</> : <Component />;
  };

  return <Route path={path}>{render()}</Route>;
}

export default PrivateRoute;




// import * as React from "react"
// import { Route, Redirect, useLocation } from "wouter"
// import { LoadingSpinner } from "./LoadingSpinner"
// import { AlertMessage } from "./AlertMessage"
// import { useAuth, useAdminAccess } from "@/hooks/use-auth"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ShieldAlert, Lock, ArrowLeft } from "lucide-react"
// import type { ComponentProps } from "react"

// export interface PrivateRouteProps {
//   path: string
//   component: React.ComponentType<any>
//   adminOnly?: boolean
//   redirectTo?: string
//   showLoading?: boolean
//   fallback?: React.ReactNode
//   layout?: React.ComponentType<{ children: React.ReactNode }>
//   requireAuth?: boolean // Set to false for public routes that need auth context
// }

// export function PrivateRoute({
//   path,
//   component: Component,
//   adminOnly = false,
//   redirectTo = "/admin/login",
//   showLoading = true,
//   fallback,
//   layout: Layout,
//   requireAuth = true,
//   ...rest
// }: PrivateRouteProps & Omit<ComponentProps<typeof Route>, "component">) {
//   const [location] = useLocation()
//   const { canAccessAdmin, isAuthenticated, isLoading } = useAdminAccess()

//   // If we don't require auth, just render the component
//   if (!requireAuth) {
//     return <Route path={path} component={Component} {...rest} />
//   }

//   // Show loading spinner while checking auth
//   if (isLoading && showLoading) {
//     return (
//       <Route path={path}>
//         <div className="min-h-screen flex items-center justify-center">
//           <LoadingSpinner 
//             size="lg" 
//             text="Checking authentication..." 
//             fullScreen 
//           />
//         </div>
//       </Route>
//     )
//   }

//   // Check if user can access the route
//   const canAccess = adminOnly ? canAccessAdmin : isAuthenticated

//   if (!canAccess) {
//     // Custom fallback component
//     if (fallback) {
//       return <Route path={path}>{fallback}</Route>
//     }

//     // Default unauthorized view
//     return (
//       <Route path={path}>
//         <UnauthorizedView 
//           adminOnly={adminOnly} 
//           redirectTo={redirectTo} 
//           currentPath={location}
//         />
//       </Route>
//     )
//   }

//   // Authorized - render the component with optional layout
//   const WrappedComponent = Layout ? (
//     <Layout>
//       <Component {...rest} />
//     </Layout>
//   ) : (
//     <Component {...rest} />
//   )

//   return <Route path={path}>{WrappedComponent}</Route>
// }

// // Unauthorized view component
// function UnauthorizedView({ 
//   adminOnly, 
//   redirectTo, 
//   currentPath 
// }: { 
//   adminOnly: boolean; 
//   redirectTo: string; 
//   currentPath: string 
// }) {
//   const { isAuthenticated } = useAuth()
//   const isAdminRoute = adminOnly

//   React.useEffect(() => {
//     // Auto-redirect for non-authenticated users
//     if (!isAuthenticated && redirectTo) {
//       const timer = setTimeout(() => {
//         window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`
//       }, 2000)
//       return () => clearTimeout(timer)
//     }
//   }, [isAuthenticated, redirectTo, currentPath])

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <Card className="w-full max-w-md border-border shadow-lg">
//         <CardHeader className="space-y-4 text-center pb-8">
//           <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit">
//             {isAdminRoute ? (
//               <ShieldAlert className="h-8 w-8 text-destructive" />
//             ) : (
//               <Lock className="h-8 w-8 text-destructive" />
//             )}
//           </div>
//           <div>
//             <CardTitle className="text-2xl font-bold font-display">
//               {isAdminRoute ? "Admin Access Required" : "Authentication Required"}
//             </CardTitle>
//             <CardDescription>
//               {isAdminRoute 
//                 ? "You need administrator privileges to access this page." 
//                 : "Please log in to access this page."}
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <AlertMessage
//             variant={isAdminRoute ? "warning" : "info"}
//             title={isAdminRoute ? "Insufficient Permissions" : "Not Logged In"}
//             description={
//               isAdminRoute
//                 ? "Your account doesn't have the required administrator role."
//                 : "You need to be logged in to view this content."
//             }
//             showIcon
//           />
          
//           <div className="flex flex-col gap-3">
//             {isAuthenticated ? (
//               // Authenticated but not admin (for admin-only routes)
//               <>
//                 <Button
//                   onClick={() => window.location.href = "/"}
//                   variant="outline"
//                   className="gap-2"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back to Home
//                 </Button>
//                 <Button
//                   onClick={() => window.location.href = "/admin/login"}
//                   variant="ghost"
//                   size="sm"
//                 >
//                   Try Different Account
//                 </Button>
//               </>
//             ) : (
//               // Not authenticated
//               <>
//                 <Button
//                   onClick={() => window.location.href = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`}
//                   className="w-full"
//                 >
//                   {isAdminRoute ? "Go to Admin Login" : "Log In"}
//                 </Button>
//                 <Button
//                   onClick={() => window.location.href = "/"}
//                   variant="outline"
//                   className="w-full gap-2"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back to Home
//                 </Button>
//               </>
//             )}
//           </div>

//           {!isAuthenticated && (
//             <p className="text-center text-sm text-muted-foreground">
//               Redirecting to login in 2 seconds...
//             </p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// // HOC for protecting components (alternative to route-based protection)
// export function withAuth<P extends object>(
//   WrappedComponent: React.ComponentType<P>,
//   options: {
//     adminOnly?: boolean
//     redirectTo?: string
//     fallback?: React.ReactNode
//   } = {}
// ) {
//   const { adminOnly = false, redirectTo = "/admin/login", fallback } = options

//   return function WithAuthComponent(props: P) {
//     const { canAccessAdmin, isAuthenticated, isLoading } = useAdminAccess()
//     const [location] = useLocation()

//     if (isLoading) {
//       return <LoadingSpinner size="lg" text="Checking permissions..." fullScreen />
//     }

//     const canAccess = adminOnly ? canAccessAdmin : isAuthenticated

//     if (!canAccess) {
//       if (fallback) return <>{fallback}</>

//       return (
//         <UnauthorizedView 
//           adminOnly={adminOnly} 
//           redirectTo={redirectTo} 
//           currentPath={location}
//         />
//       )
//     }

//     return <WrappedComponent {...props} />
//   }
// }

// // Route guard for programmatic navigation
// export function useRouteGuard() {
//   const { canAccessAdmin, isAuthenticated, isLoading } = useAdminAccess()

//   return {
//     canAccess: (options: { adminOnly?: boolean } = {}) => {
//       if (isLoading) return null // Still checking
//       return options.adminOnly ? canAccessAdmin : isAuthenticated
//     },
//     redirectToLogin: (redirectPath?: string) => {
//       const path = redirectPath || window.location.pathname
//       window.location.href = `/admin/login?redirect=${encodeURIComponent(path)}`
//     },
//     isLoading,
//   }
// }

// export default PrivateRoute
