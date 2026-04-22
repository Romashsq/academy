"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorAlert } from "@/components/ui/error-alert";
import { OAuthSection } from "@/components/auth/oauth-section";
import { parseZodErrors } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers and _"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password is too long"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({ name: "", username: "", email: "", password: "" });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setServerError("");
  };

  // Username: только строчные, цифры и _; убираем @ если вставили
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^@/, "").toLowerCase().replace(/[^a-z0-9_]/g, "");
    setForm((prev) => ({ ...prev, username: raw }));
    setErrors((prev) => ({ ...prev, username: "" }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parseZodErrors<RegisterForm>(parsed.error.errors));
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.error ?? "Registration failed");
        return;
      }

      const signInResult = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-syne">Create an account</CardTitle>
          <CardDescription className="text-gray-400">
            Join VibeCode Academy for free
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <OAuthSection label="Sign up with Google" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <ErrorAlert message={serverError} />

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  name="name"
                  type="text"
                  placeholder="Alex Petrov"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  className="pl-10"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Username</label>
              <div className="relative">
                {/* @ prefix — always visible, non-editable */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm select-none pointer-events-none">
                  @
                </span>
                <Input
                  name="username"
                  type="text"
                  placeholder="alex_petrov"
                  value={form.username}
                  onChange={handleUsernameChange}
                  error={errors.username}
                  className="pl-7 font-mono"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                />
              </div>
              {!errors.username && (
                <p className="text-xs text-gray-600">
                  Letters, numbers and _ only · 3–20 characters
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="pl-10"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm text-gray-300 font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="pl-10 pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" loading={loading} size="lg">
              Create account
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By registering you agree to our{" "}
              <Link href="/terms" className="text-emerald-400 hover:underline">
                terms of service
              </Link>
            </p>
          </form>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
