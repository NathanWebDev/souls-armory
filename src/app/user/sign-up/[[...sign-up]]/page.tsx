'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignUp from '@clerk/elements/sign-up'

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <SignUp.Root>
      <SignUp.Step
        name="start"
        className="w-96 rounded-2xl py-8 px-8 shadow-sm border space-y-6"
      >
        <header className="text-center">
          <h1 className="text-2xl font-bold mb-8">Create Account</h1>
        </header>
        <div className="grid grid-cols-2 gap-x-4">
          <Clerk.Connection
            name="google"
            className="flex items-center gap-x-3 justify-center font-medium border shadow-sm py-1.5 px-2.5 rounded-md"
          >
            <Clerk.Icon className="size-4" />
            Google
          </Clerk.Connection>
          <Clerk.Connection
            name="discord"
            className="flex items-center gap-x-3 justify-center font-medium border shadow-sm py-1.5 px-2.5 rounded-md"
          >
            <Clerk.Icon className="size-4" />
            Discord
          </Clerk.Connection>
        </div>
        <Clerk.Field name="username">
          <Clerk.Label className="text-sm font-medium">Username</Clerk.Label>
          <Clerk.Input className="w-full border rounded-md py-1.5 px-2.5" />
          <Clerk.FieldError className="block text-red-500 text-sm" />
        </Clerk.Field>
        <Clerk.Field name="email">
          <Clerk.Label className="text-sm font-medium">Email</Clerk.Label>
          <Clerk.Input className="w-full border rounded-md py-1.5 px-2.5" />
          <Clerk.FieldError className="block text-red-500 text-sm" />
        </Clerk.Field>
        <Clerk.Field name="password" className="space-y-2">
          <Clerk.Label className="text-sm font-medium">Password</Clerk.Label>
          <Clerk.Input type='password' className="w-full border rounded-md py-1.5 px-2.5" />
          <Clerk.FieldError className="block text-red-500 text-sm" />
        </Clerk.Field>
        <SignUp.Action asChild submit>
          <Button>
            Create Account
          </Button>
        </SignUp.Action>
        <div>
          <p>Already have an account? Click <Link href="/user/sign-in" className="underline muted">here</Link></p>
        </div>
      </SignUp.Step>
    </SignUp.Root>
  )
}