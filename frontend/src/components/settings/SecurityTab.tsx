import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff } from "lucide-react";

export const SecurityTab = () => {
    return (
        <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="oldPassword">Old Password</Label>
                        <div className="relative">
                            <Input id="oldPassword" type="password" placeholder="Enter password" />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                            <Input id="newPassword" type="password" placeholder="Enter password" />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                            <Input id="confirmPassword" type="password" placeholder="Re-enter password" />
                            <EyeOff className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
