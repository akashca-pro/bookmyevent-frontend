import { useAppSelector } from "@/hooks/useAppSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield } from "lucide-react";

export const ProfilePage = () => {
    const { user } = useAppSelector((state) => state.auth);

    if (!user) {
        return <div className="text-white">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 pt-24 pb-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

            <Card className="bg-black/40 border-white/10 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <Avatar className="h-20 w-20 border-2 border-neon-purple shadow-[0_0_15px_rgba(180,41,255,0.3)]">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} />
                        <AvatarFallback className="bg-gray-800 text-white text-xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                        <CardTitle className="text-2xl text-white">{user.name}</CardTitle>
                        <Badge variant="outline" className="capitalize text-neon-blue border-neon-blue/30 bg-neon-blue/10">
                            {user.role}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="p-2 rounded-full bg-neon-purple/10 text-neon-purple">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Full Name</p>
                                <p className="text-white font-medium">{user.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="p-2 rounded-full bg-neon-blue/10 text-neon-blue">
                                <Mail className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Email Address</p>
                                <p className="text-white font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                            <div className="p-2 rounded-full bg-neon-green/10 text-neon-green">
                                <Shield className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Account Role</p>
                                <p className="text-white font-medium capitalize">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
