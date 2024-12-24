import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Camera, Save, Lock, Mail, UserRound } from "lucide-react";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    profileImage: "",
  });

  useEffect(() => {
    // Check if user is admin before loading data
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (!userEmail || userRole !== "admin") {
      navigate("/login");
      return;
    }

    // Load user data
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: any) => u.email === userEmail);

    if (user) {
      setFormData(user);
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = users.map((user: any) =>
      user.email === formData.email ? formData : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));

    toast({
      title: "Success",
      description: "Your profile has been updated successfully!",
    });

    navigate("/admin-dashboard");
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <UserRound className="h-8 w-8 text-primary" />
          Admin Profile Settings
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.profileImage} />
                <AvatarFallback>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer">
                <label htmlFor="profileImage" className="cursor-pointer">
                  <Camera className="h-4 w-4 text-white" />
                </label>
                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <UserRound className="h-4 w-4" />
              Full Name
            </label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              readOnly
              className="bg-gray-100"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              New Password (leave empty to keep current)
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex gap-4 ">
            <Button type="submit" className="flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100 bg-teal-700 hover:bg-teal-600 text-current">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-2 ring-2 ring-slate-500 ring-offset-4 ring-offset-zinc-100 bg-teal-700 hover:bg-teal-600 text-current"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
