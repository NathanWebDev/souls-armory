"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { toast } from "sonner"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { signUp } from "../../server/users"

import { createAuthClient } from "better-auth/client"

const signUpFormSchema = z.object({
  username: z.string().min(2, { message: "Username must be at least 2 characters" }).max(30),
  email: z.string().min(2, { message: "Please enter a valid email address" }).max(50).email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(50),
})

const authClient =  createAuthClient()

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    const { success, message } = await signUp(values.email, values.password, values.username);

    if (success) {
      toast.success(message as string);
    } else {
      toast.error(message as string);
    }
  }

  const discordSignIn = async () => {
    const data = await authClient.signIn.social({
        provider: "discord",
        callbackURL: "/home"
    })
  }

  const googleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/home"
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Create your account</h1>
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input className="w-full" placeholder="***" {...field} type="password"/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign up
                  </Button>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" className="w-full" onClick={googleSignIn}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Sign up with Google</span>
                    </Button>
                    <Button variant="outline" type="button" className="w-full" onClick={discordSignIn}>
                      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Discord--Streamline-Simple-Icons" height="24" width="24">
                        <desc>
                          Discord Streamline Icon: https://streamlinehq.com
                        </desc>
                        <title>Discord</title>
                        <path d="M20.317 4.3698a19.7913 19.7913 0 0 0 -4.8851 -1.5152 0.0741 0.0741 0 0 0 -0.0785 0.0371c-0.211 0.3753 -0.4447 0.8648 -0.6083 1.2495 -1.8447 -0.2762 -3.68 -0.2762 -5.4868 0 -0.1636 -0.3933 -0.4058 -0.8742 -0.6177 -1.2495a0.077 0.077 0 0 0 -0.0785 -0.037 19.7363 19.7363 0 0 0 -4.8852 1.515 0.0699 0.0699 0 0 0 -0.0321 0.0277C0.5334 9.0458 -0.319 13.5799 0.0992 18.0578a0.0824 0.0824 0 0 0 0.0312 0.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a0.0777 0.0777 0 0 0 0.0842 -0.0276c0.4616 -0.6304 0.8731 -1.2952 1.226 -1.9942a0.076 0.076 0 0 0 -0.0416 -0.1057c-0.6528 -0.2476 -1.2743 -0.5495 -1.8722 -0.8923a0.077 0.077 0 0 1 -0.0076 -0.1277c0.1258 -0.0943 0.2517 -0.1923 0.3718 -0.2914a0.0743 0.0743 0 0 1 0.0776 -0.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a0.0739 0.0739 0 0 1 0.0785 0.0095c0.1202 0.099 0.246 0.1981 0.3728 0.2924a0.077 0.077 0 0 1 -0.0066 0.1276 12.2986 12.2986 0 0 1 -1.873 0.8914 0.0766 0.0766 0 0 0 -0.0407 0.1067c0.3604 0.698 0.7719 1.3628 1.225 1.9932a0.076 0.076 0 0 0 0.0842 0.0286c1.961 -0.6067 3.9495 -1.5219 6.0023 -3.0294a0.077 0.077 0 0 0 0.0313 -0.0552c0.5004 -5.177 -0.8382 -9.6739 -3.5485 -13.6604a0.061 0.061 0 0 0 -0.0312 -0.0286zM8.02 15.3312c-1.1825 0 -2.1569 -1.0857 -2.1569 -2.419 0 -1.3332 0.9555 -2.4189 2.157 -2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332 -0.9555 2.4189 -2.1569 2.4189zm7.9748 0c-1.1825 0 -2.1569 -1.0857 -2.1569 -2.419 0 -1.3332 0.9554 -2.4189 2.1569 -2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332 -0.946 2.4189 -2.1568 2.4189Z" 
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Sign up with Discord</span>
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <a href="/user/login" className="underline underline-offset-4">
                      Log in
                    </a>
                  </div>
                </div>
              </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
