import { z } from "zod";

const usernameSchema = z.string();

export const usernameValidator = (username) => {
  try {
    usernameSchema.parse(username);
    return { isValid: true, errorMessage: null };
  } catch (e) {
    
    if (e instanceof z.ZodError) {
      
      return { isValid: false, errorMessage: e.errors[0].message };
    }
    
    return { isValid: false, errorMessage: "Username validation failed" };
  }
};