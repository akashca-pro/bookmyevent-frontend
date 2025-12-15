import { BookingsList } from "../../bookings/components/BookingsList";
import { useAppSelector } from "@/hooks/useAppSelector";

export const UserDashboardPage = () => {
    const { user } = useAppSelector((state) => state.auth);

    return (
        <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, <span className="text-neon-purple">{user?.name}</span>
                </h1>
                <p className="text-gray-400">Manage your event bookings and profile.</p>
            </header>

            {/* Upcoming Events Section (Placeholder/Reusable logic) */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="w-1 h-8 bg-neon-blue mr-3 rounded-full"></span>
                    My Bookings
                </h2>
                <BookingsList />
            </section>
        </div>
    );
};

export default UserDashboardPage;
