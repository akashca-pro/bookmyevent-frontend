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
                <BookingsList />
            </section>
        </div>
    );
};

export default UserDashboardPage;
