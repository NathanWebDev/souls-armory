"use client"

import { formRules } from "@/app/components/form-rules"

import { AVATAR_MAX_BYTES, AVATAR_TYPES } from "@/lib/avatar"
import { authClient } from "@/lib/auth-client"
import { cn, getInitials } from "@/lib/utils"
import { getAvatarUpload } from "@/server/profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/shad-components/ui/avatar"
import { Button } from "@/shad-components/ui/button"
import { Card, CardContent } from "@/shad-components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shad-components/ui/dialog"
import { Textarea } from "@/shad-components/ui/textarea"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"

const profileFormSchema = z.object({
  description: z.string()
  .max(formRules.descriptionRules.maxLength.maxLengthValue, { message: formRules.descriptionRules.maxLength.errorMessage }),
})

interface ProfileFormProps extends React.ComponentProps<"div"> {
  name: string
  email: string
  image: string | null
  description: string
}

export function ProfileForm({
  name,
  email,
  image,
  description,
  className,
  ...props
}: ProfileFormProps) {
  const router = useRouter()
  const fileInput = React.useRef<HTMLInputElement>(null)
  const [imageUrl, setImageUrl] = React.useState(image)
  const [uploading, setUploading] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      description,
    },
  })

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    const { error } = await authClient.updateUser({ description: values.description })

    if (error) {
      toast.error(error.message ?? "Could not save your description.")
    } else {
      toast.success("Profile saved")
      router.refresh()
    }
  }

  async function onDelete() {
    setDeleting(true)
    const { error } = await authClient.deleteUser({ callbackURL: "/user/login" })
    setDeleting(false)

    if (error) {
      toast.error(error.message ?? "Could not start account deletion.")
      return
    }

    setDeleteOpen(false)
    toast.success("Check your email to confirm deletion")
  }

  async function onPictureChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""

    if (!file) return

    if (!AVATAR_TYPES[file.type]) {
      toast.error("Please choose a PNG, JPEG or WebP image.")
      return
    }

    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("Image must be 2 MB or smaller.")
      return
    }

    setUploading(true)

    try {
      const upload = await getAvatarUpload(file.type)

      if (!upload.success) {
        toast.error(upload.message)
        return
      }

      const body = new FormData()
      Object.entries(upload.fields).forEach(([key, value]) => body.append(key, value))
      body.append("file", file)

      const response = await fetch(upload.url, { method: "POST", body })

      if (!response.ok) {
        toast.error("Picture upload failed.")
        return
      }

      const { error } = await authClient.updateUser({ image: upload.publicUrl })

      if (error) {
        toast.error(error.message ?? "Could not save your picture.")
        return
      }

      setImageUrl(upload.publicUrl)
      toast.success("Picture updated")
      router.refresh()
    } catch {
      toast.error("Picture upload failed.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Button asChild variant="outline" className="w-fit cursor-pointer">
        <Link href="/home">Back to home</Link>
      </Button>
      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={imageUrl ?? undefined} alt={name} />
              <AvatarFallback className="text-xl">{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">{name}</h1>
              <p className="text-muted-foreground text-sm">{email}</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={uploading}
                onClick={() => fileInput.current?.click()}
              >
                {uploading ? "Uploading..." : "Change picture"}
              </Button>
              <input
                ref={fileInput}
                type="file"
                accept={Object.keys(AVATAR_TYPES).join(",")}
                className="hidden"
                aria-label="Profile picture file"
                onChange={onPictureChange}
              />
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell other players about yourself" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                Save
              </Button>
            </form>
          </Form>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button type="button" variant="destructive" className="w-full">
                Delete profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your profile?</DialogTitle>
                <DialogDescription>
                  We&apos;ll email you a link to confirm. Your account is only deleted after you click it.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" disabled={deleting} onClick={onDelete}>
                  {deleting ? "Sending..." : "Send confirmation email"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
