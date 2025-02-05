// import { Button } from "@components/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@components/components/ui/card";
// import { Input } from "@components/components/ui/input";
// import { Label } from "@components/components/ui/label";
// import React from "react";
// import { NavLink } from "react-router-dom";

// export function LoginForm() {
//   return (
//     <Card className="mx-auto max-w-sm shadow-sm">
//       <CardHeader>
//         <CardTitle className="text-2xl">Login</CardTitle>
//         <CardDescription>
//           Enter your email and Password below to login to your account
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid gap-4">
//           <div className="grid gap-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="admin@divyam.in"
//               required
//             />
//           </div>
//           <div className="grid gap-2">
//             <div className="flex items-center">
//               <Label htmlFor="password">Password</Label>
//               <NavLink
//                 to="/forger-password"
//                 className="ml-auto inline-block text-sm underline"
//               >
//                 Forgot your password?
//               </NavLink>
//             </div>
//             <Input id="password" type="password" required />
//           </div>
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//         </div>
//         <div className="mt-4 text-center text-sm">
//           Don&apos;t have an account Register and wait for Approval{" "}
//           <NavLink to="/register" className="underline">
//             Register Now..
//           </NavLink>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
