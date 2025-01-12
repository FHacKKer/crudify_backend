import {UserRole} from "../types";


interface IUserValidationResult {
    success: boolean;
    message: string;
    user: IUser;
}

interface IUser {
    name:string;
    username:string;
    email:string;
    password:string;
    role:UserRole
}

/**
 * Validates the user input, ensuring required fields are filled and data is formatted correctly.
 */
export function validateUser(user: IUser): IUserValidationResult {
    const { name, username, email, password,role } = user;
    // Trim values (except password)
    const trimmedName = name.trim();
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Normalize email by removing 'plus' aliasing (e.g., abc+123@mail.com -> abc@mail.com)

    // Check if there is a '+' in the email to handle aliasing
    let validTrimmedEmail = trimmedEmail;

    if (trimmedEmail.includes("+")) {
        const [first, last] = trimmedEmail.split("+");
        const validLast = last.split("@")[1];
        validTrimmedEmail = `${first}@${validLast}`;
    }

    // Validate fields
    if (!trimmedName || !trimmedUsername || !validTrimmedEmail || !password) {
        return {
            success: false,
            message: "All fields are required: name, username, email, and password.",
            user: user,
        };
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(validTrimmedEmail)) {
        return {
            success: false,
            message: "Invalid email format. Please provide a valid email address.",
            user,
        };
    }

    // Username validation to ensure no spaces
    const usernameRegex = /^\S+$/;
    if (!usernameRegex.test(trimmedUsername)) {
        return {
            success: false,
            message: "Username must not contain spaces.",
            user,
        };
    }

    if(role !== "user" && role !== "admin" && role !== "moderator") {
        return {
            success:false,
            message:"Invalid role. The specified role is not available.",
            user,
        }
    }

    // Return the processed user object with validated fields
    const processedUser:IUser = {
        name: trimmedName,
        username: trimmedUsername,
        email: validTrimmedEmail,
        password,
        role : role || "user"
    };

    return {
        success: true,
        message: `User Validated Successfully!`,
        user: processedUser,
    };
}
