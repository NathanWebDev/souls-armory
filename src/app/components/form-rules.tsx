export const formRules = {
    userNameRules: {
        minLength: {
            minLengthValue: 2,
            errorMessage: "Username must be at least 2 characters"
        },
        maxLength: {
            maxLengthValue: 30,
            errorMessage: "Username must be at less than 30 characters"
        }
    },

    descriptionRules: {
        maxLength: {
            maxLengthValue: 500,
            errorMessage: "Description must be 500 characters or fewer"
        }
    },

    reviewRules: {
        titleMaxLength: {
            maxLengthValue: 100,
            errorMessage: "Title must be 100 characters or fewer"
        },
        bodyMaxLength: {
            maxLengthValue: 1000,
            errorMessage: "Review must be 1000 characters or fewer"
        }
    },

    emailRules: {
        minLength: {
            minLengthValue: 2,
            errorMessage: "Please enter a valid email address"
        }
    },

    passwordRules: {
        minLength: {
            minLengthValue: 8,
            errorMessage: "Password must be at least 8 characters"
        },
        maxLength: {
            maxLengthValue: 50,
            errorMessage: "Password must be at less than 50 characters"
        }
    }
}