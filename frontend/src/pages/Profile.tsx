import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Profile Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://via.placeholder.com/150"
              alt="User Avatar"
            />
            <AvatarFallback className="text-4xl font-semibold">
              U
            </AvatarFallback>
          </Avatar>
          <CardTitle className="mt-4 text-xl font-semibold">John Doe</CardTitle>
          <p className="text-sm text-gray-500">johndoe@example.com</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="johndoe@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" />
            </div>
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Address */}
          <div>
            <h3 className="mb-2 font-medium">Shipping Address</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="shipping-street">Street</Label>
                <Input id="shipping-street" defaultValue="123 Main St" />
              </div>
              <div>
                <Label htmlFor="shipping-city">City</Label>
                <Input id="shipping-city" defaultValue="Manila" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping-state">State/Province</Label>
                  <Input id="shipping-state" defaultValue="NCR" />
                </div>
                <div>
                  <Label htmlFor="shipping-zip">ZIP Code</Label>
                  <Input id="shipping-zip" defaultValue="1000" />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div>
            <h3 className="mb-2 font-medium">Billing Address</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="billing-street">Street</Label>
                <Input id="billing-street" defaultValue="123 Main St" />
              </div>
              <div>
                <Label htmlFor="billing-city">City</Label>
                <Input id="billing-city" defaultValue="Manila" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing-state">State/Province</Label>
                  <Input id="billing-state" defaultValue="NCR" />
                </div>
                <div>
                  <Label htmlFor="billing-zip">ZIP Code</Label>
                  <Input id="billing-zip" defaultValue="1000" />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Save Addresses
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
