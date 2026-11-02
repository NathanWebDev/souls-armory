import { formRules } from "@/app/components/form-rules"

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024

export const AVATAR_TYPES: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
}

export function getAvatarPublicBase() {
    const { S3_BUCKET, S3_REGION, S3_PUBLIC_URL_BASE } = process.env

    return S3_PUBLIC_URL_BASE || `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`
}

// Returns an error message when a profile update is not allowed, otherwise null.
export function validateProfileUpdate(data: { description?: unknown; image?: unknown }) {
    const { description, image } = data
    const maxLength = formRules.descriptionRules.maxLength

    if (typeof description === "string" && description.length > maxLength.maxLengthValue) {
        return maxLength.errorMessage
    }

    if (typeof image === "string" && image !== "" && !image.startsWith(`${getAvatarPublicBase()}/avatars/`)) {
        return "Profile picture must be uploaded through Souls Armory."
    }

    return null
}
