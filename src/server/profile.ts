"use server";

import { headers } from "next/headers";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { auth } from "@/lib/auth";
import { AVATAR_MAX_BYTES, AVATAR_TYPES, getAvatarPublicBase } from "@/lib/avatar";

let s3Client: S3Client | undefined

export const getAvatarUpload = async (contentType: string) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        return { success: false as const, message: "You must be signed in to change your picture." }
    }

    if (!AVATAR_TYPES[contentType]) {
        return { success: false as const, message: "Please choose a PNG, JPEG or WebP image." }
    }

    const { S3_BUCKET, S3_REGION } = process.env

    if (!S3_BUCKET || !S3_REGION) {
        return { success: false as const, message: "Picture uploads are not configured yet." }
    }

    try {
        // One fixed key per user, so a new picture replaces the old file instead of piling up.
        const key = `avatars/${session.user.id}/avatar`

        const { url, fields } = await createPresignedPost((s3Client ??= new S3Client({ region: S3_REGION })), {
            Bucket: S3_BUCKET,
            Key: key,
            Fields: { "Content-Type": contentType },
            Conditions: [
                ["content-length-range", 1, AVATAR_MAX_BYTES],
                ["eq", "$Content-Type", contentType],
            ],
            Expires: 60,
        })

        // The version in the query string makes browsers fetch the new picture at the same address.
        const publicUrl = `${getAvatarPublicBase()}/${key}?v=${Date.now()}`

        return { success: true as const, url, fields, publicUrl }
    } catch (error) {
        const errorMessage = error as Error

        return { success: false as const, message: errorMessage.message || "Could not start the upload." }
    }
}
