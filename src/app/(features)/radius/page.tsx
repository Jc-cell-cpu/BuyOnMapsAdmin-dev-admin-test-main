// app/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { Separator } from "@/components/ui/separator";
import { editSettings, fetchPermission } from "./permissions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";


// Type definition for your API response
interface ApiResponse {
    response: {
        status: boolean;
        responseCode: number;
        message: string;
    };
    data: Array<{
        radius: { free: number };
        posts: { free: number };
        timeSlotGap: number;
        _id?: string;
    }>;
}

export default function SettingsDisplay() {
    const [settings, setSettings] = useState<ApiResponse["data"][0] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        radius: 0,
        posts: 0,
        timeSlotGap: 0,
        id: "",
    });
    const { toast } = useToast(); // Initialize shadcn UI toast hook

    // Function to fetch settings
    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const settingsData = await fetchPermission();
            const initialSettings = (settingsData as ApiResponse)?.data?.[0] || null;
            setSettings(initialSettings);
            if (initialSettings) {
                setFormData({
                    radius: initialSettings.radius.free,
                    posts: initialSettings.posts.free,
                    timeSlotGap: initialSettings.timeSlotGap,
                    id: initialSettings._id || "",
                });
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast({
                title: "Error Loading Settings",
                description: "Unable to fetch settings. Please try refreshing the page.",
                variant: "destructive", // Red color for error
                duration: 5000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch initial settings on mount
    useEffect(() => {
        loadSettings();
    }, []);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseInt(value) || 0,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await editSettings({
                id: formData.id,
                timeslot: formData.timeSlotGap,
                posts: formData.posts,
                radius: formData.radius,
            });

            if (response && (response as any).response?.status) {
                await loadSettings();
                setIsEditing(false);
                toast({
                    title: "Settings Updated",
                    description: "Your changes have been successfully saved.",
                    variant: "success", // Green color for success
                    duration: 1500,
                });
            } else {
                throw new Error("Update failed");
            }
        } catch (error) {
            console.error("Failed to update settings:", error);
            toast({
                title: "Update Failed",
                description: "There was an error saving your changes. Please try again.",
                variant: "destructive", // Red color for error
                duration: 1000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !settings) {
        return (
            <DefaultLayout>
                <div className="container mx-auto py-10 flex items-center justify-center">
                    <Loader />
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="container mx-auto py-10 max-w-3xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Settings Overview</h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            Configure and manage system settings
                        </p>
                    </div>
                    {!isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="transition-colors hover:bg-primary/90"
                        >
                            Edit Settings
                        </Button>
                    )}
                </div>

                <Card className="dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
                        <CardTitle className="text-2xl font-semibold">Configuration Settings</CardTitle>
                        <CardDescription className="text-base">
                            View and modify current system parameters
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {!settings ? (
                            <p className="text-red-500 font-medium">
                                Failed to load settings or no data available
                            </p>
                        ) : isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="radius" className="text-sm font-medium">
                                            Radius (Free Tier)
                                        </Label>
                                        <Input
                                            id="radius"
                                            name="radius"
                                            type="number"
                                            value={formData.radius}
                                            onChange={handleInputChange}
                                            min={0}
                                            className="mt-1 transition-all border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="posts" className="text-sm font-medium">
                                            Posts (Free Tier)
                                        </Label>
                                        <Input
                                            id="posts"
                                            name="posts"
                                            type="number"
                                            value={formData.posts}
                                            onChange={handleInputChange}
                                            min={0}
                                            className="mt-1 transition-all border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-2">
                                    <Label htmlFor="timeSlotGap" className="text-sm font-medium">
                                        Time Slot Gap (minutes)
                                    </Label>
                                    <Input
                                        id="timeSlotGap"
                                        name="timeSlotGap"
                                        type="number"
                                        value={formData.timeSlotGap}
                                        onChange={handleInputChange}
                                        min={0}
                                        className="mt-1 transition-all border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full max-w-[150px] bg-primary hover:bg-primary/90 transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                        disabled={isLoading}
                                        className="w-full max-w-[150px] hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md transition-all hover:shadow-md">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Radius Settings
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-muted-foreground">Free Tier</p>
                                            <p className="text-xl font-semibold">
                                                {settings.radius.free} km{settings.radius.free !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md transition-all hover:shadow-md">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            Post Settings
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-muted-foreground">Free Tier</p>
                                            <p className="text-xl font-semibold">
                                                {settings.posts.free} post{settings.posts.free !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-md transition-all hover:shadow-md">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Time Settings
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-muted-foreground">Time Slot Gap</p>
                                        <p className="text-xl font-semibold">{settings.timeSlotGap} minutes</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DefaultLayout>
    );
}