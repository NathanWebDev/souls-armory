"use client"

import { formRules } from "@/app/components/form-rules"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

import { createAuthClient } from "better-auth/client"

const emailFormSchema = z.object({
  email: z.string()
  .min(formRules.emailRules.minLength.minLengthValue, { message: formRules.emailRules.minLength.errorMessage })
  .email({ message: formRules.emailRules.minLength.errorMessage })
})

const authClient =  createAuthClient()

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: ""
    },
  })

  async function onSubmit(values: z.infer<typeof emailFormSchema>) {
    const { data, error } = await authClient.requestPasswordReset({
      email: values.email,
      redirectTo: "/user/reset-password"
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Forgot Password</h1>
                    <p className="text-muted-foreground text-balance">
                      Enter your email address below and we'll send you a link to reset your password.
                    </p>
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
                  <Button type="submit" className="w-full">
                    Reset Password
                  </Button>
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
    </div>
  )
}
