import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetLoggedInUser } from "@/hooks/useGetLoggedInUser";
import Avatar from "react-avatar";
import AddressCard from "@/components/AddressCard";

const Profile = () => {
  const { data: userData } = useGetLoggedInUser();

  const user = userData?.user ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Profile Card */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-col items-center">
          <Avatar name={user?.name ?? "User"} size="80" round={true} />
          <CardTitle className="mt-4 text-xl font-semibold">
            {user?.name ?? "User"}
          </CardTitle>
          <p className="text-sm text-gray-500">
            {user?.email ?? "user@example.com"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.name ?? ""} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email ?? ""} />
            </div>
            {/* <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" />
            </div> */}
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Address Card */}
      <AddressCard />
    </div>
  );
};

export default Profile;
