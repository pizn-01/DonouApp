import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

export const AccountTab = () => {
    const { user } = useAuth();

    // Mock default values if user data missing
    const names = (user?.full_name || '').split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    return (
        <div className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            defaultValue={user?.email || 'michaelthompson@gmail.com'}
                            disabled
                            className="bg-gray-50"
                        />
                        <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" defaultValue={firstName || 'Michael'} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" defaultValue={lastName || 'Thompson'} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="jobTitle">Job Title</Label>
                            <Input id="jobTitle" defaultValue="Product Manufacturer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input id="dob" type="date" defaultValue="1985-12-28" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 512 555 0189" />
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Language & Timezone</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <select
                            id="timezone"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option>Eastern Time (US & Canada)</option>
                            <option>Pacific Time (US & Canada)</option>
                            <option>Central European Time</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select
                            id="language"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option>English</option>
                            <option>German</option>
                            <option>Spanish</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
