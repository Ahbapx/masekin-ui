"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@masekin/ui/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@masekin/ui/components/ui/card"
import { Input } from "@masekin/ui/components/ui/input"
import { Label } from "@masekin/ui/components/ui/label"
import { Separator } from "@masekin/ui/components/ui/separator"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"

export interface AuthActionResponse {
    error?: string
    success?: boolean
}

interface LoginFormProps {
    appName?: string
    logo?: React.ReactNode
    onEmailLogin?: (formData: FormData) => Promise<AuthActionResponse | undefined>
    onGoogleLogin?: () => Promise<void>
    registerLink?: string
}

export function LoginForm({
    appName = "Masekin Enterprise",
    logo,
    onEmailLogin,
    onGoogleLogin,
    registerLink = "/register",
}: LoginFormProps) {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const handleSubmit = async (formData: FormData) => {
        setError(null)
        setIsLoading(true)
        try {
            if (!onEmailLogin) return
            const result = await onEmailLogin(formData)
            if (result?.error) {
                setError(result.error)
            }
        } catch {
            // redirect throws, this is expected
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogle = async () => {
        if (!onGoogleLogin) return
        setIsGoogleLoading(true)
        try {
            await onGoogleLogin()
        } catch {
            // redirect throws
        }
    }

    return (
        <Card className="shadow-lg w-full max-w-md mx-auto">
            <CardHeader className="space-y-2 text-center pb-2">
                {logo && (
                    <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm mb-2">
                        {logo}
                    </div>
                )}
                <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
                <CardDescription className="font-medium">
                    Access your {appName} dashboard
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                {error && (
                    <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                        <AlertCircle className="size-4 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {/* Google */}
                {onGoogleLogin && (
                    <>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogle}
                            disabled={isGoogleLoading}
                        >
                            {isGoogleLoading ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <svg className="mr-2 size-4" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <Separator />
                            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs font-medium text-muted-foreground">
                                or
                            </span>
                        </div>
                    </>
                )}

                {/* Credentials */}
                {onEmailLogin && (
                    <>
                        <form action={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 size-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{" "}
                            <Link href={registerLink} className="font-bold text-primary hover:underline">
                                Create one
                            </Link>
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
