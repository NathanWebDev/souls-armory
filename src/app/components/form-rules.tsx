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