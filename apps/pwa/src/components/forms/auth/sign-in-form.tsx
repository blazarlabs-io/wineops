/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from "@/lib/firebase/auth";
import { signInSchema } from "@/models/schemas/sign-in-schema";
import { SignIn } from "@/models/types/auth";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField as Input,
  Snackbar,
  Typography,
} from "@mui/material";
// import { toast } from '@repo/ui/components/base/toast';
import { cn } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignInForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState<SignIn>({
    email:
      typeof window !== "undefined"
        ? (localStorage.getItem("email") as string)
        : "",
    password: "",
  });
  const [errors, setErrors] = useState<any>(null);

  const [open, setOpen] = useState(false);

  const handleSignIn = () => {
    signIn(formData.email, formData.password)
      .then(() => {
        // toast.success('Logged in successfully!');
        setOpen(true);
        console.log("Logged in successfully!", typeof window);
        if (typeof window !== "undefined") {
          localStorage.set("email", formData.email);
          window.location.href = "/workspace";
        }
      })
      .catch((error: any) => {
        // const { title, description } = setErrorMessage(error);
        // toast.error(title + ': ' + description);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = signInSchema.validate(formData, { abortEarly: false });
    const fd = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(fd.entries());
    console.log(formValues);

    if (error) {
      const validationErrors: { [key: string]: string } = {};
      error.details.forEach((err: any) => {
        validationErrors[err.path[0]] = err.message;
      });
      console.log(validationErrors);
      setErrors(validationErrors);
    } else {
      setErrors({});

      // TODO: Set email in local storage
      localStorage.setItem("email", formData.email);
      console.log("Signed in successfully!");
      handleSignIn();
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          This is a success Alert inside a Snackbar!
        </Alert>
      </Snackbar>
      <Box
        className={cn("flex flex-col gap-6 max-w-[360px] w-full", className)}
        {...props}
      >
        <Card sx={{ borderRadius: "8px" }}>
          <CardContent>
            <Box className="flex flex-col gap-6">
              <Box display={"flex"} flexDirection={"column"} gap={2}>
                <Typography variant="h5">Sign in</Typography>
                <Typography>
                  Enter your email and password below to sign in to your account
                </Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <Box className="flex flex-col gap-6">
                  <Box className="grid gap-2">
                    <Input
                      variant="outlined"
                      id="email"
                      name="email"
                      label="Email"
                      required
                      onChange={handleChange}
                    />
                    {errors?.email && (
                      <Typography variant="body2" color="error">
                        {errors?.email}
                      </Typography>
                    )}
                  </Box>
                  <Box className="grid gap-2">
                    <Box className="flex items-center">
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </Box>
                    <Input
                      id="password"
                      label="Password"
                      name="password"
                      required
                      onChange={handleChange}
                    />
                    {errors?.password && (
                      <Typography variant="body2" color="error">
                        {errors?.password}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    type="submit"
                    size="large"
                    variant="contained"
                    className="w-full cursor-pointer"
                  >
                    Login
                  </Button>
                  <Box display={"flex"} alignItems={"center"} gap={2}>
                    <Box className="h-[1px] bg-status-error dark:bg-gray-500/80 w-full" />
                    <Typography className="text-center">or</Typography>
                    <Box className="h-[1px] bg-status-error dark:bg-gray-500/80 w-full" />
                  </Box>
                  <Button
                    variant="outlined"
                    size="large"
                    type="button"
                    className="w-full cursor-pointer"
                  >
                    Login with Google
                  </Button>
                </Box>
                <Box className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <a href="#" className="underline underline-offset-4">
                    Sign up
                  </a>
                </Box>
              </form>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
