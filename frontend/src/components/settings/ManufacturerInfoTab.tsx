import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const ManufacturerInfoTab = () => {
    return (
        <div className="space-y-6">
            {/* Manufacturing Information */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Manufacturing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="slug">Manufacturer Slug</Label>
                        <Input id="slug" defaultValue="evergreenapparel" disabled className="bg-gray-50" />
                        <p className="text-xs text-gray-500">Slug cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input id="orgName" defaultValue="Evergreen Apparel Co." />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="orgBio">Organization Bio</Label>
                        <Textarea
                            id="orgBio"
                            className="resize-none"
                            rows={4}
                            defaultValue="Consumer Products"
                        />
                        <p className="text-xs text-gray-500">Tell brands about your manufacturing capabilities and what makes you unique.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="yearEstablished">Year Established</Label>
                        <select id="yearEstablished" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Select Year</option>
                            <option>2020</option>
                            <option>2010</option>
                            <option>2000</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="employees">Employee Count Range</Label>
                        <select id="employees" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <option>Select Range</option>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-200</option>
                            <option>201+</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Capabilities */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="categories">Product Categories</Label>
                        <Input id="categories" placeholder="Enter categories" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="manufacturingParams">Manufacturing Capabilities</Label>
                        <Input id="manufacturingParams" placeholder="Enter capabilities" />
                    </div>
                </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="certifications">Certifications</Label>
                        <Input id="certifications" placeholder="Enter certifications" />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="+1 512 555 0189" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Primary Contact Email</Label>
                        <Input id="email" defaultValue="michaelthompson@gmail.com" />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="personalEmail" className="rounded border-gray-300" defaultChecked />
                        <Label htmlFor="personalEmail" className="font-normal text-sm">Enter my personal email (emilyparker@gmail.com)</Label>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" defaultValue="https://example.com" />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Address */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="addr1">Address Line 1</Label>
                        <Input id="addr1" placeholder="Test Address 1" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="addr2">Address Line 2</Label>
                        <Input id="addr2" placeholder="Test Address 2" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="Austin" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State/Province</Label>
                            <select id="state" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>Texas</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="zip">Postal Code</Label>
                            <Input id="zip" placeholder="73301" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <select id="country" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option>United States</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-gray-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter Profile</Label>
                        <Input id="twitter" defaultValue="https://twitter.com/evergreenapparel" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn Company Page</Label>
                        <Input id="linkedin" defaultValue="https://linkedin.com/company/evergreenapparel" />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
